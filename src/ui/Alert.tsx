import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'

type Tone = 'info' | 'warning' | 'error' | 'success'

const tones: Record<Tone, { box: string; Icon: typeof Info }> = {
  info: { box: 'border-navy-2/30 bg-navy/[0.04] text-ink', Icon: Info },
  warning: { box: 'border-warn/40 bg-warn-soft text-warn', Icon: TriangleAlert },
  error: { box: 'border-danger/40 bg-danger-soft text-danger', Icon: CircleAlert },
  success: { box: 'border-success/40 bg-success-soft text-success', Icon: CircleCheck },
}

type AlertProps = {
  tone?: Tone
  title?: ReactNode
  children?: ReactNode
  /** "alert" interrupts screen readers (errors), "status" is polite. */
  role?: 'alert' | 'status'
  id?: string
}

export function Alert({ tone = 'info', title, children, role, id }: AlertProps) {
  const { box, Icon } = tones[tone]
  return (
    <div id={id} role={role} className={`flex gap-3 rounded-lg border p-4 ${box}`}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-1 text-sm leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  )
}
