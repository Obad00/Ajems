import { createContext, useContext } from 'react'
import { storageKind } from '../storage'
import type { AdminSession, AuthService } from './AuthService'
import { getSupabaseClient } from '../storage/supabaseClient'
import { MockAuthService } from './MockAuthService'
import { SupabaseAuthService } from './SupabaseAuthService'

export function createAuth(): AuthService {
  if (storageKind() === 'supabase') return new SupabaseAuthService(getSupabaseClient())
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
