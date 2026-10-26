import { REGLEMENT } from '../content/reglement'
import type { Sector, Need, MemberType, ZoneLink } from '../schemas/common'
import type { Member, MemberStatus } from './MemberRepository'

/*
 * Fictitious members for the demo admin (mock mode only). Names are invented,
 * phone numbers use the 77 000 xx xx pattern, emails use example.com.
 */

type SeedRow = [first: string, last: string, birthYear: number, type: MemberType, business: string, sectors: Sector[], needs: Need[], status: MemberStatus, zone: ZoneLink, daysAgo: number]

const ROWS: SeedRow[] = [
  ['Awa', 'Exemple-Diop', 1995, 'entrepreneur', 'Atelier Fictif Couture', ['artisanat'], ['clients', 'financement'], 'nouvelle', 'les_deux', 0],
  ['Moussa', 'Exemple-Fall', 1990, 'entrepreneur', 'Démo Logistique', ['transport'], ['partenaires'], 'en_examen', 'exerce', 1],
  ['Fatou', 'Exemple-Sarr', 1999, 'porteur_projet', 'Projet Jus Locaux (fictif)', ['agriculture', 'industrie'], ['formation', 'financement'], 'nouvelle', 'habite', 1],
  ['Ibrahima', 'Exemple-Ndiaye', 1988, 'entrepreneur', 'Studio Démo Web', ['numerique', 'communication'], ['clients'], 'acceptee', 'les_deux', 2],
  ['Aïssatou', 'Exemple-Ba', 1997, 'entrepreneur', 'Salon Exemple Beauté', ['sante'], ['accompagnement'], 'a_completer', 'exerce', 3],
  ['Cheikh', 'Exemple-Gueye', 1993, 'porteur_projet', 'Projet Solaire Démo', ['energie'], ['financement', 'partenaires'], 'en_examen', 'habite', 3],
  ['Mariama', 'Exemple-Sow', 2001, 'porteur_projet', 'Cours Démo Soutien', ['education'], ['formation'], 'nouvelle', 'habite', 4],
  ['Ousmane', 'Exemple-Faye', 1985, 'entrepreneur', 'Bâti Exemple', ['btp'], ['clients', 'partenaires'], 'refusee', 'exerce', 5],
  ['Khady', 'Exemple-Diallo', 1996, 'entrepreneur', 'Restaurant Fictif', ['restauration'], ['clients'], 'acceptee', 'les_deux', 6],
  ['Abdou', 'Exemple-Mbaye', 1979, 'entrepreneur', 'Conseil Démo Finance', ['finance', 'services'], ['autre'], 'nouvelle', 'exerce', 7],
  ['Ndèye', 'Exemple-Cissé', 1998, 'entrepreneur', 'Boutique Exemple', ['commerce'], ['formation', 'clients'], 'en_examen', 'habite', 8],
  ['Pape', 'Exemple-Seck', 1994, 'porteur_projet', 'Projet Démo Recyclage', ['energie', 'autre'], ['accompagnement'], 'nouvelle', 'les_deux', 9],
]

export function demoMembers(now = new Date()): Member[] {
  return ROWS.map(([first, last, birthYear, type, business, sectors, needs, status, zone, daysAgo], i) => {
    const created = new Date(now.getTime() - daysAgo * 86_400_000 - i * 3_600_000)
    const n = String(i + 1).padStart(4, '0')
    return {
      id: `demo-${n}`,
      dossier_number: `AJEMS-${created.getFullYear()}-${n}`,
      created_at: created.toISOString(),
      status,
      first_name: first,
      last_name: last,
      birth_year: birthYear,
      phone: `+22177000${String(1000 + i).slice(-4)}`,
      email: i % 3 === 2 ? null : `${first.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()}@example.com`,
      quartier: 'Quartier Exemple',
      commune: 'Mermoz-Sacré-Cœur',
      zone_link: zone,
      member_type: type,
      business_name: business,
      sectors,
      sector_other: sectors.includes('autre') ? 'Économie circulaire' : null,
      description: `Activité fictive utilisée pour la démonstration (${business}).`,
      founded_on: type === 'entrepreneur' ? `${2018 + (i % 6)}-0${1 + (i % 9)}-15` : null,
      legal_status: type === 'entrepreneur' ? 'entreprise_individuelle' : 'non_formalise',
      business_location: 'Dakar',
      links: null,
      skills: 'Compétences fictives de démonstration',
      services: null,
      experience: null,
      needs,
      needs_details: null,
      reglement_version: REGLEMENT.version,
      reglement_accepted_at: created.toISOString(),
      full_name_typed: `${first} ${last}`,
      accuracy_confirmed: true,
    }
  })
}
