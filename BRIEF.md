# BRIEF — Site officiel AJEMS (V1)

> Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur (Dakar, Sénégal). Association **en cours de formalisation**.
> Projet porté par Adama, secrétaire général d'AJEMS (dossier `partenariats/`). Rédigé le 26 octobre 2026. **Mise en ligne : jeudi 29 octobre 2026.** Les membres remplissent leur fiche et acceptent le règlement intérieur entre jeudi et dimanche ; réunion le lundi 2 novembre.
> Règles communes : `~/Desktop/Workspace/CLAUDE.md`.

## 1. Objectif de la V1

1. Présenter AJEMS (accueil, à propos).
2. Recueillir la **fiche de chaque membre** : identité, contact, entreprise ou projet, compétences, besoins.
3. Faire **lire et accepter le règlement intérieur** en ligne (acceptation électronique simple, horodatée, version enregistrée).
4. Donner à l'équipe un **admin protégé par un vrai mot de passe** : liste, recherche, filtres, statut, export CSV, fiche imprimable à signer sur papier.

Hors V1 : pièce d'identité, signature dessinée, espace membre, emails automatiques, statistiques.

## 2. Règles non négociables

- **Aucune pièce d'identité, aucune signature dessinée.** L'étape 4 = règlement intérieur.
- **Aucune donnée personnelle dans `localStorage`, `sessionStorage`, le dépôt git, les logs ou la console.** Le brouillon du formulaire vit en mémoire (état React) pendant la session.
- **Aucune clé secrète dans le frontend.** Seule la clé publique `anon` de Supabase, protégée par les règles RLS.
- **Le public peut seulement INSÉRER une fiche.** Il ne peut ni lire, ni modifier, ni supprimer. Seuls les comptes admin authentifiés lisent et modifient.
- **Ne rien inventer** : pas de statistiques, partenaires, témoignages, agréments, financements garantis. Textes à valider marqués `[À VALIDER]`.
- **L'acceptation en ligne n'est pas présentée comme une signature électronique qualifiée.** Texte : « Cette acceptation en ligne vaut engagement de votre part. Une signature papier pourra vous être demandée lors de la réunion. »
- **Données fictives uniquement** en démo, dans les tests et les captures.
- Ne pas affirmer la conformité légale. Mention : déclaration CDP à vérifier.
- Commits : diff montré avant chaque commit, aucun push sans accord, **aucune mention de Claude**.

## 3. Stack

React + TypeScript + Vite + Tailwind CSS + React Router + React Hook Form + Zod + Lucide. Supabase (`@supabase/supabase-js`) pour le stockage et l'auth admin. Vitest pour les tests.

Séparation stricte :
- `src/ui/` composants · `src/pages/` pages
- `src/schemas/` schémas Zod (un par étape + schéma complet)
- `src/services/submission.ts` logique d'envoi (validation finale, génération du numéro de dossier côté base)
- `src/storage/` interface `MemberRepository` + `MockRepository` (données fictives, en mémoire) + `SupabaseRepository`
- Choix par variable d'environnement : `VITE_STORAGE=mock|supabase`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Fournir `.env.example`, jamais de `.env` commité.

## 4. Identité visuelle

- Bleu marine `#0B1F3A` (dominant), bleu secondaire `#17365D`, doré `#C6A45A` (avec modération : détails, bordures, icônes, bouton secondaire), blanc, fond `#F5F7FA`, texte `#263238`.
- Institutionnel, moderne, sobre, ancré au Sénégal. Pas de dégradés excessifs, pas d'animations inutiles, pas de longs paragraphes sur l'accueil.
- Logo typographique provisoire « AJEMS » (pas de logo disponible pour l'instant).
- **Mobile d'abord** (390 px), puis tablette et ordinateur. Champs accessibles (labels, erreurs liées aux champs, focus visible, cibles ≥ 44 px, contraste ≥ 4.5:1 ; attention au doré sur blanc : ne pas l'utiliser pour du texte courant).
- Tout le site en français.

## 5. Pages

1. **Accueil** : en-tête + navigation mobile, bouton principal « Demander mon adhésion », titre « Ensemble, faisons grandir l'entrepreneuriat à Mermoz-Sacré-Cœur. », missions, avantages de l'adhésion (formulés sans promesse : « orientation vers », « mise en relation »), secteurs, processus en 3 étapes, FAQ (dont « L'adhésion garantit-elle un financement ? Non. »), pied de page (coordonnées `[À VALIDER]`, mentions légales, confidentialité).
2. **À propos** : mission, vision, objectifs, valeurs, fonctionnement associatif. Textes dans un fichier de contenu (`src/content/`) pour être modifiés facilement.
3. **Adhésion** : formulaire en 5 étapes (section 6).
4. **Confirmation** : message, numéro de dossier, prochaines étapes (« votre fiche sera examinée ; l'envoi ne vaut pas admission définitive »), contact `[À VALIDER]`.
5. **Règlement intérieur** : page publique lisible + lien PDF. Le texte vit dans `src/content/reglement.ts` avec un numéro de version (`v0-brouillon` tant qu'il n'est pas validé).
6. **Confidentialité / mentions légales** : quelles données, pourquoi, qui y accède, durée de conservation `[À VALIDER]`, comment demander la suppression.
7. **Admin** (`/admin`) : section 7. **404.**

## 6. Formulaire d'adhésion (5 étapes)

Barre de progression, bouton Retour sans perte de données, validation par étape, erreurs claires.

**Étape 1 — Identité et contact** : prénom*, nom*, année de naissance* (règle 18–45 ans affichée ; hors tranche → **avertissement non bloquant** « condition à confirmer par le bureau », règle à valider), téléphone* (format sénégalais accepté : 9 chiffres, +221, 00221 ; international accepté), email (facultatif), quartier*, commune*, lien avec la zone* (« J'habite à Mermoz-Sacré-Cœur » / « J'y exerce mon activité » / les deux).

**Étape 2 — Entreprise ou projet** : statut* (entrepreneur avec activité / porteur de projet), nom de l'entreprise ou du projet*, secteurs* (multi-sélection, liste fournie ci-dessous), description*, date de création (si activité existante uniquement), statut juridique (facultatif), localisation de l'activité, site web / réseaux (facultatifs).

Secteurs : Agriculture et agroalimentaire · Commerce et distribution · Technologie, informatique et numérique · Communication, marketing et création de contenu · Éducation et formation · BTP, architecture et immobilier · Transport et logistique · Artisanat et production · Santé et bien-être · Restauration et tourisme · Finance et services aux entreprises · Industrie et transformation · Énergie et environnement · Services professionnels · Autre secteur (champ libre si coché).

**Étape 3 — Compétences et besoins** : compétences principales*, services proposés, expérience professionnelle, besoins prioritaires (cases : formation, accompagnement, financement, partenaires, clients/débouchés, autre), précisions facultatives.

**Étape 4 — Règlement intérieur** : texte affiché (zone déroulante) + lien PDF, case* « J'ai lu et j'accepte le règlement intérieur (version X) », nom complet tapé* (doit correspondre au prénom + nom saisis, comparaison sans tenir compte des accents/majuscules), case* « Je certifie l'exactitude des informations », lien vers la notice de confidentialité.

**Étape 5 — Récapitulatif** : tout afficher, bouton « Modifier » par section, puis « Envoyer ma fiche ».

Enregistré avec chaque fiche : `reglement_version`, `reglement_accepted_at` (horodatage serveur), `full_name_typed`.

## 7. Admin

- Connexion Supabase Auth (email + mot de passe). Comptes créés à la main par Adama dans Supabase (pas d'inscription publique). Rôle admin vérifié par une table `admins` dans les règles RLS.
- Liste des membres : recherche (nom, téléphone, entreprise), filtres (secteur, statut du dossier, règlement accepté ou non), tri par date.
- Statuts : nouvelle demande, en cours d'examen, acceptée, refusée, à compléter.
- Fiche détaillée + **« Imprimer la fiche »** : page imprimable (A4) avec les informations du membre, le règlement intérieur (version acceptée) et une zone de signature manuscrite (date, lieu, signature).
- Export CSV (UTF-8 avec BOM pour Excel, séparateur `;`), colonnes autorisées seulement.
- En mode mock : même interface avec des données fictives et un bandeau « Mode démonstration — données fictives ».

## 8. Modèle de données (Supabase)

Table `members` : `id` (uuid), `dossier_number` (texte unique, ex. `AJEMS-2026-0001`, généré côté base par séquence), `created_at`, `status` (enum, défaut `nouvelle`), `first_name`, `last_name`, `birth_year`, `phone`, `email`, `quartier`, `commune`, `zone_link`, `member_type`, `business_name`, `sectors` (text[]), `sector_other`, `description`, `founded_on`, `legal_status`, `business_location`, `links`, `skills`, `services`, `experience`, `needs` (text[]), `needs_details`, `reglement_version`, `reglement_accepted_at`, `full_name_typed`, `accuracy_confirmed`.

RLS : `insert` autorisé à `anon` (avec contrôles de longueur et champs obligatoires) ; `select`/`update` réservés aux utilisateurs présents dans `admins` ; aucun `delete` public. Fournir le SQL complet dans `supabase/schema.sql` et la procédure de configuration dans le README.

Protection anti-abus : champ piège invisible (honeypot) + limite simple côté base (ex. pas plus de N fiches par numéro de téléphone). Pas de captcha tiers en V1.

## 9. Tests (Vitest, données fictives)

Schémas Zod (champs obligatoires, conditionnels selon le statut, année hors tranche = avertissement, nom tapé ≠ nom saisi = erreur, téléphones), passage entre étapes sans perte, récapitulatif, erreur de stockage (message clair, données conservées à l'écran), export CSV (accents, `;`, BOM).

## 10. Livraison

- Dossier : `~/Desktop/Workspace/partenariats/ajems/` (nouveau dépôt git, `main` + `develop`, travail sur `feature/...`).
- README : installation, `npm run dev`, configuration Supabase pas à pas, variables d'environnement, déploiement (Vercel ou Netlify en statique, ou Hostinger), checklist de mise en production.
- `CLAUDE.md` local, non suivi par git.

## 11. Ordre de travail

1. Projet + design system + composants de base (Button, Field, Select, MultiSelect, Checkbox, Stepper, Card, Layout avec menu mobile).
2. Formulaire complet en mode mock (priorité absolue), testé sur mobile.
3. Accueil, À propos, Règlement, Confidentialité, Confirmation, 404.
4. Admin en mode mock + export CSV + fiche imprimable.
5. `SupabaseRepository` + `schema.sql` + README.
6. Tests, build, captures mobile et ordinateur.

À chaque étape : captures (390 px et 1280 px) dans `captures/`, puis attendre la validation d'Adama.
