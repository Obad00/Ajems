import { createContext, useContext } from 'react'
import type { MemberRepository } from './MemberRepository'
import { MockRepository } from './MockRepository'
import { demoMembers } from './seed'

export type StorageKind = 'mock' | 'supabase'

export function storageKind(): StorageKind {
  return import.meta.env.VITE_STORAGE === 'supabase' ? 'supabase' : 'mock'
}

/**
 * Picks the repository from VITE_STORAGE.
 * Mock mode only: `?simuler-erreur` in the URL makes every write fail (demo of the error state).
 */
export function createRepository(): MemberRepository {
  if (storageKind() === 'supabase') {
    // SupabaseRepository arrives in step 5 of the plan (BRIEF §11).
    throw new Error('VITE_STORAGE=supabase is not available yet: use VITE_STORAGE=mock.')
  }
  const failWrites = new URLSearchParams(window.location.search).has('simuler-erreur')
  return new MockRepository({ latency: 600, failWrites, seed: demoMembers() })
}

export const RepositoryContext = createContext<MemberRepository | null>(null)

export function useRepository(): MemberRepository {
  const repo = useContext(RepositoryContext)
  if (!repo) throw new Error('useRepository must be used inside <RepositoryContext.Provider>')
  return repo
}
