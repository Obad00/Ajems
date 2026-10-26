import { z } from 'zod'
import type { Member } from '../storage/MemberRepository'

/** Below this, a total is never shown (nor sent by the database): small numbers could identify people. */
export const STATS_THRESHOLD = 10

const count = z.number().int().nonnegative().nullable()

/**
 * Public figures: totals only, `null` when below the threshold.
 * Parsing with this schema drops any unexpected key, so no individual data can reach the page.
 */
export const publicStatsSchema = z
  .object({
    members_accepted: count,
    requests_received: count,
    entrepreneurs: count,
    project_holders: count,
    sectors_represented: count,
  })
  .strip()

export type PublicStats = z.infer<typeof publicStatsSchema>
export type StatKey = keyof PublicStats

const masked = (n: number) => (n >= STATS_THRESHOLD ? n : null)

/** Same rules as public.public_stats() in supabase/schema.sql (used in mock mode). */
export function computePublicStats(members: Pick<Member, 'status' | 'member_type' | 'sectors'>[]): PublicStats {
  const active = members.filter((m) => m.status !== 'refusee')
  const sectors = new Set(active.flatMap((m) => m.sectors).filter((s) => s !== 'autre'))
  return {
    members_accepted: masked(members.filter((m) => m.status === 'acceptee').length),
    requests_received: masked(members.length),
    entrepreneurs: masked(active.filter((m) => m.member_type === 'entrepreneur').length),
    project_holders: masked(active.filter((m) => m.member_type === 'porteur_projet').length),
    sectors_represented: masked(sectors.size),
  }
}

export const STAT_LABELS: Record<StatKey, string> = {
  members_accepted: 'membres acceptés',
  requests_received: "demandes d'adhésion reçues",
  entrepreneurs: 'entrepreneurs en activité',
  project_holders: 'porteurs de projet',
  sectors_represented: 'secteurs représentés',
}

const ORDER: StatKey[] = ['members_accepted', 'requests_received', 'entrepreneurs', 'project_holders', 'sectors_represented']

/** Figures that may be displayed (the threshold is applied again, whatever the source). */
export function displayableStats(stats: PublicStats | null): { key: StatKey; value: number; label: string }[] {
  if (!stats) return []
  return ORDER.flatMap((key) => {
    const value = stats[key]
    return value !== null && value >= STATS_THRESHOLD ? [{ key, value, label: STAT_LABELS[key] }] : []
  })
}
