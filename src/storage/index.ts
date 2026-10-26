import { createContext, useContext } from 'react'
import type { MemberRepository } from './MemberRepository'
import { MockRepository } from './MockRepository'
import { DEMO_STATS, demoMembers } from './seed'
import { SupabaseRepository } from './SupabaseRepository'
import { getSupabaseClient } from './supabaseClient'

export type StorageKind = 'mock' | 'supabase'

export function storageKind(): StorageKind {
  return import.meta.env.VITE_STORAGE === 'supabase' ? 'supabase' : 'mock'
}

/**
 * Picks the repository from VITE_STORAGE.
 * Mock mode only: `?simuler-erreur` in the URL makes every write fail (demo of the error state).
 */
export function createRepository(): MemberRepository {
  if (storageKind() === 'supabase') return new SupabaseRepository(getSupabaseClient())
  const failWrites = new URLSearchParams(window.location.search).has('simuler-erreur')
  return new MockRepository({ latency: 600, failWrites, seed: demoMembers(), stats: DEMO_STATS })
}

export const RepositoryContext = createContext<MemberRepository | null>(null)

export function useRepository(): MemberRepository {
  const repo = useContext(RepositoryContext)
  if (!repo) throw new Error('useRepository must be used inside <RepositoryContext.Provider>')
  return repo
}
