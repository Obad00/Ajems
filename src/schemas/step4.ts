import { z } from 'zod'
import { namesMatch } from './common'

export const step4BaseSchema = z.object({
  reglement_accepted: z.boolean().refine((v) => v, 'Vous devez accepter le règlement intérieur pour envoyer votre fiche'),
  full_name_typed: z
    .string({ error: 'Tapez votre nom complet' })
    .trim()
    .min(1, 'Tapez votre nom complet')
    .max(170, '170 caractères maximum'),
  accuracy_confirmed: z.boolean().refine((v) => v, "Vous devez certifier l'exactitude des informations"),
})

export const nameMismatchMessage = (firstName: string, lastName: string) =>
  `Le nom tapé doit correspondre au prénom et au nom saisis à l'étape 1 : ${firstName} ${lastName}`

/** Step 4 depends on the names typed at step 1, hence a factory. */
export function makeStep4Schema(firstName: string, lastName: string) {
  return step4BaseSchema.extend({
    full_name_typed: step4BaseSchema.shape.full_name_typed.refine(
      (v) => namesMatch(v, firstName, lastName),
      nameMismatchMessage(firstName, lastName),
    ),
  })
}

export type Step4Input = z.input<typeof step4BaseSchema>
export type Step4Output = z.output<typeof step4BaseSchema>
