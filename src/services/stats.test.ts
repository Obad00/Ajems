import { describe, expect, it } from 'vitest'
import { demoMembers, DEMO_STATS } from '../storage/seed'
import { MockRepository } from '../storage/MockRepository'
import { STATS_THRESHOLD, computePublicStats, displayableStats, publicStatsSchema } from './stats'

const member = (status: string, member_type: string, sectors: string[]) => ({ status, member_type, sectors }) as never

describe('public stats — threshold', () => {
  it('masks every total below 10', () => {
    const nine = Array.from({ length: 9 }, () => member('acceptee', 'entrepreneur', ['artisanat']))
    expect(computePublicStats(nine)).toEqual({
      members_accepted: null,
      requests_received: null,
      entrepreneurs: null,
      project_holders: null,
      sectors_represented: null,
    })
  })

  it('shows a total from exactly 10', () => {
    const ten = Array.from({ length: 10 }, () => member('acceptee', 'entrepreneur', ['artisanat']))
    const stats = computePublicStats(ten)
    expect(stats.members_accepted).toBe(STATS_THRESHOLD)
    expect(stats.entrepreneurs).toBe(10)
    expect(stats.project_holders).toBeNull()
  })

  it('does not count refused requests in the profile figures, nor "autre" as a sector', () => {
    const list = [
      ...Array.from({ length: 10 }, () => member('refusee', 'porteur_projet', ['autre'])),
      ...Array.from({ length: 10 }, () => member('nouvelle', 'entrepreneur', ['commerce'])),
    ]
    const stats = computePublicStats(list)
    expect(stats.requests_received).toBe(20)
    expect(stats.project_holders).toBeNull()
    expect(stats.sectors_represented).toBeNull()
  })

  it('displays nothing when every figure is masked (the page then says membership is open)', () => {
    expect(displayableStats(computePublicStats([]))).toEqual([])
    expect(displayableStats(null)).toEqual([])
  })

  it('re-applies the threshold to any source', () => {
    const figures = displayableStats({ ...DEMO_STATS, project_holders: 3 })
    expect(figures.map((f) => f.key)).not.toContain('project_holders')
  })
})

describe('public stats — no personal data', () => {
  it('drops any unexpected key from a response', () => {
    const parsed = publicStatsSchema.parse({ ...DEMO_STATS, first_name: 'Awa', phone: '+221770001234', members: [{ id: 1 }] })
    expect(Object.keys(parsed).sort()).toEqual(['entrepreneurs', 'members_accepted', 'project_holders', 'requests_received', 'sectors_represented'])
    expect(JSON.stringify(parsed)).not.toMatch(/Awa|221770001234/)
  })

  it('rejects anything that is not a count', () => {
    expect(publicStatsSchema.safeParse({ ...DEMO_STATS, members_accepted: 'Awa Exemple' }).success).toBe(false)
    expect(publicStatsSchema.safeParse({ ...DEMO_STATS, requests_received: -1 }).success).toBe(false)
  })

  it('computed totals contain numbers or null only', () => {
    const stats = computePublicStats(demoMembers())
    expect(Object.values(stats).every((v) => v === null || Number.isInteger(v))).toBe(true)
  })
})

describe('public stats — mock mode', () => {
  it('returns the fictitious demo figures when given', async () => {
    expect(await new MockRepository({ stats: DEMO_STATS }).getPublicStats()).toEqual(DEMO_STATS)
  })

  it('computes from the in-memory members otherwise (12 demo fiches: all below the threshold except requests)', async () => {
    const stats = await new MockRepository({ seed: demoMembers() }).getPublicStats()
    expect(stats.requests_received).toBe(12)
    expect(stats.members_accepted).toBeNull()
  })
})
