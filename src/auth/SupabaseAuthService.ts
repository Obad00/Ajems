import type { SupabaseClient } from '@supabase/supabase-js'
import { AuthError, type AdminSession, type AuthService } from './AuthService'

/**
 * Supabase Auth (email + password). The session lives in memory (persistSession: false).
 * Being authenticated is not enough: the account must be listed in public.admins.
 */
export class SupabaseAuthService implements AuthService {
  readonly kind = 'supabase' as const
  private readonly db: SupabaseClient

  constructor(db: SupabaseClient) {
    this.db = db
  }

  private async isAdmin(userId: string) {
    const { data, error } = await this.db.from('admins').select('user_id').eq('user_id', userId).maybeSingle()
    return !error && !!data
  }

  async getSession(): Promise<AdminSession | null> {
    const { data } = await this.db.auth.getSession()
    const user = data.session?.user
    if (!user?.email || !(await this.isAdmin(user.id))) return null
    return { email: user.email }
  }

  async signIn(email: string, password: string): Promise<AdminSession> {
    const { data, error } = await this.db.auth.signInWithPassword({ email: email.trim(), password })
    if (error || !data.user?.email) throw new AuthError()
    if (!(await this.isAdmin(data.user.id))) {
      await this.db.auth.signOut()
      throw new AuthError("Ce compte n'a pas accès à l'administration.")
    }
    return { email: data.user.email }
  }

  async signOut() {
    await this.db.auth.signOut()
  }
}
