/**
 * Photos du site. Aucune banque d'images : uniquement de vraies photos de l'AJEMS.
 * Pour en ajouter une : déposer le fichier dans `public/photos/` puis renseigner `src`
 * (ex. "/photos/membres-2026.jpg") et un `alt` qui décrit l'image.
 */

export type Photo = { src: string | null; alt: string; caption: string }

export const PHOTOS = {
  hero: { src: null, alt: "Des membres de l'AJEMS", caption: 'Photo à fournir : les membres de l’AJEMS.' },
  about: { src: null, alt: "Une réunion des membres de l'AJEMS", caption: 'Photo à fournir : une réunion de l’association.' },
} satisfies Record<string, Photo>
