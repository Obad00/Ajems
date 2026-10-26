/** Marks a text still waiting for the board's validation (BRIEF §2: « [À VALIDER] »). */
export function PendingBadge({ show = true }: { show?: boolean }) {
  if (!show) return null
  return (
    <span className="ml-2 inline-block rounded border border-warn/40 bg-warn-soft px-1.5 py-0.5 align-middle font-sans text-xs font-semibold tracking-normal text-warn">
      À valider
    </span>
  )
}
