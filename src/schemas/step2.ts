import { z } from 'zod'
import { LEGAL_STATUS_VALUES, MEMBER_TYPE_VALUES, SECTOR_VALUES, optionalText, requiredText } from './common'

const always = { when: () => true }

export const step2Schema = z
  .object({
    member_type: z.enum(MEMBER_TYPE_VALUES, { error: 'Indiquez si vous avez déjà une activité ou un projet' }),
    business_name: requiredText("Indiquez le nom de votre entreprise ou de votre projet", 120),
    sectors: z.array(z.enum(SECTOR_VALUES), { error: 'Choisissez au moins un secteur' }).min(1, 'Choisissez au moins un secteur'),
    sector_other: optionalText(80),
    description: z
      .string({ error: 'Décrivez votre activité ou votre projet' })
      .trim()
      .min(1, 'Décrivez votre activité ou votre projet')
      .min(20, 'Décrivez votre activité en quelques phrases (20 caractères minimum)')
      .max(1000, '1000 caractères maximum'),
    founded_on: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Date invalide')
      .refine((v) => !v || v <= new Date().toISOString().slice(0, 10), 'La date de création ne peut pas être dans le futur')
      .transform((v) => v || null),
    legal_status: z
      .union([z.enum(LEGAL_STATUS_VALUES), z.literal('')])
      .optional()
      .transform((v) => v || null),
    business_location: optionalText(120),
    links: optionalText(300),
  })
  .refine((d) => !Array.isArray(d.sectors) || !d.sectors.includes('autre') || !!d.sector_other, {
    ...always,
    path: ['sector_other'],
    message: 'Précisez votre secteur',
  })
  // Creation date only applies to an existing activity.
  .transform((d) => ({
    ...d,
    founded_on: d.member_type === 'entrepreneur' ? d.founded_on : null,
    sector_other: d.sectors.includes('autre') ? d.sector_other : null,
  }))

export type Step2Input = z.input<typeof step2Schema>
export type Step2Output = z.output<typeof step2Schema>
