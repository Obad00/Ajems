import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { memberSchema } from '../schemas/member'
import { fakeDraft } from '../test/fixtures'
import { DEMO_STATS } from './seed'
import { SupabaseRepository } from './SupabaseRepository'

/** Minimal fake of the supabase-js query builder (no network). */
function fakeClient({ rpc = {}, rows = [] as unknown[], error = null as unknown }: { rpc?: Record<string, unknown>; rows?: unknown[]; error?: unknown } = {}) {
  const calls: { op: string; args: unknown[] }[] = []
  const result = { data: rows, error }
  const builder: Record<string, unknown> = {}
  for (const op of ['select', 'order', 'eq', 'update']) {
    builder[op] = (...args: unknown[]) => {
      calls.push({ op, args })
      return builder
    }
  }
  builder.maybeSingle = () => Promise.resolve({ data: rows[0] ?? null, error })
  builder.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve)
  const client = {
    rpc: vi.fn((name: string) => {
      const value = rpc[name]
      return Promise.resolve(value instanceof Error ? { data: null, error: { message: value.message } } : { data: value, error: null })
    }),
    from: vi.fn(() => builder),
  }
  return { client: client as unknown as SupabaseClient, calls, rpcMock: client.rpc }
}

const input = memberSchema.parse(fakeDraft())

describe('SupabaseRepository', () => {
  it('submits through the submit_member function and returns the dossier number only', async () => {
    const { client, rpcMock } = fakeClient({ rpc: { submit_member: 'AJEMS-2026-0007' } })
    const result = await new SupabaseRepository(client).create(input)
    expect(result).toEqual({ dossier_number: 'AJEMS-2026-0007' })
    expect(rpcMock).toHaveBeenCalledWith('submit_member', { payload: input })
  })

  it('maps the phone limit to a clear message', async () => {
    const { client } = fakeClient({ rpc: { submit_member: new Error('phone_limit') } })
    await expect(new SupabaseRepository(client).create(input)).rejects.toThrow(/déjà été utilisé pour 3 fiches/)
  })

  it('maps refused data to a clear message, without technical details', async () => {
    const { client } = fakeClient({ rpc: { submit_member: new Error('invalid_payload') } })
    await expect(new SupabaseRepository(client).create(input)).rejects.toThrow(/Certaines informations ont été refusées/)
    const other = fakeClient({ rpc: { submit_member: new Error('duplicate key value violates unique constraint "members_pkey"') } })
    await expect(new SupabaseRepository(other.client).create(input)).rejects.toThrow(/n'a pas abouti/)
  })

  it('rejects an unexpected response instead of showing it', async () => {
    const { client } = fakeClient({ rpc: { submit_member: { first_name: 'Awa' } } })
    await expect(new SupabaseRepository(client).create(input)).rejects.toThrow(/n'a pas abouti/)
  })

  it('updates the status column only', async () => {
    const { client, calls } = fakeClient({ rows: [{ id: 'x' }] })
    await new SupabaseRepository(client).updateStatus('x', 'acceptee')
    expect(calls.find((c) => c.op === 'update')?.args[0]).toEqual({ status: 'acceptee' })
  })

  it('reports a missing fiche on update', async () => {
    const { client } = fakeClient({ rows: [] })
    await expect(new SupabaseRepository(client).updateStatus('x', 'acceptee')).rejects.toThrow('Fiche introuvable.')
  })

  it('keeps only the 5 totals from public_stats, even if the server sent more', async () => {
    const { client } = fakeClient({ rpc: { public_stats: { ...DEMO_STATS, phone: '+221770001234', first_name: 'Awa' } } })
    const stats = await new SupabaseRepository(client).getPublicStats()
    expect(stats).toEqual(DEMO_STATS)
  })
})
