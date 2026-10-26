export type AdminSession = { email: string }

/**
 * Admin authentication contract (mock in demo, Supabase Auth in production).
 * Accounts are created by hand in Supabase: there is no public sign-up.
 */
export interface AuthService {
  readonly kind: 'mock' | 'supabase'
  getSession(): Promise<AdminSession | null>
  signIn(email: string, password: string): Promise<AdminSession>
  signOut(): Promise<void>
}

/** Message safe to show: never says whether the email exists. */
export class AuthError extends Error {
  constructor(message = 'Email ou mot de passe incorrect.') {
    super(message)
    this.name = 'AuthError'
  }
}
