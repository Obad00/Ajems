import { useEffect, useRef, useState } from 'react'

const DURATION = 1200

/**
 * Counts from 0 to `value` once, when it scrolls into view.
 * Without IntersectionObserver or with reduced motion, the final value is shown directly.
 * Screen readers always get the final value (the animated digits are aria-hidden).
 */
export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState<number | null>(null) // null = final value

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION)
        const eased = 1 - (1 - t) ** 3
        setShown(t < 1 ? Math.round(value * eased) : null)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      setShown(0)
      frame = requestAnimationFrame(tick)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {(shown ?? value).toLocaleString('fr-FR')}
      </span>
      <span className="sr-only">{value.toLocaleString('fr-FR')}</span>
    </span>
  )
}
