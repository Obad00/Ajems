import { describe, expect, it } from 'vitest'
import { demoMembers } from '../storage/seed'
import { DEFAULT_FILTERS, filterMembers } from './members'

const members = demoMembers(new Date('2026-10-30T10:00:00Z'))
const run = (f: Partial<typeof DEFAULT_FILTERS>) => filterMembers(members, { ...DEFAULT_FILTERS, ...f })

describe('filterMembers', () => {
  it('sorts by date, newest first by default', () => {
    const list = run({})
    expect(list).toHaveLength(members.length)
    expect(list[0].created_at > list.at(-1)!.created_at).toBe(true)
    expect(run({ sort: 'oldest' })[0].id).toBe(list.at(-1)!.id)
  })

  it('searches names without accents or case', () => {
    expect(run({ query: 'aissatou' }).map((m) => m.first_name)).toEqual(['Aïssatou'])
    expect(run({ query: 'NDEYE exemple' }).map((m) => m.first_name)).toEqual(['Ndèye'])
  })

  it('searches the business name and the dossier number', () => {
    expect(run({ query: 'studio démo' })).toHaveLength(1)
    expect(run({ query: 'AJEMS-2026-0003' })[0].first_name).toBe('Fatou')
  })

  it('searches phones with or without spaces and country code', () => {
    expect(run({ query: '77 000 10 03' })[0].first_name).toBe('Ibrahima')
    expect(run({ query: '+221770001003' })[0].first_name).toBe('Ibrahima')
  })

  it('filters by sector, status and règlement', () => {
    expect(run({ sector: 'energie' }).map((m) => m.first_name).sort()).toEqual(['Cheikh', 'Pape'])
    expect(run({ status: 'acceptee' }).every((m) => m.status === 'acceptee')).toBe(true)
    expect(run({ reglement: 'accepted' })).toHaveLength(members.length)
    expect(run({ reglement: 'missing' })).toHaveLength(0)
  })

  it('combines filters', () => {
    expect(run({ status: 'nouvelle', sector: 'artisanat', query: 'awa' })).toHaveLength(1)
  })
})
