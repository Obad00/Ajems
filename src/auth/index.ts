import { createContext, useContext } from 'react'
import { storageKind } from '../storage'
import type { AdminSession, AuthService } from './AuthService'
import { MockAuthService } from './MockAuthService'

export function createAuth(): AuthService {
  if (storageKind() === 'supabase') {
    // SupabaseAuthService arrives in step 5 of the plan (BRIEF §11).
    throw new Error('VITE_STORAGE=supabase is not available yet: use VITE_STORAGE=mock.')
  }
  return new MockAuthService()
}

export type AuthContextValue = {
  service: AuthService
  session: AdminSession | null
  /** false until the initial session check is done. */
  ready: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
