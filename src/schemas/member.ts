import { z } from 'zod'
import { REGLEMENT } from '../content/reglement'
import { namesMatch } from './common'
import { step1Schema, type Step1Input } from './step1'
import { step2Schema, type Step2Input } from './step2'
import { step3Schema, type Step3Input } from './step3'
import { nameMismatchMessage, step4BaseSchema, type Step4Input } from './step4'

export const STEP_KEYS = ['identity', 'business', 'skills', 'reglement'] as const
export type StepKey = (typeof STEP_KEYS)[number]

/** Raw form values, kept in React state while the visitor fills the form. */
export type MemberDraft = {
  identity: Partial<Step1Input>
  business: Partial<Step2Input>
  skills: Partial<Step3Input>
  reglement: Partial<Step4Input>
}

export const emptyDraft = (): MemberDraft => ({
  identity: {},
  business: { sectors: [] },
  skills: { needs: [] },
  reglement: { reglement_accepted: false, accuracy_confirmed: false },
})

/**
 * Complete schema: validates the whole draft with the step schemas, re-checks the typed
 * name against step 1, and flattens it into the record sent to storage.
 */
export const memberSchema = z
  .object({
    identity: step1Schema,
    business: step2Schema,
    skills: step3Schema,
    reglement: step4BaseSchema,
  })
  .superRefine((d, ctx) => {
    if (!namesMatch(d.reglement.full_name_typed, d.identity.first_name, d.identity.last_name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['reglement', 'full_name_typed'],
        message: nameMismatchMessage(d.identity.first_name, d.identity.last_name),
      })
    }
  })
  .transform(({ identity, business, skills, reglement }) => ({
    ...identity,
    ...business,
    ...skills,
    full_name_typed: reglement.full_name_typed,
    accuracy_confirmed: reglement.accuracy_confirmed,
    reglement_version: REGLEMENT.version,
  }))

/** Record handed to a MemberRepository (server adds id, dossier number, status, timestamps). */
export type MemberInput = z.output<typeof memberSchema>

export type DraftParseResult = { success: true; data: MemberInput } | { success: false; step: StepKey }

export function parseDraft(draft: MemberDraft): DraftParseResult {
  const result = memberSchema.safeParse(draft)
  if (result.success) return { success: true, data: result.data }
  const first = result.error.issues[0]?.path[0]
  const step = STEP_KEYS.includes(first as StepKey) ? (first as StepKey) : 'identity'
  return { success: false, step }
}
