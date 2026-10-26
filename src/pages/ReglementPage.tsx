import { Printer } from 'lucide-react'
import { REGLEMENT } from '../content/reglement'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ReglementText } from '../ui/ReglementText'

export function ReglementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 print:p-0">
      <Card className="print-plain space-y-6">
        <header className="space-y-2 border-b border-line pb-5">
          <p className="text-sm font-semibold tracking-wide text-gold-ink uppercase print:text-black">AJEMS</p>
          <h1 className="text-3xl font-bold">{REGLEMENT.title}</h1>
          <p className="text-sm text-muted print:text-black">
            Version {REGLEMENT.version} — {REGLEMENT.status}
          </p>
          <Button
            variant="secondary"
            className="no-print mt-2 w-full sm:w-auto"
            icon={<Printer aria-hidden className="size-5" />}
            onClick={() => window.print()}
          >
            Imprimer ou enregistrer en PDF
          </Button>
        </header>
        <ReglementText headingLevel={2} />
        <footer className="border-t border-line pt-4 text-xs text-muted print:text-black">
          Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur — {REGLEMENT.title}, version {REGLEMENT.version}
        </footer>
      </Card>
    </div>
  )
}
