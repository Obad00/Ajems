import { useState } from 'react'
import { Pause, Play } from 'lucide-react'

/**
 * Words scrolling continuously. The list is rendered twice for a seamless loop
 * (the copy is hidden from assistive tech). A button pauses it (WCAG 2.2.2).
 */
export function Marquee({ items, label }: { items: readonly string[]; label: string }) {
  const [paused, setPaused] = useState(false)
  // The copy draws its words with CSS (content: attr()), so each word exists once in the DOM.
  const list = (dup: boolean) => (
    <ul aria-hidden={dup || undefined} className={`flex shrink-0 items-center ${dup ? 'marquee-dup' : ''}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center font-serif text-2xl whitespace-nowrap text-navy italic sm:text-4xl">
          {dup ? (
            <span data-label={item} className="px-5 before:content-[attr(data-label)] sm:px-8" />
          ) : (
            <span className="px-5 sm:px-8">{item}</span>
          )}
          <span aria-hidden className="size-1.5 rounded-full bg-gold" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="marquee relative border-y border-navy/15 py-5 sm:py-7" data-paused={paused}>
      <div className="overflow-hidden" role="region" aria-label={label}>
        <div className="marquee-track flex w-max">
          {list(false)}
          {list(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="absolute right-2 -bottom-6 grid size-11 place-items-center rounded-full border border-navy/20 bg-surface text-navy hover:bg-white motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
        <span className="sr-only">{paused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}</span>
      </button>
    </div>
  )
}
