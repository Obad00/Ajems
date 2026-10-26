import { ArrowRight } from 'lucide-react'
import { ABOUT } from '../content/about'
import { PHOTOS } from '../content/photos'
import { ButtonLink } from '../ui/Button'
import { PendingBadge } from '../ui/PendingBadge'
import { PhotoSlot } from '../ui/PhotoSlot'
import { Reveal } from '../ui/Reveal'
import { keepTogether } from '../ui/typography'
import { usePageTitle } from '../ui/usePageTitle'

export function AboutPage() {
  usePageTitle('À propos')
  return (
    <>
      {/* Front-page header: band between two rules, big title, photo */}
      <header className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-y-2 border-navy py-2 text-sm">
          <span className="font-serif text-base text-navy italic">{keepTogether('Mermoz-Sacré-Cœur, Dakar')}</span>
          <span className="text-muted">Association en cours de formalisation</span>
        </div>
        <div className="grid gap-10 py-12 md:grid-cols-12 md:gap-8 md:py-16">
          <div className="md:col-span-7">
            <h1 className="text-5xl font-semibold sm:text-6xl lg:text-7xl">
              Qui sommes-<em className="font-normal">nous</em>&nbsp;?
            </h1>
            <p className="mt-8 max-w-xl border-t border-line pt-6 text-xl leading-relaxed">{ABOUT.intro}</p>
          </div>
          <PhotoSlot photo={PHOTOS.about} ratio="aspect-[4/3]" className="md:col-span-5 md:mt-20" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
        {ABOUT.sections.map((s, i) => (
          <Reveal key={s.id}>
            <section aria-labelledby={s.id} className="grid gap-4 border-t border-navy/15 py-10 md:grid-cols-12 md:gap-8 md:py-14">
              <div className="md:col-span-4">
                <span aria-hidden className="font-serif text-lg text-gold-ink italic">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 id={s.id} className="mt-1 text-3xl font-semibold sm:text-4xl">
                  {s.title}
                  <PendingBadge show={!s.validated} />
                </h2>
              </div>
              <div className="text-lg md:col-span-7 md:col-start-6">
                {'paragraphs' in s && (
                  <div className="space-y-4">
                    {s.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {'list' in s && (
                  <ul className="border-t border-navy/10">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-4 border-b border-navy/10 py-3">
                        <span aria-hidden className="font-serif text-gold-ink italic">—</span>
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </Reveal>
        ))}

        <Reveal className="on-dark mt-10 bg-navy p-8 text-white sm:p-12">
          <div className="border-y-2 border-gold py-8 md:flex md:items-end md:justify-between md:gap-10">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Vous entreprenez à <em className="font-normal text-gold">{keepTogether('Mermoz-Sacré-Cœur')}</em>&nbsp;?
              </h2>
              <p className="mt-3 text-white/85">Remplissez votre fiche en ligne : environ 10 minutes.</p>
            </div>
            <ButtonLink to="/adhesion" variant="light" className="mt-6 w-full shrink-0 sm:w-auto md:mt-0" iconRight={<ArrowRight aria-hidden className="size-5" />}>
              Demander mon adhésion
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </>
  )
}
