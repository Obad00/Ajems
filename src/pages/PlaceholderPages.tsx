import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../ui/Button'

/** Temporary home page: the full version comes in step 3 of the plan. */
export function HomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-sm font-semibold tracking-wide text-gold-ink uppercase">AJEMS</p>
      <h1 className="text-4xl font-bold sm:text-5xl">Ensemble, faisons grandir l'entrepreneuriat à Mermoz-Sacré-Cœur.</h1>
      <ButtonLink to="/adhesion" iconRight={<ArrowRight aria-hidden className="size-5" />} className="w-full sm:w-auto">
        Demander mon adhésion
      </ButtonLink>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-center sm:px-6">
      <p className="font-mono text-sm font-semibold text-gold-ink">404</p>
      <h1 className="text-3xl font-bold">Page introuvable</h1>
      <p className="text-muted">Cette page n'existe pas ou n'est pas encore disponible.</p>
      <ButtonLink to="/" variant="secondary">
        Retour à l'accueil
      </ButtonLink>
    </div>
  )
}
