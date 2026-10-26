import { ArrowRight } from 'lucide-react'
import { ABOUT } from '../content/about'
import { ButtonLink } from '../ui/Button'
import { PendingBadge } from '../ui/PendingBadge'
import { usePageTitle } from '../ui/usePageTitle'

export function AboutPage() {
  usePageTitle('À propos')
  return (
    <>
      <section className="on-dark bg-navy text-white">
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-semibold tracking-wide text-gold uppercase">À propos</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Qui sommes-nous ?</h1>
          <p className="text-lg text-white/85">{ABOUT.intro}</p>
        </div>
        <div aria-hidden className="h-1 bg-gold" />
      </section>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 sm:py-16">
        {ABOUT.sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id} className="rounded-xl border border-line bg-white p-6 sm:p-8">
            <h2 id={s.id} className="mb-3 border-l-4 border-gold pl-3 text-2xl font-bold">
              {s.title}
              <PendingBadge show={!s.validated} />
            </h2>
            {'paragraphs' in s && (
              <div className="space-y-3">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
            {'list' in s && (
              <ul className="list-disc space-y-1.5 pl-5 marker:text-gold-ink">
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="rounded-xl bg-navy p-6 text-white sm:p-8 on-dark">
          <h2 className="text-2xl font-bold text-white">Vous entreprenez à Mermoz-Sacré-Cœur ?</h2>
          <p className="mt-2 text-white/85">Remplissez votre fiche en ligne : environ 10 minutes.</p>
          <ButtonLink to="/adhesion" variant="light" className="mt-5 w-full sm:w-auto" iconRight={<ArrowRight aria-hidden className="size-5" />}>
            Demander mon adhésion
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
