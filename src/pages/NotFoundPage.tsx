import { ButtonLink } from '../ui/Button'
import { usePageTitle } from '../ui/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page introuvable')
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="font-serif text-6xl font-bold text-navy">404</p>
      <div aria-hidden className="mx-auto h-1 w-16 bg-gold" />
      <h1 className="text-3xl font-bold">Page introuvable</h1>
      <p className="text-muted">Cette page n'existe pas ou a été déplacée.</p>
      <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
        <ButtonLink to="/">Retour à l'accueil</ButtonLink>
        <ButtonLink to="/adhesion" variant="secondary">
          Demander mon adhésion
        </ButtonLink>
      </div>
    </div>
  )
}
