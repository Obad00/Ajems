/**
 * Textes de l'accueil. `validated: false` affiche un badge « À valider » sur la section :
 * passer à `true` une fois le texte relu par le bureau.
 * Dans les titres, `*mot*` s'affiche en italique.
 */

export const HOME = {
  hero: {
    title: "Ensemble, faisons *grandir* l'entrepreneuriat à Mermoz-Sacré-Cœur.",
    lead: 'Une association de jeunes entrepreneurs et porteurs de projet du quartier, pour avancer ensemble. [À VALIDER]',
  },
  missions: {
    validated: false,
    title: 'Nos *missions*',
    items: [
      { title: 'Fédérer', text: 'Rassembler les jeunes entrepreneurs et porteurs de projet de Mermoz-Sacré-Cœur.' },
      { title: 'Orienter', text: "Orienter les membres vers des formations et des dispositifs d'accompagnement existants." },
      { title: 'Connecter', text: 'Favoriser la mise en relation entre membres, partenaires et clients potentiels.' },
      { title: 'Représenter', text: 'Porter la voix des jeunes entrepreneurs du quartier.' },
    ],
  },
  manifesto: {
    validated: false,
    kicker: 'Manifeste',
    quote: "Entreprendre à Mermoz-Sacré-Cœur, ce n'est pas avancer seul : c'est avancer avec son quartier. [À VALIDER]",
    signature: "Le bureau de l'AJEMS",
  },
  benefits: {
    validated: false,
    title: "Ce que l'adhésion vous *apporte*",
    intro: "L'AJEMS ne promet ni emploi ni financement : elle facilite l'accès à l'information et aux contacts.",
    items: [
      'Orientation vers des formations et des ateliers.',
      "Mise en relation avec d'autres entrepreneurs du quartier.",
      "Orientation vers des dispositifs d'accompagnement et de financement existants.",
      'Possibilité de présenter votre activité au sein du réseau.',
      'Participation à la vie associative et aux réunions des membres.',
    ],
  },
  sectors: {
    title: 'Tous les secteurs sont les *bienvenus*',
  },
  process: {
    validated: false,
    title: 'Adhérer en *3 étapes*',
    steps: [
      { title: 'Remplissez votre fiche', text: 'En ligne, en 10 minutes environ, avec acceptation du règlement intérieur.' },
      { title: 'Examen par le bureau', text: "Le bureau étudie votre demande. L'envoi de la fiche ne vaut pas admission définitive." },
      { title: 'Réunion des membres', text: 'Présentation des nouveaux membres. Une signature papier pourra vous être demandée.' },
    ],
  },
  faq: {
    validated: false,
    title: 'Questions *fréquentes*',
    items: [
      {
        q: 'Qui peut adhérer ?',
        a: 'Les jeunes entrepreneurs et porteurs de projet qui habitent ou exercent leur activité à Mermoz-Sacré-Cœur, âgés de 18 à 45 ans (règle à confirmer par le bureau).',
      },
      {
        q: 'Faut-il avoir une entreprise déclarée ?',
        a: "Non. Les porteurs de projet dont l'activité n'a pas encore démarré peuvent aussi demander leur adhésion.",
      },
      {
        q: "L'adhésion garantit-elle un financement ?",
        a: "Non. L'AJEMS peut orienter ses membres vers des dispositifs existants, sans aucune garantie de financement.",
      },
      { q: "L'adhésion est-elle payante ?", a: '[À VALIDER] Le montant éventuel de la cotisation sera précisé par le bureau.' },
      {
        q: "L'envoi de ma fiche vaut-il admission ?",
        a: 'Non. Votre fiche est examinée par le bureau, qui vous informe ensuite de sa décision.',
      },
      {
        q: 'Que deviennent mes informations ?',
        a: "Elles servent uniquement à l'examen de votre adhésion et à la gestion des membres. Seuls les membres habilités du bureau y ont accès.",
        link: { to: '/confidentialite', label: 'Lire la notice de confidentialité' },
      },
    ],
  },
} as const
