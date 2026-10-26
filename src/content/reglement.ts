/**
 * Règlement intérieur de l'AJEMS.
 * Texte en attente : remplacer les articles ci-dessous par le texte validé par le bureau,
 * puis changer `version` (ex. "v1-2026-11"). La version est enregistrée avec chaque fiche.
 */

export type ReglementArticle = {
  title: string
  paragraphs: string[]
}

export const REGLEMENT = {
  version: 'v0-brouillon',
  title: "Règlement intérieur de l'AJEMS",
  status: 'Brouillon : texte en attente de validation par le bureau.',
  articles: [
    { title: 'Article 1 — [À VALIDER]', paragraphs: ['[À VALIDER] Texte à fournir par le bureau.'] },
    { title: 'Article 2 — [À VALIDER]', paragraphs: ['[À VALIDER] Texte à fournir par le bureau.'] },
    { title: 'Article 3 — [À VALIDER]', paragraphs: ['[À VALIDER] Texte à fournir par le bureau.'] },
    { title: 'Article 4 — [À VALIDER]', paragraphs: ['[À VALIDER] Texte à fournir par le bureau.'] },
    { title: 'Article 5 — [À VALIDER]', paragraphs: ['[À VALIDER] Texte à fournir par le bureau.'] },
  ] satisfies ReglementArticle[],
} as const

export const PAPER_SIGNATURE_NOTICE = 'Une signature papier pourra vous être demandée lors de la réunion.'

/** Mandatory wording (BRIEF §2): online acceptance is not a qualified e-signature. */
export const ACCEPTANCE_NOTICE = `Cette acceptation en ligne vaut engagement de votre part. ${PAPER_SIGNATURE_NOTICE}`
