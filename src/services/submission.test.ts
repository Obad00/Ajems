import { describe, expect, it, vi } from 'vitest'
import { fakeDraft } from '../test/fixtures'
import { MockRepository } from '../storage/MockRepository'
import { submitMembership } from './submission'

describe('submitMembership', () => {
  it('stores the member and returns the dossier number', async () => {
    const repo = new MockRepository({ now: () => new Date('2026-10-30T10:00:00Z') })
    const result = await submitMembership(fakeDraft(), '', repo)
    expect(result).toEqual({ ok: true, dossierNumber: 'AJEMS-2026-0001' })

    const [member] = await repo.list()
    expect(member).toMatchObject({
      status: 'nouvelle',
      reglement_version: 'v0-brouillon',
      reglement_accepted_at: '2026-10-30T10:00:00.000Z',
      full_name_typed: 'aissatou ndiaye',
    })
  })

  it('numbers dossiers sequentially', async () => {
    const repo = new MockRepository({ now: () => new Date('2026-10-30T10:00:00Z') })
    await submitMembership(fakeDraft(), '', repo)
    const second = await submitMembership(fakeDraft(), '', repo)
    expect(second).toEqual({ ok: true, dossierNumber: 'AJEMS-2026-0002' })
  })

  it('returns a clear message on storage failure, without logging', async () => {
    const log = vi.spyOn(console, 'log')
    const error = vi.spyOn(console, 'error')
    const result = await submitMembership(fakeDraft(), '', new MockRepository({ failWrites: true }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/n'a pas abouti.*Vos réponses sont conservées/)
    expect(log).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('does not store anything when the honeypot is filled', async () => {
    const repo = new MockRepository()
    const result = await submitMembership(fakeDraft(), 'https://spam.example', repo)
    expect(result).toEqual({ ok: true, dossierNumber: null })
    expect(await repo.list()).toHaveLength(0)
  })

  it('refuses an incomplete draft and names the step', async () => {
    const draft = fakeDraft()
    draft.identity.phone = '123'
    const repo = new MockRepository()
    expect(await submitMembership(draft, '', repo)).toMatchObject({ ok: false, step: 'identity' })
    expect(await repo.list()).toHaveLength(0)
  })
})
