import type { InputHTMLAttributes, ReactNode } from 'react'
import { FieldError, FieldHint } from './Field'
import type { Option } from './Select'

/*
 * Checkbox, RadioGroup and MultiSelect share the same "tile" look:
 * the whole tile is the label, so the tap target is ≥ 44px tall.
 */

const tile =
  'flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-field bg-white px-3.5 py-3 ' +
  'has-[:checked]:border-2 has-[:checked]:border-navy has-[:checked]:bg-navy/[0.03] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy'

const box = 'mt-0.5 size-5 shrink-0 accent-navy focus-visible:outline-none'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

type CheckboxProps = InputProps & {
  id: string
  label: ReactNode
  error?: string
  hint?: ReactNode
}

/** A single, standalone checkbox (e.g. "I accept…"). */
export function Checkbox({ id, label, error, hint, ...props }: CheckboxProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className="space-y-1.5">
      <FieldError id={id} message={error} />
      <label htmlFor={id} className={`${tile} ${error ? 'border-2 border-danger' : ''}`}>
        <input
          id={id}
          type="checkbox"
          className={box}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        <span className="text-ink">{label}</span>
      </label>
      <FieldHint id={id}>{hint}</FieldHint>
    </div>
  )
}

type GroupProps = {
  name: string
  legend: ReactNode
  options: readonly Option[]
  optional?: boolean
  hint?: ReactNode
  error?: string
  columns?: 1 | 2
  /** Spread of react-hook-form's register(name). */
  inputProps: InputProps
}

function Group({ type, name, legend, options, optional, hint, error, columns = 1, inputProps }: GroupProps & { type: 'radio' | 'checkbox' }) {
  const id = `${name}-group`
  return (
    <fieldset
      className="space-y-2"
      aria-describedby={[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1.5 font-semibold text-navy">
        {legend}
        {optional && <span className="ml-1.5 font-normal text-muted">(facultatif)</span>}
      </legend>
      <FieldHint id={id}>{hint}</FieldHint>
      <FieldError id={id} message={error} />
      <div className={`grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
        {options.map((o) => {
          const optionId = `${name}-${o.value}`
          return (
            <label key={o.value} htmlFor={optionId} className={tile}>
              <input id={optionId} type={type} value={o.value} className={box} {...inputProps} />
              <span>
                <span className="block text-ink">{o.label}</span>
                {o.description && <span className="block text-sm text-muted">{o.description}</span>}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function RadioGroup(props: GroupProps) {
  return <Group type="radio" {...props} />
}

/** Multi-selection rendered as checkbox tiles (more usable on touch than a multi-select dropdown). */
export function MultiSelect(props: GroupProps) {
  return <Group type="checkbox" {...props} />
}
