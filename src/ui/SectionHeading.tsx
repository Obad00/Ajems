import type { ReactNode } from 'react'
import { PendingBadge } from './PendingBadge'
import { Rich } from './Rich'

type Props = { title: string; pending?: boolean; id?: string; children?: ReactNode; className?: string }

/** Large left-aligned serif title, optional lead. `*word*` in the title is set in italics. */
export function SectionHeading({ title, pending, id, children, className = '' }: Props) {
  return (
    <div className={`max-w-2xl space-y-4 ${className}`}>
      <h2 id={id} className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
        <Rich text={title} emClassName="font-normal" />
        <PendingBadge show={!!pending} />
      </h2>
      {children && <p className="max-w-xl text-lg text-muted">{children}</p>}
    </div>
  )
}
