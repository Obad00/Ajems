import type { MemberInput } from '../schemas/member'
import type { PublicStats } from '../services/stats'

export const MEMBER_STATUSES = [
  { value: 'nouvelle', label: 'Nouvelle demande' },
  { value: 'en_examen', label: "En cours d'examen" },
  { value: 'acceptee', label: 'Acceptée' },
  { value: 'refusee', label: 'Refusée' },
  { value: 'a_completer', label: 'À compléter' },
] as const

export type MemberStatus = (typeof MEMBER_STATUSES)[number]['value']

/** A stored member record, as read by the admin. */
export type Member = Omit<MemberInput, 'reglement_version'> & {
  /** Version accepted at submission time (may differ from the current text). */
  reglement_version: string
  id: string
  dossier_number: string
  created_at: string
  status: MemberStatus
  /** Set by the server at insert time, never by the browser. */
  reglement_accepted_at: string
}

export type CreateResult = { dossier_number: string }

/**
 * Storage contract shared by MockRepository and SupabaseRepository.
 * The public site only calls `create`; the other methods are admin-only
 * (enforced by RLS on Supabase).
 */
export interface MemberRepository {
  readonly kind: 'mock' | 'supabase'
  create(input: MemberInput): Promise<CreateResult>
  list(): Promise<Member[]>
  getById(id: string): Promise<Member | null>
  updateStatus(id: string, status: MemberStatus): Promise<void>
  /** Public totals for the home page (no individual data, masked below the threshold). */
  getPublicStats(): Promise<PublicStats>
}

/** Error with a message safe to show to the visitor (no personal data, no technical details). */
export class StorageError extends Error {
  constructor(message = "L'envoi n'a pas abouti. Vérifiez votre connexion puis réessayez.") {
    super(message)
    this.name = 'StorageError'
  }
}
