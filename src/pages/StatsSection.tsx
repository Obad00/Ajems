import { useEffect, useState } from 'react'
import { BOARD_FIGURES } from '../content/figures'
import { displayableStats, type PublicStats } from '../services/stats'
import { useRepository } from '../storage'
import { CountUp } from '../ui/CountUp'
import { PendingBadge } from '../ui/PendingBadge'
import { Reveal } from '../ui/Reveal'

/**
 * Public figures, computed by the database (public_stats) — never typed by hand.
 * Below the threshold a figure is not shown; with none to show, the block says that membership is open.
 */
export function StatsSection() {
  const repo = useRepository()
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    repo.getPublicStats().then(
      (s) => active && (setStats(s), setLoaded(true)),
      () => active && setLoaded(true), // fail soft: the block falls back to "membership is open"
    )
    return () => {
      active = false
    }
  }, [repo])

  if (!loaded) return null
  const figures = displayableStats(stats)
  const boardItems = BOARD_FIGURES.items

  return (
    <section aria-labelledby="chiffres" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-y-2 border-navy py-2">
          <h2 id="chiffres" className="font-serif text-lg font-normal text-navy italic">
            L'AJEMS en chiffres
          </h2>
          <span className="text-sm text-muted">
            {repo.kind === 'mock' ? 'Démonstration — chiffres fictifs' : 'Calculés à partir des fiches reçues'}
          </span>
        </div>

        {figures.length ? (
          // Rules between figures whatever their number: each figure has a top and a left rule,
          // the ones on the outer edge are pushed out of the clipped box.
          <div className="overflow-hidden">
            {/* Shifted left by the cell padding so that the first column lines up with the band above. */}
            <dl className="-mt-px -ml-6 flex flex-wrap">
              {figures.map((f) => (
                <div key={f.key} className="flex w-full flex-col border-t border-l border-navy/15 py-8 pl-6 sm:w-1/2 lg:w-1/3">
                  <dt className="order-2 mt-2 text-lg text-muted">{f.label}</dt>
                  <dd className="font-serif text-6xl leading-none font-light text-navy sm:text-7xl">
                    <CountUp value={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="py-10 font-serif text-3xl text-navy italic sm:text-4xl">Les adhésions sont ouvertes.</p>
        )}

        <div className="border-t border-navy/15 pt-4">
          <p className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted">
            {boardItems.map((item) => (
              <span key={item.label}>
                <span className="font-serif text-base text-navy">{item.value ?? '[À VALIDER]'}</span> {item.label}
              </span>
            ))}
            <PendingBadge show={!BOARD_FIGURES.validated} />
          </p>
        </div>
      </Reveal>
    </section>
  )
}
