import { createContext, useContext } from 'react'
import type { MemberDraft, StepKey } from '../../schemas/member'

/** 0–3: steps of the draft, 4: summary. */
export type StepIndex = 0 | 1 | 2 | 3 | 4

export type DraftContextValue = {
  draft: MemberDraft
  step: StepIndex
  setStep: (step: StepIndex) => void
  saveSection: <K extends StepKey>(key: K, values: MemberDraft[K]) => void
  reset: () => void
}

export const DraftContext = createContext<DraftContextValue | null>(null)

export function useMembershipDraft() {
  const ctx = useContext(DraftContext)
  if (!ctx) throw new Error('useMembershipDraft must be used inside <MembershipDraftProvider>')
  return ctx
}
