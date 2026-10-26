import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { controlClasses, describedBy } from './classes'
import { FieldShell } from './Field'

export type Option<V extends string = string> = { value: V; label: string; description?: string }

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string
  label: string
  options: readonly Option[]
  placeholder?: string
  optional?: boolean
  hint?: string
  error?: string
}

export function Select({ id, label, options, placeholder = 'Choisir…', optional, hint, error, className = '', ...props }: SelectProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <div className="relative">
        <select
          id={id}
          className={`${controlClasses} appearance-none pr-10 ${className}`}
          aria-invalid={error ? true : undefined}
          aria-required={optional ? undefined : true}
          aria-describedby={describedBy(id, hint, error)}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy" />
      </div>
    </FieldShell>
  )
}
