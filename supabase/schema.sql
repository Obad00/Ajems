-- =====================================================================
-- AJEMS — schéma Supabase (PostgreSQL)
-- À exécuter une fois dans Supabase > SQL Editor (voir README).
-- Ré-exécutable : les objets existants sont conservés ou remplacés.
--
-- Principes (BRIEF §2, §8) :
--   * le public n'a AUCUN droit direct sur les tables ; il enregistre une fiche
--     uniquement via la fonction submit_member(), qui ne renvoie que le numéro de dossier ;
--   * seuls les comptes présents dans public.admins lisent les fiches et modifient le statut ;
--   * aucune suppression via l'API ;
--   * public_stats() ne renvoie que des totaux, masqués sous le seuil de 10.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Types et séquence
-- ---------------------------------------------------------------------
do $$
begin
  create type public.member_status as enum ('nouvelle', 'en_examen', 'acceptee', 'refusee', 'a_completer');
exception
  when duplicate_object then null;
end
$$;

create sequence if not exists public.members_dossier_seq;

-- ---------------------------------------------------------------------
-- 2. Table des fiches
--    Les contraintes reprennent les schémas Zod du site : une requête qui
--    contourne le site est refusée de la même façon.
-- ---------------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  dossier_number text not null unique default (
    'AJEMS-' || to_char(now() at time zone 'Africa/Dakar', 'YYYY') || '-' ||
    lpad(nextval('public.members_dossier_seq')::text, 4, '0')
  ),
  created_at timestamptz not null default now(),
  status public.member_status not null default 'nouvelle',

  -- Étape 1 : identité et contact
  first_name text not null check (char_length(btrim(first_name)) between 1 and 80),
  last_name text not null check (char_length(btrim(last_name)) between 1 and 80),
  birth_year integer not null check (birth_year between 1940 and 2100),
  phone text not null check (phone ~ '^\+[0-9]{8,15}$'),
  email text check (email is null or (char_length(email) <= 120 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  quartier text not null check (char_length(btrim(quartier)) between 1 and 80),
  commune text not null check (char_length(btrim(commune)) between 1 and 80),
  zone_link text not null check (zone_link in ('habite', 'exerce', 'les_deux')),

  -- Étape 2 : entreprise ou projet
  member_type text not null check (member_type in ('entrepreneur', 'porteur_projet')),
  business_name text not null check (char_length(btrim(business_name)) between 1 and 120),
  sectors text[] not null check (
    cardinality(sectors) between 1 and 15 and
    sectors <@ array['agriculture', 'commerce', 'numerique', 'communication', 'education', 'btp', 'transport',
                     'artisanat', 'sante', 'restauration', 'finance', 'industrie', 'energie', 'services', 'autre']
  ),
  sector_other text check (sector_other is null or char_length(sector_other) <= 80),
  description text not null check (char_length(btrim(description)) between 20 and 1000),
  founded_on date,
  legal_status text check (legal_status is null or legal_status in (
    'non_formalise', 'entreprise_individuelle', 'gie', 'sarl', 'sa_sas', 'association_cooperative', 'autre'
  )),
  business_location text check (business_location is null or char_length(business_location) <= 120),
  links text check (links is null or char_length(links) <= 300),

  -- Étape 3 : compétences et besoins
  skills text not null check (char_length(btrim(skills)) between 1 and 500),
  services text check (services is null or char_length(services) <= 1000),
  experience text check (experience is null or char_length(experience) <= 1000),
  needs text[] not null default '{}' check (
    cardinality(needs) <= 6 and
    needs <@ array['formation', 'accompagnement', 'financement', 'partenaires', 'clients', 'autre']
  ),
  needs_details text check (needs_details is null or char_length(needs_details) <= 500),

  -- Étape 4 : règlement intérieur (horodatage serveur)
  reglement_version text not null check (char_length(btrim(reglement_version)) between 1 and 40),
  reglement_accepted_at timestamptz not null default now(),
  full_name_typed text not null check (char_length(btrim(full_name_typed)) between 1 and 170),
  accuracy_confirmed boolean not null check (accuracy_confirmed),

  constraint members_sector_other_required check (
    not ('autre' = any (sectors)) or char_length(btrim(coalesce(sector_other, ''))) > 0
  ),
  constraint members_founded_on_entrepreneurs_only check (member_type = 'entrepreneur' or founded_on is null),
  constraint members_founded_on_not_future check (founded_on is null or founded_on <= (created_at at time zone 'Africa/Dakar')::date)
);

create index if not exists members_phone_idx on public.members (phone);
create index if not exists members_created_at_idx on public.members (created_at desc);

-- ---------------------------------------------------------------------
-- 3. Administrateurs (ajoutés à la main, voir README)
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- 4. Enregistrement d'une fiche par le public
--    Le statut, l'identifiant, le numéro de dossier et les horodatages sont
--    imposés ici : le navigateur ne peut pas les choisir.
-- ---------------------------------------------------------------------
create or replace function public.submit_member(payload jsonb)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  max_per_phone constant integer := 3;
  v_phone text := payload ->> 'phone';
  v_birth_year integer;
  v_dossier text;
begin
  if v_phone is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'invalid_payload' using errcode = 'P0001';
  end if;

  v_birth_year := (payload ->> 'birth_year')::integer;
  if v_birth_year > extract(year from now())::integer then
    raise exception 'invalid_payload' using errcode = 'P0001';
  end if;

  -- Serialise submissions for the same phone so that the limit cannot be bypassed in parallel.
  perform pg_advisory_xact_lock(hashtext(v_phone));
  if (select count(*) from public.members where phone = v_phone) >= max_per_phone then
    raise exception 'phone_limit' using errcode = 'P0001';
  end if;

  insert into public.members (
    first_name, last_name, birth_year, phone, email, quartier, commune, zone_link,
    member_type, business_name, sectors, sector_other, description, founded_on, legal_status,
    business_location, links, skills, services, experience, needs, needs_details,
    reglement_version, full_name_typed, accuracy_confirmed
  ) values (
    btrim(payload ->> 'first_name'),
    btrim(payload ->> 'last_name'),
    v_birth_year,
    v_phone,
    nullif(btrim(payload ->> 'email'), ''),
    btrim(payload ->> 'quartier'),
    btrim(payload ->> 'commune'),
    payload ->> 'zone_link',
    payload ->> 'member_type',
    btrim(payload ->> 'business_name'),
    array(select jsonb_array_elements_text(coalesce(payload -> 'sectors', '[]'::jsonb))),
    nullif(btrim(payload ->> 'sector_other'), ''),
    btrim(payload ->> 'description'),
    nullif(payload ->> 'founded_on', '')::date,
    nullif(payload ->> 'legal_status', ''),
    nullif(btrim(payload ->> 'business_location'), ''),
    nullif(btrim(payload ->> 'links'), ''),
    btrim(payload ->> 'skills'),
    nullif(btrim(payload ->> 'services'), ''),
    nullif(btrim(payload ->> 'experience'), ''),
    array(select jsonb_array_elements_text(coalesce(payload -> 'needs', '[]'::jsonb))),
    nullif(btrim(payload ->> 'needs_details'), ''),
    payload ->> 'reglement_version',
    btrim(payload ->> 'full_name_typed'),
    coalesce((payload ->> 'accuracy_confirmed')::boolean, false)
  )
  returning dossier_number into v_dossier;

  return v_dossier;
exception
  when check_violation or not_null_violation or invalid_text_representation
    or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range
    or string_data_right_truncation or invalid_parameter_value then
    raise exception 'invalid_payload' using errcode = 'P0001';
end;
$$;

-- ---------------------------------------------------------------------
-- 5. Chiffres publics : totaux uniquement, masqués (null) sous 10
--    pour qu'aucune personne ne puisse être reconnue à partir d'un petit nombre.
-- ---------------------------------------------------------------------
create or replace function public.public_stats()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with active as (
    select member_type, sectors from public.members where status <> 'refusee'
  ),
  totals as (
    select
      (select count(*) from public.members where status = 'acceptee') as members_accepted,
      (select count(*) from public.members) as requests_received,
      (select count(*) from active where member_type = 'entrepreneur') as entrepreneurs,
      (select count(*) from active where member_type = 'porteur_projet') as project_holders,
      (select count(distinct s) from active, unnest(active.sectors) as s where s <> 'autre') as sectors_represented
  )
  select jsonb_build_object(
    'members_accepted', case when members_accepted >= 10 then members_accepted end,
    'requests_received', case when requests_received >= 10 then requests_received end,
    'entrepreneurs', case when entrepreneurs >= 10 then entrepreneurs end,
    'project_holders', case when project_holders >= 10 then project_holders end,
    'sectors_represented', case when sectors_represented >= 10 then sectors_represented end
  )
  from totals;
$$;

-- ---------------------------------------------------------------------
-- 6. Droits : rien par défaut, puis le strict nécessaire
--    (Supabase accorde par défaut des droits larges à anon/authenticated sur public.)
-- ---------------------------------------------------------------------
revoke all on table public.members from anon, authenticated;
revoke all on table public.admins from anon, authenticated;
revoke all on sequence public.members_dossier_seq from anon, authenticated;

-- Admins: read all fiches, update the status column only. No insert/delete grant.
grant select on table public.members to authenticated;
grant update (status) on table public.members to authenticated;
grant select on table public.admins to authenticated;

revoke all on function public.submit_member(jsonb) from public;
revoke all on function public.public_stats() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.submit_member(jsonb) to anon, authenticated;
grant execute on function public.public_stats() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------
-- 7. Row Level Security
-- ---------------------------------------------------------------------
alter table public.members enable row level security;
alter table public.admins enable row level security;

drop policy if exists members_admin_select on public.members;
create policy members_admin_select on public.members
  for select to authenticated
  using (public.is_admin());

drop policy if exists members_admin_update on public.members;
create policy members_admin_update on public.members
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert policy (fiches only come through submit_member) and no delete policy.

drop policy if exists admins_read_self on public.admins;
create policy admins_read_self on public.admins
  for select to authenticated
  using (user_id = auth.uid());
