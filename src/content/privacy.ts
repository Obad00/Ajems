/**
 * Notice de confidentialité et mentions légales.
 * Ne pas affirmer de conformité légale (BRIEF §2) : la déclaration CDP reste à vérifier.
 */

export type PrivacySection = {
  id: string
  title: string
  paragraphs?: string[]
  list?: string[]
}

export const PRIVACY = {
  updated: '26 octobre 2026',
  intro:
    "Cette page explique quelles informations l'AJEMS recueille via le formulaire d'adhésion, pourquoi, qui y a accès et comment demander leur suppression.",
  sections: [
    {
      id: 'responsable',
      title: 'Responsable du traitement',
      paragraphs: [
        "Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur (AJEMS), association en cours de formalisation, Dakar. Contact : [À VALIDER].",
      ],
    },
    {
      id: 'donnees',
      title: 'Données recueillies',
      list: [
        'Identité et contact : prénom, nom, année de naissance, téléphone, email (facultatif), quartier, commune, lien avec Mermoz-Sacré-Cœur.',
        "Activité : situation, nom de l'entreprise ou du projet, secteurs, description, date de création, statut juridique, localisation, liens.",
        'Compétences et besoins : compétences, services, expérience, besoins prioritaires.',
        "Règlement intérieur : version acceptée, date et heure de l'acceptation, nom complet tapé, certification d'exactitude.",
      ],
      paragraphs: ["Aucune pièce d'identité et aucune signature dessinée ne sont demandées en ligne."],
    },
    {
      id: 'finalites',
      title: 'Pourquoi ces données',
      list: [
        "Examiner votre demande d'adhésion.",
        'Tenir la liste des membres et vous contacter au sujet de la vie de l’association.',
        'Préparer la fiche papier qui pourra vous être demandée à la signature lors de la réunion.',
      ],
    },
    {
      id: 'acces',
      title: 'Qui y a accès',
      paragraphs: [
        "Seuls les membres du bureau habilités, via un espace d'administration protégé par mot de passe. Les données ne sont ni vendues ni cédées.",
        "Le site public peut uniquement enregistrer une fiche : il ne permet ni de la lire, ni de la modifier.",
      ],
    },
    {
      id: 'hebergement',
      title: 'Hébergement des données',
      paragraphs: ['Les fiches sont stockées chez le prestataire Supabase. Région d’hébergement : [À VALIDER].'],
    },
    {
      id: 'conservation',
      title: 'Durée de conservation',
      paragraphs: ['[À VALIDER] Durée à fixer par le bureau (par exemple : durée de l’adhésion, puis suppression).'],
    },
    {
      id: 'droits',
      title: 'Vos droits : accès, correction, suppression',
      paragraphs: [
        'Vous pouvez demander à consulter, corriger ou supprimer votre fiche en écrivant à : [À VALIDER]. Indiquez votre numéro de dossier (AJEMS-…).',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies et navigateur',
      paragraphs: [
        "Le site n'utilise ni cookies publicitaires ni mesure d'audience. Le formulaire n'enregistre rien dans votre navigateur : vos réponses restent en mémoire jusqu'à l'envoi.",
      ],
    },
    {
      id: 'cdp',
      title: 'Cadre légal',
      paragraphs: [
        'Au Sénégal, la protection des données personnelles relève de la loi n° 2008-12 et de la Commission de protection des Données Personnelles (CDP). La déclaration de ce traitement auprès de la CDP est à vérifier. [À VALIDER]',
      ],
    },
  ] satisfies PrivacySection[],
  legal: {
    title: 'Mentions légales',
    items: [
      ['Éditeur', 'AJEMS — Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur, association en cours de formalisation, Dakar.'],
      ['Responsable de la publication', '[À VALIDER]'],
      ['Contact', '[À VALIDER]'],
      ['Hébergeur du site', '[À VALIDER] (Vercel, Netlify ou Hostinger selon le choix de déploiement)'],
    ] as const,
    /** ODbL attribution for the street plan (scripts/build-map.mjs). */
    mapCredit: {
      label: 'Fond de plan',
      text: 'Plan des rues de Mermoz-Sacré-Cœur simplifié à partir des données © les contributeurs OpenStreetMap, disponibles sous licence ODbL.',
      href: 'https://www.openstreetmap.org/copyright',
      linkLabel: 'openstreetmap.org/copyright',
    },
  },
} as const
