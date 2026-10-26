import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'light'

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'on-dark bg-navy text-white hover:bg-navy-2 active:bg-navy-2',
  secondary: 'border-2 border-gold bg-white text-navy hover:bg-gold-soft',
  ghost: 'text-navy underline-offset-4 hover:bg-navy/5 hover:underline',
  /** Gold outline on navy backgrounds (header, footer). */
  onDark: 'border-2 border-gold text-white hover:bg-white/10',
  /** Solid white on navy backgrounds: main call to action in the hero. */
  light: 'bg-white text-navy hover:bg-gold-soft',
}

export function buttonClasses(variant: ButtonVariant = 'primary', extra = '') {
  return `${buttonBase} ${buttonVariants[variant]} ${extra}`.trim()
}

export const controlClasses =
  'block w-full min-h-12 rounded-lg border border-field bg-white px-3.5 py-2.5 text-ink placeholder:text-muted/70 ' +
  'aria-invalid:border-2 aria-invalid:border-danger focus-visible:border-navy'

/** ids of the hint and error elements, joined for aria-describedby. */
export function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}
