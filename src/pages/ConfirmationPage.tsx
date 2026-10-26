import { useLocation } from 'react-router'
import { CircleCheck } from 'lucide-react'
import { PAPER_SIGNATURE_NOTICE } from '../content/reglement'
import { ButtonLink } from '../ui/Button'
import { Card } from '../ui/Card'

export function ConfirmationPage() {
  const dossierNumber = (useLocation().state as { dossierNumber?: string | null } | null)?.dossierNumber ?? null

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <Card className="space-y-6 text-center">
        <CircleCheck aria-hidden className="mx-auto size-14 text-success" strokeWidth={1.5} />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Votre fiche a bien été envoyée</h1>
          <p className="text-muted">Merci pour votre demande d'adhésion à l'AJEMS.</p>
        </div>

        {dossierNumber && (
          <div className="rounded-lg border-2 border-gold bg-gold-soft px-4 py-4">
            <p className="text-sm font-semibold text-gold-ink">Votre numéro de dossier</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-navy">{dossierNumber}</p>
            <p className="mt-1 text-sm text-muted">Notez-le : il vous sera demandé pour tout échange avec le bureau.</p>
          </div>
        )}

        <div className="space-y-3 text-left">
          <h2 className="text-xl font-semibold">Prochaines étapes</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Votre fiche sera examinée par le bureau de l'AJEMS.</li>
            <li>L'envoi de la fiche ne vaut pas admission définitive : le bureau vous informera de sa décision.</li>
            <li>{PAPER_SIGNATURE_NOTICE}</li>
          </ol>
          <p className="text-sm text-muted">Une question ? Contact : [À VALIDER]</p>
        </div>

        <ButtonLink to="/" variant="secondary" className="w-full sm:w-auto">
          Retour à l'accueil
        </ButtonLink>
      </Card>
    </div>
  )
}
