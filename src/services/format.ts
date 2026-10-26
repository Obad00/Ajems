import { LEGAL_STATUSES, MEMBER_TYPES, NEEDS, SECTORS, ZONE_LINKS, labelOf } from '../schemas/common'
import { MEMBER_STATUSES, type Member } from '../storage/MemberRepository'

const TZ = 'Africa/Dakar'

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: TZ }).format(new Date(iso))
}

export function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: TZ }).format(new Date(iso))
}

export function formatPhone(phone: string) {
  return phone.replace(/^\+221(\d{2})(\d{3})(\d{2})(\d{2})$/, '+221 $1 $2 $3 $4')
}

export const statusLabel = (s: string) => labelOf(MEMBER_STATUSES, s)

export function sectorsLabel(m: Pick<Member, 'sectors' | 'sector_other'>) {
  return m.sectors.map((v) => (v === 'autre' && m.sector_other ? `Autre : ${m.sector_other}` : labelOf(SECTORS, v))).join(', ')
}

export type FieldRow = { label: string; value: string }
export type FieldSection = { title: string; rows: FieldRow[] }

/** All member fields grouped for the admin detail page and the printable form. */
export function memberSections(m: Member): FieldSection[] {
  return [
    {
      title: 'Identité et contact',
      rows: [
        { label: 'Prénom et nom', value: `${m.first_name} ${m.last_name}` },
        { label: 'Année de naissance', value: String(m.birth_year) },
        { label: 'Téléphone', value: formatPhone(m.phone) },
        { label: 'Email', value: m.email ?? '' },
        { label: 'Quartier', value: m.quartier },
        { label: 'Commune', value: m.commune },
        { label: 'Lien avec la zone', value: labelOf(ZONE_LINKS, m.zone_link) },
      ],
    },
    {
      title: 'Entreprise ou projet',
      rows: [
        { label: 'Situation', value: labelOf(MEMBER_TYPES, m.member_type) },
        { label: "Nom de l'entreprise ou du projet", value: m.business_name },
        { label: 'Secteurs', value: sectorsLabel(m) },
        { label: 'Description', value: m.description },
        { label: 'Date de création', value: m.founded_on ? formatDate(m.founded_on) : '' },
        { label: 'Statut juridique', value: m.legal_status ? labelOf(LEGAL_STATUSES, m.legal_status) : '' },
        { label: "Localisation de l'activité", value: m.business_location ?? '' },
        { label: 'Site web / réseaux', value: m.links ?? '' },
      ],
    },
    {
      title: 'Compétences et besoins',
      rows: [
        { label: 'Compétences principales', value: m.skills },
        { label: 'Services proposés', value: m.services ?? '' },
        { label: 'Expérience', value: m.experience ?? '' },
        { label: 'Besoins prioritaires', value: m.needs.map((v) => labelOf(NEEDS, v)).join(', ') },
        { label: 'Précisions', value: m.needs_details ?? '' },
      ],
    },
    {
      title: 'Règlement intérieur',
      rows: [
        { label: 'Version acceptée', value: m.reglement_version },
        { label: 'Acceptation en ligne', value: formatDateTime(m.reglement_accepted_at) },
        { label: 'Nom complet tapé', value: m.full_name_typed },
        { label: 'Exactitude certifiée', value: m.accuracy_confirmed ? 'Oui' : 'Non' },
      ],
    },
  ]
}
