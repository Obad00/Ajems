import { emptyDraft, type MemberDraft } from '../schemas/member'

/** Fictitious member — never real data. */
export const fakeDraft = (): MemberDraft => ({
  ...emptyDraft(),
  identity: {
    first_name: 'Aïssatou',
    last_name: 'Ndiaye',
    birth_year: '1996',
    phone: '77 000 12 34',
    email: 'aissatou.exemple@example.com',
    quartier: 'Quartier Exemple',
    commune: 'Mermoz-Sacré-Cœur',
    zone_link: 'les_deux',
  },
  business: {
    member_type: 'entrepreneur',
    business_name: 'Atelier Exemple Couture',
    sectors: ['artisanat', 'autre'],
    sector_other: 'Mode',
    description: 'Atelier fictif de couture sur mesure pour particuliers et entreprises.',
    founded_on: '2022-03-15',
    legal_status: 'entreprise_individuelle',
    business_location: 'Dakar',
    links: '',
  },
  skills: {
    skills: 'Couture, gestion de commandes',
    services: '',
    experience: '',
    needs: ['formation', 'clients'],
    needs_details: '',
  },
  reglement: {
    reglement_accepted: true,
    full_name_typed: 'aissatou ndiaye',
    accuracy_confirmed: true,
  },
})
