import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { MockRepository } from '../storage/MockRepository'

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  render(<App repository={new MockRepository()} />)
}

describe('public pages', () => {
  it('home: title, main call to action and the financing FAQ answer', async () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Ensemble, faisons grandir l'entrepreneuriat à Mermoz-Sacré-Cœur.")
    expect(screen.getAllByRole('link', { name: /Demander mon adhésion/ }).length).toBeGreaterThan(0)

    const question = screen.getByText("L'adhésion garantit-elle un financement ?")
    await userEvent.setup().click(question)
    expect(screen.getByText(/^Non\. L'AJEMS peut orienter/)).toBeVisible()
  })

  it('home: lists every sector', () => {
    renderAt('/')
    expect(screen.getByText('Énergie et environnement')).toBeInTheDocument()
    expect(screen.getByText('Autre secteur')).toBeInTheDocument()
  })

  it('about: renders the sections with a pending badge', () => {
    renderAt('/a-propos')
    expect(screen.getByRole('heading', { name: /Notre mission/ })).toBeInTheDocument()
    expect(screen.getAllByText('À valider').length).toBeGreaterThan(0)
    expect(document.title).toBe('À propos — AJEMS')
  })

  it('privacy: explains access, deletion and the CDP check without claiming compliance', () => {
    renderAt('/confidentialite')
    expect(screen.getByRole('heading', { name: 'Qui y a accès' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /suppression/ })).toBeInTheDocument()
    expect(screen.getByText(/CDP est à vérifier/)).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent(/conforme/i)
  })

  it('confirmation without a submission redirects to the form', () => {
    renderAt('/adhesion/confirmation')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Demande d'adhésion")
  })

  it('unknown path shows the 404 page', () => {
    renderAt('/nimporte-quoi')
    expect(screen.getByRole('heading', { name: 'Page introuvable' })).toBeInTheDocument()
  })
})
