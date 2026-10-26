import { z } from 'zod'

export const SECTORS = [
  { value: 'agriculture', label: 'Agriculture et agroalimentaire' },
  { value: 'commerce', label: 'Commerce et distribution' },
  { value: 'numerique', label: 'Technologie, informatique et numérique' },
  { value: 'communication', label: 'Communication, marketing et création de contenu' },
  { value: 'education', label: 'Éducation et formation' },
  { value: 'btp', label: 'BTP, architecture et immobilier' },
  { value: 'transport', label: 'Transport et logistique' },
  { value: 'artisanat', label: 'Artisanat et production' },
  { value: 'sante', label: 'Santé et bien-être' },
  { value: 'restauration', label: 'Restauration et tourisme' },
  { value: 'finance', label: 'Finance et services aux entreprises' },
  { value: 'industrie', label: 'Industrie et transformation' },
  { value: 'energie', label: 'Énergie et environnement' },
  { value: 'services', label: 'Services professionnels' },
  { value: 'autre', label: 'Autre secteur' },
] as const

export const NEEDS = [
  { value: 'formation', label: 'Formation' },
  { value: 'accompagnement', label: 'Accompagnement' },
  { value: 'financement', label: 'Financement' },
  { value: 'partenaires', label: 'Partenaires' },
  { value: 'clients', label: 'Clients et débouchés' },
  { value: 'autre', label: 'Autre' },
] as const

export const ZONE_LINKS = [
  { value: 'habite', label: "J'habite à Mermoz-Sacré-Cœur" },
  { value: 'exerce', label: "J'y exerce mon activité" },
  { value: 'les_deux', label: 'Les deux' },
] as const

export const MEMBER_TYPES = [
  { value: 'entrepreneur', label: 'Entrepreneur avec une activité', description: 'Votre activité existe déjà.' },
  { value: 'porteur_projet', label: 'Porteur de projet', description: "Votre projet n'a pas encore démarré." },
] as const

export const LEGAL_STATUSES = [
  { value: 'non_formalise', label: 'Pas encore formalisé' },
  { value: 'entreprise_individuelle', label: 'Entreprise individuelle' },
  { value: 'gie', label: "GIE (groupement d'intérêt économique)" },
  { value: 'sarl', label: 'SARL / SUARL' },
  { value: 'sa_sas', label: 'SA / SAS' },
  { value: 'association_cooperative', label: 'Association ou coopérative' },
  { value: 'autre', label: 'Autre' },
] as const

type Values<T extends readonly { value: string }[]> = T[number]['value']
const values = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [Values<T>, ...Values<T>[]]

export const SECTOR_VALUES = values(SECTORS)
export const NEED_VALUES = values(NEEDS)
export const ZONE_LINK_VALUES = values(ZONE_LINKS)
export const MEMBER_TYPE_VALUES = values(MEMBER_TYPES)
export const LEGAL_STATUS_VALUES = values(LEGAL_STATUSES)

export type Sector = Values<typeof SECTORS>
export type Need = Values<typeof NEEDS>
export type ZoneLink = Values<typeof ZONE_LINKS>
export type MemberType = Values<typeof MEMBER_TYPES>
export type LegalStatus = Values<typeof LEGAL_STATUSES>

export function labelOf(list: readonly { value: string; label: string }[], value: string | null | undefined) {
  return list.find((o) => o.value === value)?.label ?? value ?? ''
}

/* ---------- Field helpers ---------- */

/** Required trimmed text with a max length. */
export const requiredText = (message: string, max: number) =>
  z.string({ error: message }).trim().min(1, message).max(max, `${max} caractères maximum`)

/** Optional trimmed text: empty string becomes null. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères maximum`)
    .optional()
    .transform((v) => (v ? v : null))

/* ---------- Phone ---------- */

/**
 * Normalises a phone number to E.164.
 * Senegal: 9 digits starting with 3 (landline) or 7 (mobile), optionally prefixed by +221 or 00221.
 * International: + or 00 followed by 8 to 15 digits.
 * Returns null when the number is not valid.
 */
export function normalizePhone(raw: string): string | null {
  const compact = raw.replace(/[\s.\-()]/g, '')
  const senegal = compact.match(/^(?:\+221|00221)?(\d{9})$/)
  if (senegal) return /^[37]\d{8}$/.test(senegal[1]) ? `+221${senegal[1]}` : null
  if (/^(?:\+|00)221/.test(compact)) return null // Senegal prefix with a wrong length
  const intl = compact.match(/^(?:\+|00)(\d{8,15})$/)
  return intl ? `+${intl[1]}` : null
}

export const phoneSchema = z
  .string({ error: 'Indiquez votre numéro de téléphone' })
  .trim()
  .min(1, 'Indiquez votre numéro de téléphone')
  .refine((v) => normalizePhone(v) !== null, 'Numéro invalide. Exemples : 77 123 45 67, +221 77 123 45 67 ou +33 6 12 34 56 78')
  .transform((v) => normalizePhone(v)!)

/* ---------- Names ---------- */

/** Lowercase, no accents, hyphens/apostrophes as spaces, single spaces. */
export function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** True when `typed` equals "first last" or "last first", ignoring accents, case and punctuation. */
export function namesMatch(typed: string, firstName: string, lastName: string) {
  const t = normalizeName(typed)
  const f = normalizeName(firstName)
  const l = normalizeName(lastName)
  if (!t || !f || !l) return false
  return t === `${f} ${l}` || t === `${l} ${f}`
}
