import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import App from '../App'
import { DEMO_ACCOUNT, MockAuthService } from '../auth/MockAuthService'
import { MockRepository } from '../storage/MockRepository'
import { demoMembers } from '../storage/seed'

function renderAdmin(path = '/admin') {
  window.history.pushState({}, '', path)
  const repo = new MockRepository({ seed: demoMembers(new Date('2026-10-30T10:00:00Z')) })
  render(<App repository={repo} auth={new MockAuthService()} />)
  return repo
}

async function logIn(user: UserEvent, password: string = DEMO_ACCOUNT.password) {
  await user.type(await screen.findByLabelText('Email'), DEMO_ACCOUNT.email)
  await user.type(screen.getByLabelText('Mot de passe'), password)
  await user.click(screen.getByRole('button', { name: 'Se connecter' }))
}

describe('admin', () => {
  beforeEach(() => window.history.pushState({}, '', '/'))

  it('redirects to the login page and rejects a wrong password', async () => {
    const user = userEvent.setup()
    renderAdmin('/admin')
    expect(await screen.findByRole('heading', { name: /Espace bureau/ })).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent('Mode démonstration — données fictives')

    await logIn(user, 'mauvais')
    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect.')
  })

  it('lists, searches and filters members after login', async () => {
    const user = userEvent.setup()
    renderAdmin('/admin')
    await logIn(user)

    expect(await screen.findByRole('heading', { name: /Les membres/ })).toBeInTheDocument()
    expect(await screen.findByText('12 fiches sur 12')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /^Recherche/ }), 'aissatou')
    expect(screen.getByRole('status')).toHaveTextContent('1 fiche sur 12')
    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }))

    await user.selectOptions(screen.getByLabelText(/Statut/), 'acceptee')
    expect(screen.getByRole('status')).toHaveTextContent('2 fiches sur 12')
    await user.selectOptions(screen.getByLabelText(/Secteur/), 'restauration')
    expect(screen.getByRole('status')).toHaveTextContent('1 fiche sur 12')
  })

  it('changes the status of a member', async () => {
    const user = userEvent.setup()
    const repo = renderAdmin('/admin/membres/demo-0001')
    await logIn(user)

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Awa Exemple-Diop')
    await user.selectOptions(screen.getByLabelText('Nouveau statut'), 'acceptee')
    await user.click(screen.getByRole('button', { name: 'Enregistrer le statut' }))
    expect(await screen.findByText('Statut enregistré.')).toBeInTheDocument()
    expect((await repo.getById('demo-0001'))?.status).toBe('acceptee')
  })

  it('prints a form with the accepted règlement version and a signature area', async () => {
    const user = userEvent.setup()
    renderAdmin('/admin/membres/demo-0002/impression')
    await logIn(user)

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Moussa Exemple-Fall')
    expect(screen.getByText(/version v0-brouillon/)).toBeInTheDocument()
    const signatures = screen.getByRole('region', { name: 'Signatures' })
    expect(within(signatures).getByText('Signature du membre')).toBeInTheDocument()
    expect(within(signatures).getByText(/Fait à/)).toBeInTheDocument()
  })

  it('shows a clear message for an unknown member', async () => {
    const user = userEvent.setup()
    renderAdmin('/admin/membres/inconnu')
    await logIn(user)
    expect(await screen.findByRole('heading', { name: 'Fiche introuvable' })).toBeInTheDocument()
  })
})
