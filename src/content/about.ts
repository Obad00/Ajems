/** Textes de la page « À propos ». Tout est à relire par le bureau (`validated: false`). */

export const ABOUT = {
  intro:
    "L'Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur (AJEMS) est une association en cours de formalisation, créée par et pour les jeunes entrepreneurs du quartier.",
  sections: [
    {
      id: 'mission',
      validated: false,
      title: 'Notre mission',
      paragraphs: [
        "Rassembler les jeunes entrepreneurs et porteurs de projet de Mermoz-Sacré-Cœur pour échanger, s'entraider et accéder plus facilement à l'information utile à leur activité.",
      ],
    },
    {
      id: 'vision',
      validated: false,
      title: 'Notre vision',
      paragraphs: ['Un quartier où chaque jeune qui entreprend sait vers qui se tourner pour avancer. [À VALIDER]'],
    },
    {
      id: 'objectifs',
      validated: false,
      title: 'Nos objectifs',
      list: [
        'Constituer un réseau actif de jeunes entrepreneurs du quartier.',
        "Partager les opportunités de formation et d'accompagnement.",
        'Faciliter les mises en relation entre membres.',
        'Organiser des rencontres régulières entre membres.',
      ],
    },
    {
      id: 'valeurs',
      validated: false,
      title: 'Nos valeurs',
      list: ['Solidarité', 'Transparence', 'Engagement', 'Respect'],
    },
    {
      id: 'fonctionnement',
      validated: false,
      title: 'Fonctionnement associatif',
      paragraphs: [
        "L'association est animée par un bureau. Les décisions importantes sont prises en assemblée des membres, selon les statuts et le règlement intérieur.",
        "Les demandes d'adhésion sont examinées par le bureau. Les modalités de cotisation et la composition du bureau sont à préciser. [À VALIDER]",
      ],
    },
  ],
} as const
