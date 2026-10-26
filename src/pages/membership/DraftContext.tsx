import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptyDraft, type MemberDraft, type StepKey } from '../../schemas/member'
import { DraftContext, type StepIndex } from './draft'

function isEmpty(draft: MemberDraft) {
  return JSON.stringify(draft) === JSON.stringify(emptyDraft())
}

/**
 * Holds the membership draft in memory (React state) for the whole session, above the router,
 * so that visiting /reglement or /confidentialite does not lose the answers.
 * Nothing is written to localStorage / sessionStorage (BRIEF §2).
 */
export function MembershipDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft)
  const [step, setStep] = useState<StepIndex>(0)

  const saveSection = useCallback(<K extends StepKey>(key: K, values: MemberDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: values }))
  }, [])

  const reset = useCallback(() => {
    setDraft(emptyDraft())
    setStep(0)
  }, [])

  // Warn before a reload / tab close would lose a started form.
  const dirty = !isEmpty(draft)
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const value = useMemo(() => ({ draft, step, setStep, saveSection, reset }), [draft, step, saveSection, reset])
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
}
