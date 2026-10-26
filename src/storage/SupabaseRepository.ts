import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { MemberInput } from '../schemas/member'
import { publicStatsSchema, type PublicStats } from '../services/stats'
import { StorageError, type CreateResult, type Member, type MemberRepository, type MemberStatus } from './MemberRepository'

type DbError = { message?: string; code?: string } | null

/** Turns database errors into messages safe to show (no technical details). */
export function toStorageError(error: DbError): StorageError {
  if (error?.message?.includes('phone_limit')) {
    return new StorageError(
      'Ce numéro de téléphone a déjà été utilisé pour 3 fiches. Contactez le bureau si vous devez corriger votre demande.',
    )
  }
  if (error?.message?.includes('invalid_payload')) {
    return new StorageError('Certaines informations ont été refusées. Vérifiez vos réponses puis réessayez.')
  }
  return new StorageError()
}

/** Admin errors: the session may have expired or the account may not be an admin. */
const adminError = () => new StorageError("Action impossible : reconnectez-vous à l'espace d'administration.")

export class SupabaseRepository implements MemberRepository {
  readonly kind = 'supabase' as const
  private readonly db: SupabaseClient

  constructor(db: SupabaseClient) {
    this.db = db
  }

  /** Public: only through the submit_member function, which returns the dossier number only. */
  async create(input: MemberInput): Promise<CreateResult> {
    const { data, error } = await this.db.rpc('submit_member', { payload: input })
    if (error) throw toStorageError(error)
    const parsed = z.string().regex(/^AJEMS-\d{4}-\d+$/).safeParse(data)
    if (!parsed.success) throw new StorageError()
    return { dossier_number: parsed.data }
  }

  async list(): Promise<Member[]> {
    const { data, error } = await this.db.from('members').select('*').order('created_at', { ascending: false })
    if (error) throw adminError()
    return (data ?? []) as Member[]
  }

  async getById(id: string): Promise<Member | null> {
    const { data, error } = await this.db.from('members').select('*').eq('id', id).maybeSingle()
    if (error) throw adminError()
    return (data as Member | null) ?? null
  }

  /** Only the status column can be updated (column-level grant in schema.sql). */
  async updateStatus(id: string, status: MemberStatus): Promise<void> {
    const { data, error } = await this.db.from('members').update({ status }).eq('id', id).select('id')
    if (error) throw adminError()
    if (!data?.length) throw new StorageError('Fiche introuvable.')
  }

  /** Totals only; unexpected keys are dropped by the schema. */
  async getPublicStats(): Promise<PublicStats> {
    const { data, error } = await this.db.rpc('public_stats')
    if (error) throw new StorageError()
    return publicStatsSchema.parse(data)
  }
}
