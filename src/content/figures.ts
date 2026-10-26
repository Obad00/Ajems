/**
 * Chiffres saisis par le bureau (pas calculés). `value: null` = pas encore fourni.
 * Passer `validated` à `true` une fois les valeurs confirmées : le badge « À valider » disparaît.
 * Les autres chiffres de l'accueil sont calculés par la base (public_stats), jamais écrits ici.
 */

export type BoardFigure = { value: string | null; label: string }

export const BOARD_FIGURES = {
  validated: false,
  items: [
    { value: null, label: "année de création de l'association" },
    { value: null, label: 'réunions des membres tenues' },
  ] satisfies BoardFigure[],
}
