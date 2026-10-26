import type { MemberStatus } from '../storage/MemberRepository'
import { statusLabel } from '../services/format'

const TONES: Record<MemberStatus, string> = {
  nouvelle: 'border-navy/30 bg-navy/[0.06] text-navy',
  en_examen: 'border-warn/40 bg-warn-soft text-warn',
  acceptee: 'border-success/40 bg-success-soft text-success',
  refusee: 'border-danger/40 bg-danger-soft text-danger',
  a_completer: 'border-gold-ink/40 bg-gold-soft text-gold-ink',
}

export function StatusBadge({ status }: { status: MemberStatus }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${TONES[status]}`}>{statusLabel(status)}</span>
}
