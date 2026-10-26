import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AdminSession, AuthService } from './AuthService'
import { AuthContext } from '.'

export function AuthProvider({ service, children }: { service: AuthService; children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    service.getSession().then((s) => {
      if (!active) return
      setSession(s)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [service])

  const signIn = useCallback(
    async (email: string, password: string) => {
      setSession(await service.signIn(email, password))
    },
    [service],
  )

  const signOut = useCallback(async () => {
    await service.signOut()
    setSession(null)
  }, [service])

  const value = useMemo(() => ({ service, session, ready, signIn, signOut }), [service, session, ready, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
