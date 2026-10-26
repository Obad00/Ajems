import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseAuthService } from './SupabaseAuthService'

function fakeAuthClient({ signInError = false, isAdmin = true } = {}) {
  const signOut = vi.fn(() => Promise.resolve({ error: null }))
  const user = { id: 'u1', email: 'admin@example.com' }
  const builder = {
    select: () => builder,
    eq: () => builder,
    maybeSingle: () => Promise.resolve({ data: isAdmin ? { user_id: 'u1' } : null, error: null }),
  }
  const client = {
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve(signInError ? { data: { user: null }, error: { message: 'Invalid login credentials' } } : { data: { user }, error: null }),
      ),
      getSession: vi.fn(() => Promise.resolve({ data: { session: { user } } })),
      signOut,
    },
    from: vi.fn(() => builder),
  }
  return { client: client as unknown as SupabaseClient, signOut }
}

describe('SupabaseAuthService', () => {
  it('signs an admin in', async () => {
    const { client } = fakeAuthClient()
    expect(await new SupabaseAuthService(client).signIn(' admin@example.com ', 'pw')).toEqual({ email: 'admin@example.com' })
  })

  it('gives the same message for a wrong email or password', async () => {
    const { client } = fakeAuthClient({ signInError: true })
    await expect(new SupabaseAuthService(client).signIn('x@example.com', 'bad')).rejects.toThrow('Email ou mot de passe incorrect.')
  })

  it('refuses and signs out an authenticated account that is not in admins', async () => {
    const { client, signOut } = fakeAuthClient({ isAdmin: false })
    await expect(new SupabaseAuthService(client).signIn('other@example.com', 'pw')).rejects.toThrow("n'a pas accès")
    expect(signOut).toHaveBeenCalled()
  })

  it('does not restore a session for a non-admin', async () => {
    const { client } = fakeAuthClient({ isAdmin: false })
    expect(await new SupabaseAuthService(client).getSession()).toBeNull()
  })
})
