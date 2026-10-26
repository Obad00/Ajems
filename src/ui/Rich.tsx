import { Fragment } from 'react'
import { keepTogether } from './typography'

/**
 * Renders a content string for titles: `*word*` becomes an italic emphasis
 * and place names get non-breaking hyphens.
 */
export function Rich({ text, emClassName = '' }: { text: string; emClassName?: string }) {
  const parts = keepTogether(text).split(/\*([^*]+)\*/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <em key={i} className={emClassName}>
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
