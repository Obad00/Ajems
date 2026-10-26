import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import App from '../App'
import { MockRepository } from '../storage/MockRepository'

// Fictitious data only.
async function fillIdentity(user: UserEvent) {
  await user.type(screen.getByLabelText('Prénom'), 'Aïssatou')
  await user.type(screen.getByLabelText('Nom'), 'Ndiaye')
  await user.type(screen.getByLabelText('Année de naissance'), '1996')
  await user.type(screen.getByLabelText('Téléphone'), '77 000 12 34')
  await user.type(screen.getByLabelText('Quartier'), 'Quartier Exemple')
  await user.type(screen.getByLabelText('Commune'), 'Mermoz-Sacré-Cœur')
  await user.click(screen.getByLabelText('Les deux'))
}

async function fillBusiness(user: UserEvent) {
  await user.click(screen.getByLabelText(/^Porteur de projet/))
  await user.type(screen.getByLabelText("Nom de l'entreprise ou du projet"), 'Projet Exemple')
  await user.click(screen.getByLabelText('Artisanat et production'))
  await user.type(screen.getByLabelText("Description de l'activité ou du projet"), 'Projet fictif de transformation de fruits locaux.')
}

async function fillUntilSummary(user: UserEvent) {
  await fillIdentity(user)
  await user.click(screen.getByRole('button', { name: 'Continuer' }))
  await fillBusiness(user)
  await user.click(screen.getByRole('button', { name: 'Continuer' }))
  await user.type(screen.getByLabelText('Compétences principales'), 'Transformation, vente')
  await user.click(screen.getByRole('button', { name: 'Continuer' }))
  await user.click(screen.getByLabelText(/J'ai lu et j'accepte le règlement intérieur/))
  await user.type(screen.getByLabelText('Votre nom complet'), 'aissatou ndiaye')
  await user.click(screen.getByLabelText(/Je certifie l'exactitude/))
  await user.click(screen.getByRole('button', { name: 'Voir le récapitulatif' }))
}

const stepHeading = () => screen.getByRole('heading', { level: 2 })

function renderApp(repo = new MockRepository()) {
  window.history.pushState({}, '', '/adhesion')
  render(<App repository={repo} />)
  return repo
}

describe('membership form', () => {
  beforeEach(() => window.history.pushState({}, '', '/'))
  afterEach(() => vi.unstubAllGlobals())

  it('shows errors and stays on step 1 when required fields are empty', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Continuer' }))

    expect(screen.getByRole('alert')).toHaveTextContent('champs sont à corriger')
    expect(screen.getByLabelText('Prénom')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Indiquez votre prénom')).toBeInTheDocument()
    expect(stepHeading()).toHaveTextContent('Identité et contact')
  })

  it('shows a non-blocking warning for a birth year outside 18–45', async () => {
    const user = userEvent.setup()
    renderApp()
    await fillIdentity(user)
    await user.clear(screen.getByLabelText('Année de naissance'))
    await user.type(screen.getByLabelText('Année de naissance'), '1970')
    expect(screen.getByRole('status')).toHaveTextContent('à confirmer par le bureau')

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(stepHeading()).toHaveTextContent('Entreprise ou projet')
  })

  it('keeps answers when going back and forth, even unvalidated ones', async () => {
    const user = userEvent.setup()
    renderApp()
    await fillIdentity(user)
    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.type(screen.getByLabelText("Nom de l'entreprise ou du projet"), 'Brouillon')
    await user.click(screen.getByRole('button', { name: 'Retour' }))

    expect(stepHeading()).toHaveTextContent('Identité et contact')
    expect(screen.getByLabelText('Prénom')).toHaveValue('Aïssatou')
    expect(screen.getByLabelText('Les deux')).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(screen.getByLabelText("Nom de l'entreprise ou du projet")).toHaveValue('Brouillon')
  })

  it('rejects a typed name that does not match step 1', async () => {
    const user = userEvent.setup()
    renderApp()
    await fillUntilSummary(user)
    await user.click(screen.getByRole('button', { name: /Modifier : Règlement intérieur/ }))
    const input = screen.getByLabelText('Votre nom complet')
    await user.clear(input)
    await user.type(input, 'Awa Diop')
    await user.click(screen.getByRole('button', { name: 'Voir le récapitulatif' }))
    expect(screen.getByText(/doit correspondre au prénom et au nom saisis/)).toBeInTheDocument()
  })

  it('shows the summary, lets the visitor edit a section, then submits', async () => {
    const user = userEvent.setup()
    const repo = renderApp()
    await fillUntilSummary(user)

    expect(stepHeading()).toHaveTextContent('Récapitulatif')
    const identity = screen.getByRole('region', { name: 'Identité et contact' })
    expect(within(identity).getByText('Aïssatou Ndiaye')).toBeInTheDocument()
    expect(within(identity).getByText('+221 77 000 12 34')).toBeInTheDocument()
    expect(screen.getByText('Oui (version v0-brouillon)')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Modifier : Identité et contact/ }))
    expect(stepHeading()).toHaveTextContent('Identité et contact')
    expect(screen.getByLabelText('Téléphone')).toHaveValue('77 000 12 34')
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: 'Continuer' }))
    await user.click(screen.getByRole('button', { name: 'Voir le récapitulatif' }))

    await user.click(screen.getByRole('button', { name: 'Envoyer ma fiche' }))
    expect(await screen.findByRole('heading', { name: 'Votre fiche a bien été envoyée' })).toBeInTheDocument()
    expect(screen.getByText(/^AJEMS-\d{4}-0001$/)).toBeInTheDocument()
    expect(await repo.list()).toHaveLength(1)
  })

  it('keeps the data on screen with a clear message when storage fails', async () => {
    const user = userEvent.setup()
    renderApp(new MockRepository({ failWrites: true }))
    await fillUntilSummary(user)
    await user.click(screen.getByRole('button', { name: 'Envoyer ma fiche' }))

    expect(await screen.findByRole('alert')).toHaveTextContent("Votre fiche n'a pas été envoyée")
    expect(screen.getByRole('alert')).toHaveTextContent('Vos réponses sont conservées')
    expect(stepHeading()).toHaveTextContent('Récapitulatif')
    expect(screen.getByText('Aïssatou Ndiaye')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Envoyer ma fiche' })).toBeEnabled()
  })

  it('never writes the draft to web storage', async () => {
    const spyStorage = () => ({ setItem: vi.fn(), getItem: vi.fn(() => null), removeItem: vi.fn(), clear: vi.fn(), key: vi.fn(), length: 0 })
    const local = spyStorage()
    const session = spyStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('sessionStorage', session)

    const user = userEvent.setup()
    renderApp()
    await fillUntilSummary(user)
    expect(local.setItem).not.toHaveBeenCalled()
    expect(session.setItem).not.toHaveBeenCalled()
  })
})
