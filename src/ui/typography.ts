/** Place names that must never break across lines: hyphens become U+2011 (non-breaking hyphen). */
const KEEP_TOGETHER = ['Mermoz-Sacré-Cœur']

export function keepTogether(text: string) {
  return KEEP_TOGETHER.reduce((t, name) => t.replaceAll(name, name.replaceAll('-', '‑')), text)
}
