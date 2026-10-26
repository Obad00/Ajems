import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { MemberDraft, StepKey } from '../schemas/member'
import { submitMembership } from '../services/submission'
import { useRepository } from '../storage'
import { Card } from '../ui/Card'
import { Stepper } from '../ui/Stepper'
import { useMembershipDraft, type StepIndex } from './membership/draft'
import { Step1Identity } from './membership/Step1Identity'
import { Step2Business } from './membership/Step2Business'
import { Step3Skills } from './membership/Step3Skills'
import { Step4Reglement } from './membership/Step4Reglement'
import { Step5Summary } from './membership/Step5Summary'

const STEP_TITLES = [
  'Identité et contact',
  'Entreprise ou projet',
  'Compétences et besoins',
  'Règlement intérieur',
  'Récapitulatif',
] as const

const STEP_INDEX: Record<StepKey, StepIndex> = { identity: 0, business: 1, skills: 2, reglement: 3 }

export function MembershipPage() {
  const { draft, step, setStep, saveSection, reset } = useMembershipDraft()
  const repo = useRepository()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  // Move focus to the step title on every step change (not on first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [step])

  const go = (next: StepIndex) => {
    setError(null)
    setStep(next)
  }

  const saveAndGo =
    <K extends StepKey>(key: K, next: StepIndex) =>
    (values: MemberDraft[K]) => {
      saveSection(key, values)
      go(next)
    }

  const handleSubmit = async (honeypot: string) => {
    setSubmitting(true)
    setError(null)
    const result = await submitMembership(draft, honeypot, repo)
    setSubmitting(false)
    if (result.ok) {
      reset()
      navigate('/adhesion/confirmation', { replace: true, state: { dossierNumber: result.dossierNumber } })
      return
    }
    if (result.step) setStep(STEP_INDEX[result.step])
    setError(result.message)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-semibold tracking-wide text-gold-ink uppercase">Adhésion</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Demande d'adhésion à l'AJEMS</h1>
        <p className="text-muted">Environ 10 minutes. Vos réponses restent sur cette page jusqu'à l'envoi.</p>
      </header>

      {repo.kind === 'mock' && (
        <p className="mb-6 rounded-md border border-gold bg-gold-soft px-3 py-2 text-sm font-semibold text-gold-ink">
          Mode démonstration : aucune donnée n'est enregistrée.
        </p>
      )}

      <div className="mb-6">
        <Stepper steps={STEP_TITLES} current={step} />
      </div>

      <Card className="print-plain">
        <h2 ref={headingRef} tabIndex={-1} className="mb-6 text-2xl font-semibold focus:outline-none">
          <span className="sr-only">
            Étape {step + 1} sur {STEP_TITLES.length} :{' '}
          </span>
          {STEP_TITLES[step]}
        </h2>

        {step === 0 && <Step1Identity values={draft.identity} onNext={saveAndGo('identity', 1)} />}
        {step === 1 && (
          <Step2Business values={draft.business} onNext={saveAndGo('business', 2)} onBack={saveAndGo('business', 0)} />
        )}
        {step === 2 && <Step3Skills values={draft.skills} onNext={saveAndGo('skills', 3)} onBack={saveAndGo('skills', 1)} />}
        {step === 3 && (
          <Step4Reglement
            values={draft.reglement}
            firstName={draft.identity.first_name?.trim() ?? ''}
            lastName={draft.identity.last_name?.trim() ?? ''}
            onNext={saveAndGo('reglement', 4)}
            onBack={saveAndGo('reglement', 2)}
          />
        )}
        {step === 4 && (
          <Step5Summary
            draft={draft}
            onEdit={go}
            onBack={() => go(3)}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        )}
      </Card>
    </div>
  )
}
