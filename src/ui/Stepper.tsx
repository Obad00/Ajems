import { Check } from 'lucide-react'

type StepperProps = {
  steps: readonly string[]
  /** 0-based index of the current step. */
  current: number
}

/**
 * Mobile: "Étape 2 sur 5" + label + progress bar.
 * ≥ md: numbered list of all steps.
 */
export function Stepper({ steps, current }: StepperProps) {
  const percent = Math.round(((current + 1) / steps.length) * 100)
  return (
    <nav aria-label="Progression du formulaire" className="space-y-3">
      <div className="md:hidden">
        <p className="text-sm font-semibold text-gold-ink">
          Étape {current + 1} sur {steps.length}
        </p>
        <p className="font-serif text-xl font-semibold text-navy">{steps[current]}</p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label="Avancement"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="h-full rounded-full bg-navy transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ol className="hidden gap-2 md:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={label} aria-current={active ? 'step' : undefined} className="space-y-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div className={`h-full bg-navy transition-[width] duration-500 ease-out ${i <= current ? 'w-full' : 'w-0'}`} />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    active ? 'bg-navy text-white ring-2 ring-gold ring-offset-2' : done ? 'bg-navy text-white' : 'border border-field bg-white text-muted'
                  }`}
                >
                  {done ? <Check aria-hidden className="size-4" /> : i + 1}
                </span>
                <span className={`text-sm leading-tight ${active ? 'font-semibold text-navy' : 'text-muted'}`}>
                  {label}
                  {done && <span className="sr-only"> (terminée)</span>}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
