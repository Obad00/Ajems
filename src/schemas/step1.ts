import { z } from 'zod'
import { ZONE_LINK_VALUES, optionalText, phoneSchema, requiredText } from './common'

export const MIN_BIRTH_YEAR = 1940

export const step1Schema = z.object({
  first_name: requiredText('Indiquez votre prénom', 80),
  last_name: requiredText('Indiquez votre nom', 80),
  birth_year: z
    .string({ error: 'Indiquez votre année de naissance' })
    .trim()
    .min(1, 'Indiquez votre année de naissance')
    .regex(/^\d{4}$/, 'Indiquez une année sur 4 chiffres, par exemple 1996')
    .transform(Number)
    .refine((y) => y >= MIN_BIRTH_YEAR && y <= new Date().getFullYear(), 'Année de naissance invalide'),
  phone: phoneSchema,
  email: optionalText(120).refine((v) => v === null || z.email().safeParse(v).success, 'Adresse email invalide'),
  quartier: requiredText('Indiquez votre quartier', 80),
  commune: requiredText('Indiquez votre commune', 80),
  zone_link: z.enum(ZONE_LINK_VALUES, { error: 'Indiquez votre lien avec Mermoz-Sacré-Cœur' }),
})

export type Step1Input = z.input<typeof step1Schema>
export type Step1Output = z.output<typeof step1Schema>
