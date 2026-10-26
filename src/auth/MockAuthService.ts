import { AuthError, type AdminSession, type AuthService } from './AuthService'

/** Demo account, shown on the login page in mock mode only. Not a real credential. */
export const DEMO_ACCOUNT = { email: 'bureau@ajems.example', password: 'demo-ajems-2026' } as const

/** In-memory session: a reload signs out. Nothing is written to web storage. */
export class MockAuthService implements AuthService {
  readonly kind = 'mock' as const
  private session: AdminSession | null = null

  async getSession() {
    return this.session
  }

  async signIn(email: string, password: string) {
    if (email.trim().toLowerCase() !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) throw new AuthError()
    this.session = { email: DEMO_ACCOUNT.email }
    return this.session
  }

  async signOut() {
    this.session = null
  }
}
