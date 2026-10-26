import { z } from 'zod'
import { NEED_VALUES, optionalText } from './common'

export const step3Schema = z.object({
  skills: z
    .string({ error: 'Indiquez vos compétences principales' })
    .trim()
    .min(1, 'Indiquez vos compétences principales')
    .max(500, '500 caractères maximum'),
  services: optionalText(1000),
  experience: optionalText(1000),
  needs: z.array(z.enum(NEED_VALUES)).default([]),
  needs_details: optionalText(500),
})

export type Step3Input = z.input<typeof step3Schema>
export type Step3Output = z.output<typeof step3Schema>
