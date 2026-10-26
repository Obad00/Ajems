import { describe, expect, it } from 'vitest'
import { fakeDraft } from '../test/fixtures'
import { getAgeWarning } from '../services/age'
import { memberSchema, parseDraft } from './member'
import { step1Schema } from './step1'
import { step2Schema } from './step2'
import { step3Schema } from './step3'
import { makeStep4Schema } from './step4'

function errorPaths(result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) {
  return result.error?.issues.map((i) => i.path.join('.')) ?? []
}

describe('step 1 — identity', () => {
  it('reports every required field', () => {
    const paths = errorPaths(step1Schema.safeParse({}))
    expect(paths).toEqual(
      expect.arrayContaining(['first_name', 'last_name', 'birth_year', 'phone', 'quartier', 'commune', 'zone_link']),
    )
    expect(paths).not.toContain('email')
  })

  it('normalises the phone and turns an empty email into null', () => {
    const data = step1Schema.parse({ ...fakeDraft().identity, email: '  ' })
    expect(data.phone).toBe('+221770001234')
    expect(data.email).toBeNull()
    expect(data.birth_year).toBe(1996)
  })

  it('rejects an invalid email and an invalid year', () => {
    const r = step1Schema.safeParse({ ...fakeDraft().identity, email: 'pas-un-email', birth_year: '96' })
    expect(errorPaths(r)).toEqual(expect.arrayContaining(['email', 'birth_year']))
  })

  it('does not block a birth year outside 18–45 (warning only)', () => {
    expect(step1Schema.safeParse({ ...fakeDraft().identity, birth_year: '1970' }).success).toBe(true)
    expect(getAgeWarning(1970, 2026)).toMatch(/56 ans.*à confirmer par le bureau/)
    expect(getAgeWarning(2010, 2026)).toMatch(/16 ans/)
    expect(getAgeWarning(1996, 2026)).toBeNull()
    expect(getAgeWarning(1981, 2026)).toBeNull() // 45
    expect(getAgeWarning(2008, 2026)).toBeNull() // 18
  })
})

describe('step 2 — business', () => {
  it('requires a sector and a 20+ character description', () => {
    const r = step2Schema.safeParse({ ...fakeDraft().business, sectors: [], description: 'Trop court' })
    expect(errorPaths(r)).toEqual(expect.arrayContaining(['sectors', 'description']))
  })

  it('requires sector_other when "autre" is checked, even if other fields are invalid', () => {
    const r = step2Schema.safeParse({ sectors: ['autre'], sector_other: '' })
    expect(errorPaths(r)).toEqual(expect.arrayContaining(['sector_other', 'member_type', 'business_name']))
  })

  it('drops the creation date for a project holder', () => {
    const data = step2Schema.parse({ ...fakeDraft().business, member_type: 'porteur_projet' })
    expect(data.founded_on).toBeNull()
  })

  it('keeps the creation date for an entrepreneur and rejects a future date', () => {
    expect(step2Schema.parse(fakeDraft().business).founded_on).toBe('2022-03-15')
    const r = step2Schema.safeParse({ ...fakeDraft().business, founded_on: '2999-01-01' })
    expect(errorPaths(r)).toContain('founded_on')
  })

  it('drops sector_other when "autre" is not checked', () => {
    const data = step2Schema.parse({ ...fakeDraft().business, sectors: ['artisanat'] })
    expect(data.sector_other).toBeNull()
  })
})

describe('step 3 — skills', () => {
  it('requires skills only', () => {
    expect(errorPaths(step3Schema.safeParse({}))).toEqual(['skills'])
    expect(step3Schema.parse({ skills: 'Vente' }).needs).toEqual([])
  })
})

describe('step 4 — règlement', () => {
  const schema = makeStep4Schema('Aïssatou', 'Ndiaye')

  it('requires both boxes and the typed name', () => {
    const r = schema.safeParse({ reglement_accepted: false, accuracy_confirmed: false, full_name_typed: '' })
    expect(errorPaths(r)).toEqual(expect.arrayContaining(['reglement_accepted', 'accuracy_confirmed', 'full_name_typed']))
  })

  it('rejects a typed name that differs from step 1', () => {
    const r = schema.safeParse({ ...fakeDraft().reglement, full_name_typed: 'Awa Diop' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toContain('Aïssatou Ndiaye')
  })

  it('accepts the name without accents or capitals', () => {
    expect(schema.safeParse({ ...fakeDraft().reglement, full_name_typed: 'AISSATOU NDIAYE' }).success).toBe(true)
  })
})

describe('complete schema', () => {
  it('flattens a valid draft and records the règlement version', () => {
    const data = memberSchema.parse(fakeDraft())
    expect(data).toMatchObject({
      first_name: 'Aïssatou',
      phone: '+221770001234',
      sectors: ['artisanat', 'autre'],
      sector_other: 'Mode',
      reglement_version: 'v0-brouillon',
      full_name_typed: 'aissatou ndiaye',
      accuracy_confirmed: true,
    })
    expect(data).not.toHaveProperty('reglement_accepted_at') // set by the server
  })

  it('re-checks the typed name against step 1 and points to the faulty step', () => {
    const draft = fakeDraft()
    draft.identity.first_name = 'Awa'
    expect(parseDraft(draft)).toEqual({ success: false, step: 'reglement' })
  })

  it('points to the first incomplete step', () => {
    const draft = fakeDraft()
    draft.skills.skills = ''
    expect(parseDraft(draft)).toEqual({ success: false, step: 'skills' })
  })
})
