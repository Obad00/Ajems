import type { ReactNode } from 'react'
import type { FieldErrors } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'

export type StepFormProps<V> = {
  values: V
  onNext: (values: V) => void
  /** Saves the current values without validating them, then goes back. */
  onBack?: (values: V) => void
}

/** Count of leaf errors, for the error summary. */
function countErrors(errors: FieldErrors): number {
  return Object.values(errors).reduce<number>((n, e) => {
    if (!e) return n
    if ('message' in e && typeof e.message === 'string') return n + 1
    return n + countErrors(e as FieldErrors)
  }, 0)
}

export function ErrorSummary({ errors, submitCount }: { errors: FieldErrors; submitCount: number }) {
  const count = countErrors(errors)
  if (!submitCount || !count) return null
  return (
    <Alert tone="error" role="alert" title={count === 1 ? 'Un champ est à corriger.' : `${count} champs sont à corriger.`}>
      <p>Les champs concernés sont signalés en rouge ci-dessous.</p>
    </Alert>
  )
}

export function StepActions({ onBack, nextLabel = 'Continuer', nextIcon, loading }: { onBack?: () => void; nextLabel?: string; nextIcon?: ReactNode; loading?: boolean }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
      {onBack ? (
        <Button variant="ghost" onClick={onBack} icon={<ArrowLeft aria-hidden className="size-5" />} className="sm:px-3">
          Retour
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" loading={loading} iconRight={nextIcon ?? <ArrowRight aria-hidden className="size-5" />} className="w-full sm:w-auto sm:min-w-48">
        {nextLabel}
      </Button>
    </div>
  )
}

export function RequiredNote() {
  return <p className="text-sm text-muted">Tous les champs sont obligatoires, sauf ceux marqués « facultatif ».</p>
}
