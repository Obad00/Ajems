import { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '../auth'
import { useRepository } from '../storage'

/** Admin pages must not be indexed. */
function useNoIndex() {
  useEffect(() => {
    const meta = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex, nofollow' })
    document.head.append(meta)
    return () => meta.remove()
  }, [])
}

export function AdminLayout() {
  useNoIndex()
  const { session, signOut } = useAuth()
  const repo = useRepository()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="on-dark no-print bg-navy text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/admin" className="flex min-h-11 items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold text-white">AJEMS</span>
            <span className="font-serif text-white/80 italic">Administration</span>
          </Link>
          {session && (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-white/75 sm:inline">{session.email}</span>
              <button
                type="button"
                onClick={async () => {
                  await signOut()
                  navigate('/admin/connexion', { replace: true })
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold px-4 font-semibold text-white hover:bg-white/10"
              >
                <LogOut aria-hidden className="size-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>
      {repo.kind === 'mock' && (
        <p role="note" className="no-print border-b border-gold bg-gold-soft px-4 py-2 text-center text-sm font-semibold text-gold-ink">
          Mode démonstration — données fictives
        </p>
      )}
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
