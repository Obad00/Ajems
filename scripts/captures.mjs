// Screenshots of the membership form at 390px and 1280px, in mock mode, with fictitious data only.
// Usage: npm run captures   →   captures/<width>/<nn>-<name>.png
import { mkdir, rm } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

process.env.VITE_STORAGE = 'mock'

const VIEWPORTS = [
  { name: '390', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: '1280', viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
]

// Fictitious member.
const FAKE = {
  first_name: 'Aïssatou',
  last_name: 'Ndiaye',
  birth_year: '1996',
  phone: '77 000 12 34',
  email: 'aissatou.exemple@example.com',
  quartier: 'Quartier Exemple',
  commune: 'Mermoz-Sacré-Cœur',
  business: 'Atelier Exemple Couture',
  description: 'Atelier fictif de couture sur mesure pour particuliers et entreprises du quartier.',
}

const server = await createServer({ logLevel: 'error', server: { port: 5199, strictPort: true } })
await server.listen()
const base = 'http://localhost:5199'
const browser = await chromium.launch()

await rm('captures', { recursive: true, force: true })

try {
  for (const device of VIEWPORTS) {
    const dir = `captures/${device.name}`
    await mkdir(dir, { recursive: true })
    const context = await browser.newContext({ ...device, locale: 'fr-FR', reducedMotion: 'reduce' })
    let n = 0
    const shot = async (page, name) => {
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => window.scrollTo(0, 0))
      n += 1
      await page.screenshot({ path: `${dir}/${String(n).padStart(2, '0')}-${name}.png`, fullPage: true, animations: 'disabled' })
    }
    const label = (page, text, exact = true) => page.getByLabel(text, { exact })
    const next = (page, name = 'Continuer') => page.getByRole('button', { name, exact: true }).click()

    // ---------- Main flow ----------
    const page = await context.newPage()
    await page.goto(`${base}/adhesion`)

    if (device.isMobile) {
      await page.getByRole('button', { name: 'Ouvrir le menu' }).click()
      await shot(page, 'menu-mobile')
      await page.getByRole('button', { name: 'Fermer le menu' }).click()
    }

    // Step 1
    await shot(page, 'etape1-vide')
    await next(page)
    await shot(page, 'etape1-erreurs')
    await label(page, 'Prénom').fill(FAKE.first_name)
    await label(page, 'Nom').fill(FAKE.last_name)
    await label(page, 'Année de naissance').fill('1970')
    await label(page, 'Téléphone').fill('77 000')
    await label(page, 'Email', false).fill('aissatou@')
    await next(page)
    await shot(page, 'etape1-avertissement-age-et-erreurs')
    await label(page, 'Année de naissance').fill(FAKE.birth_year)
    await label(page, 'Téléphone').fill(FAKE.phone)
    await label(page, 'Email', false).fill(FAKE.email)
    await label(page, 'Quartier').fill(FAKE.quartier)
    await label(page, 'Commune').fill(FAKE.commune)
    await label(page, 'Les deux').check()
    await shot(page, 'etape1-remplie')
    await next(page)

    // Step 2
    await shot(page, 'etape2-vide')
    await label(page, 'Autre secteur').check()
    await label(page, "Description de l'activité ou du projet").fill('Trop court')
    await next(page)
    await shot(page, 'etape2-erreurs')
    await label(page, /^Entrepreneur avec une activité/, false).check()
    await label(page, "Nom de l'entreprise ou du projet").fill(FAKE.business)
    await label(page, 'Artisanat et production').check()
    await label(page, 'Précisez votre secteur').fill('Mode')
    await label(page, "Description de l'activité ou du projet").fill(FAKE.description)
    await label(page, "Date de création de l'activité", false).fill('2022-03-15')
    await label(page, 'Statut juridique', false).selectOption('entreprise_individuelle')
    await label(page, "Localisation de l'activité", false).fill('Dakar')
    await shot(page, 'etape2-remplie')
    await next(page)

    // Step 3
    await shot(page, 'etape3-vide')
    await next(page)
    await shot(page, 'etape3-erreurs')
    await label(page, 'Compétences principales').fill('Couture, gestion de commandes')
    await label(page, 'Formation').check()
    await label(page, 'Clients et débouchés').check()
    await shot(page, 'etape3-remplie')
    await next(page)

    // Step 4
    await shot(page, 'etape4-vide')
    await label(page, 'Votre nom complet').fill('Awa Diop')
    await next(page, 'Voir le récapitulatif')
    await shot(page, 'etape4-erreurs-nom-different')
    await label(page, /J'ai lu et j'accepte/, false).check()
    await label(page, 'Votre nom complet').fill('aissatou ndiaye')
    await label(page, /Je certifie l'exactitude/, false).check()
    await shot(page, 'etape4-remplie')
    await next(page, 'Voir le récapitulatif')

    // Summary + confirmation
    await shot(page, 'recapitulatif')
    await next(page, 'Envoyer ma fiche')
    await page.getByRole('heading', { name: 'Votre fiche a bien été envoyée' }).waitFor()
    await shot(page, 'confirmation')
    await page.close()

    // ---------- Storage error (mock failure) ----------
    const errPage = await context.newPage()
    await errPage.goto(`${base}/adhesion?simuler-erreur`)
    await label(errPage, 'Prénom').fill(FAKE.first_name)
    await label(errPage, 'Nom').fill(FAKE.last_name)
    await label(errPage, 'Année de naissance').fill(FAKE.birth_year)
    await label(errPage, 'Téléphone').fill(FAKE.phone)
    await label(errPage, 'Quartier').fill(FAKE.quartier)
    await label(errPage, 'Commune').fill(FAKE.commune)
    await label(errPage, 'Les deux').check()
    await next(errPage)
    await label(errPage, /^Porteur de projet/, false).check()
    await label(errPage, "Nom de l'entreprise ou du projet").fill(FAKE.business)
    await label(errPage, 'Artisanat et production').check()
    await label(errPage, "Description de l'activité ou du projet").fill(FAKE.description)
    await next(errPage)
    await label(errPage, 'Compétences principales').fill('Couture')
    await next(errPage)
    await label(errPage, /J'ai lu et j'accepte/, false).check()
    await label(errPage, 'Votre nom complet').fill('Aissatou Ndiaye')
    await label(errPage, /Je certifie l'exactitude/, false).check()
    await next(errPage, 'Voir le récapitulatif')
    await next(errPage, 'Envoyer ma fiche')
    await errPage.getByRole('alert').waitFor()
    await shot(errPage, 'erreur-envoi-donnees-conservees')
    await errPage.close()

    // ---------- Public pages ----------
    const pub = await context.newPage()
    await pub.goto(`${base}/`)
    await shot(pub, 'accueil')
    await pub.getByText("L'adhésion garantit-elle un financement ?").click()
    await pub.evaluate(() => document.fonts.ready)
    n += 1
    await pub.locator('section[aria-labelledby="faq"]').screenshot({ path: `${dir}/${String(n).padStart(2, '0')}-accueil-faq-ouverte.png`, animations: 'disabled' })
    await pub.goto(`${base}/a-propos`)
    await shot(pub, 'a-propos')
    await pub.goto(`${base}/confidentialite`)
    await shot(pub, 'confidentialite')
    await pub.goto(`${base}/page-inexistante`)
    await shot(pub, '404')
    await pub.close()

    // ---------- Règlement page (screen + print) ----------
    const reg = await context.newPage()
    await reg.goto(`${base}/reglement`)
    await shot(reg, 'reglement')
    await reg.emulateMedia({ media: 'print' })
    await shot(reg, 'reglement-impression')
    if (device.name === '1280') await reg.pdf({ path: `${dir}/reglement-a4.pdf`, format: 'A4', printBackground: false })
    await reg.close()

    await context.close()
    console.log(`✓ ${n} captures → ${dir}`)
  }
} finally {
  await browser.close()
  await server.close()
}
