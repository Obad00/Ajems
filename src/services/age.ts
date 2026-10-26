export const AGE_RANGE = { min: 18, max: 45 } as const

/**
 * Non-blocking eligibility warning (18–45, rule to be confirmed by the board).
 * Only the birth year is known, so the age is the age reached during `refYear`.
 */
export function getAgeWarning(birthYear: number, refYear = new Date().getFullYear()): string | null {
  if (!Number.isInteger(birthYear) || birthYear < 1000) return null
  const age = refYear - birthYear
  if (age >= AGE_RANGE.min && age <= AGE_RANGE.max) return null
  return `Vous aurez ${age} ans en ${refYear}, en dehors de la tranche ${AGE_RANGE.min}–${AGE_RANGE.max} ans. Vous pouvez continuer : cette condition est à confirmer par le bureau.`
}
