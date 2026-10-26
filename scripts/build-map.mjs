// Builds src/assets/mermoz-map.svg: the street plan of Mermoz-Sacré-Cœur (Dakar),
// simplified from OpenStreetMap. Run once (`npm run build:map`); the SVG is committed.
// Data © OpenStreetMap contributors, ODbL 1.0 — attribution shown in the legal notice.
import { writeFile } from 'node:fs/promises'

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]
const OUT = 'src/assets/mermoz-map.svg'
const WIDTH = 1000 // viewBox width; height follows the area's aspect ratio
const PADDING = 0.25 // extra area around the commune, as a share of its size
const TOLERANCE = 1.6 // Douglas–Peucker tolerance, in viewBox units
const MIN_LENGTH = 6 // drop tiny fragments, in viewBox units
const MAX_BYTES = 60 * 1024

const MAJOR = /^(motorway|trunk|primary|secondary|tertiary)(_link)?$/
const MINOR = /^(unclassified|residential|living_street|pedestrian)$/

async function overpass(query) {
  let wait = 4000
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = ENDPOINTS[attempt % ENDPOINTS.length]
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'ajems-site-map-build/1.0' },
        body: new URLSearchParams({ data: query }),
      })
      if (res.ok) return await res.json()
      console.warn(`${url} → HTTP ${res.status}, retry in ${wait / 1000}s`)
    } catch (error) {
      console.warn(`${url} → ${error.message}, retry in ${wait / 1000}s`)
    }
    await new Promise((r) => setTimeout(r, wait))
    wait *= 2
  }
  throw new Error('Overpass unavailable, try again later.')
}

// ---------- 1. Commune boundary ----------
const boundary = await overpass(
  '[out:json][timeout:60];rel["boundary"="administrative"]["name"~"Mermoz",i];out geom;',
)
const commune = boundary.elements.find((e) => e.type === 'relation' && /sacr/i.test(e.tags?.name ?? ''))
  ?? boundary.elements.find((e) => e.type === 'relation')
if (!commune) throw new Error('Boundary of Mermoz-Sacré-Cœur not found in OpenStreetMap.')
const { minlat, minlon, maxlat, maxlon } = commune.bounds
console.log(`Boundary: ${commune.tags.name} (relation ${commune.id})`)

const padLat = (maxlat - minlat) * PADDING
const padLon = (maxlon - minlon) * PADDING
const bbox = { s: minlat - padLat, w: minlon - padLon, n: maxlat + padLat, e: maxlon + padLon }

// ---------- 2. Streets in the padded bbox ----------
const streets = await overpass(
  `[out:json][timeout:90];way["highway"](${bbox.s},${bbox.w},${bbox.n},${bbox.e});out geom;`,
)

// ---------- 3. Projection (equirectangular, corrected for latitude) ----------
const k = Math.cos(((bbox.s + bbox.n) / 2) * (Math.PI / 180))
const spanX = (bbox.e - bbox.w) * k
const spanY = bbox.n - bbox.s
const HEIGHT = Math.round((WIDTH * spanY) / spanX)
const project = ({ lat, lon }) => [((lon - bbox.w) * k * WIDTH) / spanX, ((bbox.n - lat) * HEIGHT) / spanY]

// ---------- 4. Simplification ----------
function simplify(points, tol) {
  if (points.length < 3) return points
  const [a, b] = [points[0], points.at(-1)]
  let maxD = 0
  let idx = 0
  for (let i = 1; i < points.length - 1; i++) {
    const d = distToSegment(points[i], a, b)
    if (d > maxD) [maxD, idx] = [d, i]
  }
  if (maxD <= tol) return [a, b]
  return [...simplify(points.slice(0, idx + 1), tol).slice(0, -1), ...simplify(points.slice(idx), tol)]
}

function distToSegment([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

const length = (pts) => pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

/** Compact path data: absolute move, then relative integer lines. */
function toPath(points) {
  const r = points.map(([x, y]) => [Math.round(x), Math.round(y)])
  const dedup = r.filter((p, i) => i === 0 || p[0] !== r[i - 1][0] || p[1] !== r[i - 1][1])
  if (dedup.length < 2) return ''
  let d = `M${dedup[0][0]} ${dedup[0][1]}l`
  for (let i = 1; i < dedup.length; i++) {
    const dx = dedup[i][0] - dedup[i - 1][0]
    const dy = dedup[i][1] - dedup[i - 1][1]
    d += `${i > 1 && dx >= 0 ? ' ' : ''}${dx}${dy >= 0 ? ' ' : ''}${dy}`
  }
  return d
}

function paths(filter, tol) {
  return streets.elements
    .filter((e) => e.type === 'way' && e.geometry && filter.test(e.tags?.highway ?? ''))
    .map((e) => simplify(e.geometry.map(project), tol))
    .filter((pts) => length(pts) >= MIN_LENGTH)
    .map(toPath)
    .filter(Boolean)
}

const outline = commune.members
  .filter((m) => m.type === 'way' && m.role === 'outer' && m.geometry)
  .map((m) => toPath(simplify(m.geometry.map(project), TOLERANCE)))
  .filter(Boolean)

// ---------- 5. SVG ----------
function render(tol) {
  const major = paths(MAJOR, tol)
  const minor = paths(MINOR, tol)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    `<!-- Mermoz-Sacré-Cœur, Dakar. Data © OpenStreetMap contributors (ODbL). Generated by scripts/build-map.mjs -->` +
    `<g class="map-minor" stroke-width="1">${minor.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g class="map-major" stroke-width="2.2">${major.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g class="map-outline" stroke-width="1.4" stroke-dasharray="4 6">${outline.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `</svg>\n`
  return { svg, major: major.length, minor: minor.length }
}

let tol = TOLERANCE
let result = render(tol)
while (Buffer.byteLength(result.svg) > MAX_BYTES && tol < 6) {
  tol += 0.6
  result = render(tol)
}

await writeFile(OUT, result.svg)
console.log(
  `✓ ${OUT}: ${(Buffer.byteLength(result.svg) / 1024).toFixed(1)} KB, ${result.major} major + ${result.minor} minor streets, viewBox ${WIDTH}×${HEIGHT}, tolerance ${tol.toFixed(1)}`,
)
