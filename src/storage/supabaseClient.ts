import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Single Supabase client shared by SupabaseRepository and SupabaseAuthService
 * (the repository must send the admin's session, otherwise RLS refuses the reads).
 * Public anon/publishable key only: protected by RLS. Never a service_role key.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required when VITE_STORAGE=supabase.')
  client = createClient(url, key, {
    auth: {
      // Admin session kept in memory only (BRIEF §2: nothing in localStorage / sessionStorage).
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  })
  return client
}
