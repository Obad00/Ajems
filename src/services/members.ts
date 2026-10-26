import type { Sector } from '../schemas/common'
import { normalizeName } from '../schemas/common'
import type { Member, MemberStatus } from '../storage/MemberRepository'

export type MemberFilters = {
  query: string
  sector: Sector | ''
  status: MemberStatus | ''
  /** Every stored record has accepted (it is required to submit); kept for data imported later. */
  reglement: 'all' | 'accepted' | 'missing'
  sort: 'newest' | 'oldest'
}

export const DEFAULT_FILTERS: MemberFilters = { query: '', sector: '', status: '', reglement: 'all', sort: 'newest' }

const digits = (s: string) => s.replace(/\D/g, '')

/** Search on name, phone (digits only, with or without +221) and business name. */
function matchesQuery(m: Member, query: string) {
  const q = normalizeName(query)
  if (!q) return true
  const text = normalizeName(`${m.first_name} ${m.last_name} ${m.business_name} ${m.dossier_number}`)
  if (q.split(' ').every((word) => text.includes(word))) return true
  const qDigits = digits(query)
  return qDigits.length >= 3 && digits(m.phone).includes(qDigits)
}

export function filterMembers(members: Member[], f: MemberFilters): Member[] {
  return members
    .filter((m) => matchesQuery(m, f.query))
    .filter((m) => !f.sector || m.sectors.includes(f.sector))
    .filter((m) => !f.status || m.status === f.status)
    .filter((m) => {
      const accepted = Boolean(m.reglement_version && m.reglement_accepted_at)
      return f.reglement === 'all' || (f.reglement === 'accepted' ? accepted : !accepted)
    })
    .sort((a, b) => (f.sort === 'newest' ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at)))
}
