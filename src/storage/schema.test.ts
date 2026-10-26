import { describe, expect, it } from 'vitest'
import sql from '../../supabase/schema.sql?raw'

// Static guard rails on supabase/schema.sql (the SQL itself is exercised in a real PostgreSQL, see README).
const fn = (name: string) => {
  const start = sql.indexOf(`create or replace function public.${name}`)
  return sql.slice(start, sql.indexOf('$$;', start))
}

describe('supabase/schema.sql', () => {
  it('public_stats returns aggregate totals only, masked below 10', () => {
    const body = fn('public_stats')
    expect(body).toContain('security definer')
    for (const key of ['members_accepted', 'requests_received', 'entrepreneurs', 'project_holders', 'sectors_represented']) {
      expect(body).toContain(`'${key}', case when ${key} >= 10 then ${key} end`)
    }
    expect(body).not.toMatch(/first_name|last_name|phone|email|business_name|description|full_name_typed|\bid\b/)
  })

  it('the public can only execute submit_member and public_stats', () => {
    expect(sql).toMatch(/revoke all on table public\.members from anon, authenticated;/)
    expect(sql).toMatch(/grant execute on function public\.submit_member\(jsonb\) to anon, authenticated;/)
    expect(sql).toMatch(/grant execute on function public\.public_stats\(\) to anon, authenticated;/)
    expect(sql).not.toMatch(/grant [^;]*(insert|delete)[^;]* on table public\.members/i)
    expect(sql).not.toMatch(/grant select[^;]*to anon/)
  })

  it('admins may update the status column only, and RLS is enabled', () => {
    expect(sql).toContain('grant update (status) on table public.members to authenticated;')
    expect(sql).toContain('alter table public.members enable row level security;')
    expect(sql).not.toMatch(/for (insert|delete)/)
  })

  it('submit_member limits fiches per phone and sets server-side fields', () => {
    const body = fn('submit_member')
    expect(body).toContain('max_per_phone constant integer := 3')
    expect(body).toContain('pg_advisory_xact_lock')
    expect(body).not.toMatch(/\bstatus\b|reglement_accepted_at|dossier_number\s*,/)
  })
})
