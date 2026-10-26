import { MEMBER_TYPES, NEEDS, ZONE_LINKS, LEGAL_STATUSES, labelOf } from '../schemas/common'
import type { Member } from '../storage/MemberRepository'
import { formatDate, formatDateTime, formatPhone, sectorsLabel, statusLabel } from './format'

/** Allowed columns only (BRIEF §7): no internal id. */
const COLUMNS: [header: string, value: (m: Member) => string][] = [
  ['Numéro de dossier', (m) => m.dossier_number],
  ['Date de la demande', (m) => formatDateTime(m.created_at)],
  ['Statut', (m) => statusLabel(m.status)],
  ['Prénom', (m) => m.first_name],
  ['Nom', (m) => m.last_name],
  ['Année de naissance', (m) => String(m.birth_year)],
  ['Téléphone', (m) => formatPhone(m.phone)],
  ['Email', (m) => m.email ?? ''],
  ['Quartier', (m) => m.quartier],
  ['Commune', (m) => m.commune],
  ['Lien avec la zone', (m) => labelOf(ZONE_LINKS, m.zone_link)],
  ['Situation', (m) => labelOf(MEMBER_TYPES, m.member_type)],
  ['Entreprise ou projet', (m) => m.business_name],
  ['Secteurs', (m) => sectorsLabel(m)],
  ['Description', (m) => m.description],
  ['Date de création', (m) => formatDate(m.founded_on)],
  ['Statut juridique', (m) => (m.legal_status ? labelOf(LEGAL_STATUSES, m.legal_status) : '')],
  ["Localisation de l'activité", (m) => m.business_location ?? ''],
  ['Site web / réseaux', (m) => m.links ?? ''],
  ['Compétences', (m) => m.skills],
  ['Services', (m) => m.services ?? ''],
  ['Expérience', (m) => m.experience ?? ''],
  ['Besoins', (m) => m.needs.map((v) => labelOf(NEEDS, v)).join(', ')],
  ['Précisions besoins', (m) => m.needs_details ?? ''],
  ['Version du règlement', (m) => m.reglement_version],
  ['Règlement accepté le', (m) => formatDateTime(m.reglement_accepted_at)],
  ['Nom complet tapé', (m) => m.full_name_typed],
  ['Exactitude certifiée', (m) => (m.accuracy_confirmed ? 'Oui' : 'Non')],
]

const BOM = '﻿'
const SEPARATOR = ';'

/**
 * One cell: quoted when needed, and neutralised against spreadsheet formula injection
 * (a value typed by the public starting with = + - @ would otherwise run as a formula in Excel).
 */
export function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[;"\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe
}

/** UTF-8 with BOM (so Excel reads accents), ";" separator, CRLF line endings. */
export function membersToCsv(members: Member[]) {
  const lines = [COLUMNS.map(([h]) => csvCell(h)).join(SEPARATOR), ...members.map((m) => COLUMNS.map(([, get]) => csvCell(get(m))).join(SEPARATOR))]
  return BOM + lines.join('\r\n') + '\r\n'
}

export function csvFileName(now = new Date()) {
  return `ajems-membres-${now.toISOString().slice(0, 10)}.csv`
}

/** Triggers the download in the browser (admin only; data never leaves the admin's machine otherwise). */
export function downloadCsv(members: Member[]) {
  const blob = new Blob([membersToCsv(members)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: csvFileName() })
  document.body.append(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
