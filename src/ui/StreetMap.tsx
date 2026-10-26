import mapSvg from '../assets/mermoz-map.svg?raw'

/**
 * Street plan of Mermoz-Sacré-Cœur, inlined so that CSS can animate its lines.
 * Colour comes from `currentColor` (set a text colour on the wrapper).
 * Data © OpenStreetMap contributors (ODbL), see the legal notice.
 */
// Fill the box (crop) rather than letterbox.
const sliced = mapSvg.replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ')

export function StreetMap({ className = '', draw = false }: { className?: string; draw?: boolean }) {
  return <div aria-hidden className={`street-map ${draw ? 'street-map--draw' : ''} ${className}`} dangerouslySetInnerHTML={{ __html: sliced }} />
}
