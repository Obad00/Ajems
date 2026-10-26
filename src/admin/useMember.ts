import { useCallback, useEffect, useState } from 'react'
import { useRepository } from '../storage'
import type { Member } from '../storage/MemberRepository'

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; members: Member[] }

export function useMembers() {
  const repo = useRepository()
  const [state, setState] = useState<State>({ status: 'loading' })
  useEffect(() => {
    let active = true
    repo.list().then(
      (members) => active && setState({ status: 'ready', members }),
      () => active && setState({ status: 'error' }),
    )
    return () => {
      active = false
    }
  }, [repo])
  return state
}

type OneState = { status: 'loading' } | { status: 'error' } | { status: 'missing' } | { status: 'ready'; member: Member }

export function useMember(id: string | undefined) {
  const repo = useRepository()
  const [state, setState] = useState<OneState>({ status: 'loading' })
  const toState = (member: Member | null): OneState => (member ? { status: 'ready', member } : { status: 'missing' })

  useEffect(() => {
    if (!id) return
    let active = true
    repo.getById(id).then(
      (member) => active && setState(toState(member)),
      () => active && setState({ status: 'error' }),
    )
    return () => {
      active = false
    }
  }, [repo, id])

  /** Re-reads the member after an action (e.g. status change). */
  const load = useCallback(async () => {
    if (!id) return
    setState(toState(await repo.getById(id)))
  }, [repo, id])
  // No id in the URL: derived during render rather than set in the effect.
  return { state: id ? state : ({ status: 'missing' } as const), reload: load }
}
