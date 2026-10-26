import type { ReactNode } from 'react'
import { PendingBadge } from './PendingBadge'

type Props = { eyebrow?: string; title: ReactNode; pending?: boolean; id?: string; children?: ReactNode }

export function SectionHeading({ eyebrow, title, pending, id, children }: Props) {
  return (
    <div className="mb-8 max-w-2xl space-y-2">
      {eyebrow && <p className="text-sm font-semibold tracking-wide text-gold-ink uppercase">{eyebrow}</p>}
      <h2 id={id} className="text-3xl font-bold sm:text-4xl">
        {title}
        <PendingBadge show={!!pending} />
      </h2>
      {children && <p className="text-muted">{children}</p>}
    </div>
  )
}
