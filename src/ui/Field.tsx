import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { CircleAlert } from 'lucide-react'
import { controlClasses, describedBy } from './classes'

export function FieldLabel({ htmlFor, optional, children }: { htmlFor?: string; optional?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block font-semibold text-navy">
      {children}
      {optional && <span className="ml-1.5 font-normal text-muted">(facultatif)</span>}
    </label>
  )
}

export function FieldHint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null
  return (
    <p id={`${id}-hint`} className="text-sm text-muted">
      {children}
    </p>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-semibold text-danger">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  )
}

type ShellProps = {
  id: string
  label: ReactNode
  optional?: boolean
  hint?: ReactNode
  error?: string
  children: ReactNode
  /** Extra content rendered below the control (e.g. a non-blocking warning). */
  after?: ReactNode
}

/** Label + hint + control + error, stacked. */
export function FieldShell({ id, label, optional, hint, error, children, after }: ShellProps) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <FieldHint id={id}>{hint}</FieldHint>
      <FieldError id={id} message={error} />
      {children}
      {after}
    </div>
  )
}

type FieldProps = Omit<ShellProps, 'children'> & InputHTMLAttributes<HTMLInputElement>

export function Field({ id, label, optional, hint, error, after, className = '', ...props }: FieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error} after={after}>
      <input
        id={id}
        className={`${controlClasses} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-required={optional ? undefined : true}
        aria-describedby={describedBy(id, hint, error)}
        {...props}
      />
    </FieldShell>
  )
}

type TextAreaProps = Omit<ShellProps, 'children'> & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea({ id, label, optional, hint, error, after, className = '', rows = 4, ...props }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error} after={after}>
      <textarea
        id={id}
        rows={rows}
        className={`${controlClasses} resize-y ${className}`}
        aria-invalid={error ? true : undefined}
        aria-required={optional ? undefined : true}
        aria-describedby={describedBy(id, hint, error)}
        {...props}
      />
    </FieldShell>
  )
}
