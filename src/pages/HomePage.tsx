import { Link } from 'react-router'
import { ArrowRight, Plus } from 'lucide-react'
import { HOME } from '../content/home'
import { PHOTOS } from '../content/photos'
import { SECTORS } from '../schemas/common'
import { ButtonLink } from '../ui/Button'
import { Marquee } from '../ui/Marquee'
import { PendingBadge } from '../ui/PendingBadge'
import { PhotoSlot } from '../ui/PhotoSlot'
import { Reveal } from '../ui/Reveal'
import { Rich } from '../ui/Rich'
import { SectionHeading } from '../ui/SectionHeading'
import { StreetMap } from '../ui/StreetMap'
import { keepTogether } from '../ui/typography'
import { usePageTitle } from '../ui/usePageTitle'

const pad = (n: number) => String(n).padStart(2, '0')

function Hero() {
  const { hero } = HOME
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-24 md:pb-28 lg:pt-28">
        <h1 className="text-[clamp(1.9rem,9vw,3.75rem)] md:max-w-[34rem] lg:max-w-[44rem] leading-[1.04] font-semibold text-white lg:text-[4.75rem]">
          <Rich text={hero.title} emClassName="font-normal text-gold" />
        </h1>
        <p className="mt-6 max-w-md text-lg text-white/85 md:ml-[3ch]">{hero.lead}</p>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6 md:ml-[3ch]">
          <ButtonLink to="/adhesion" variant="light" className="w-full sm:w-auto" iconRight={<ArrowRight aria-hidden className="size-5" />}>
            Demander mon adhésion
          </ButtonLink>
          <Link to="/a-propos" className="link-draw inline-flex min-h-11 items-center font-medium text-white">
            Découvrir l'AJEMS
          </Link>
        </div>
      </div>

      {/* Mobile: a visible band under the buttons. Desktop: background on the right, faded towards the title. */}
      <StreetMap
        draw
        className={
          'mt-10 h-60 text-gold [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] ' +
          '[&_svg]:origin-[66%_38%] [&_svg]:scale-[1.7] ' +
          // The title ends around 61% of the width: no line may run under it.
          'md:absolute md:inset-0 md:-z-10 md:mt-0 md:h-auto md:[&_svg]:scale-100 ' +
          'md:[mask-image:linear-gradient(to_right,transparent_0%,transparent_64%,rgb(0_0_0/0.45)_75%,black_88%)]'
        }
      />

      <PhotoSlot
        photo={PHOTOS.hero}
        onDark
        className="absolute right-6 bottom-20 hidden w-44 outline outline-1 outline-offset-[6px] outline-gold md:block lg:right-10 lg:w-52 xl:right-[calc((100vw-72rem)/2+1.5rem)]"
      />

      <div className="relative bg-navy">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 border-t border-gold/50 px-4 py-3 text-xs text-white/75 sm:px-6">
          <span className="font-serif text-sm text-white italic">Dakar</span>
          <span aria-hidden>—</span>
          <span>{keepTogether('Commune de Mermoz-Sacré-Cœur')}</span>
          <span aria-hidden className="hidden sm:inline">·</span>
          <span>14°42′ N · 17°28′ O</span>
          <span className="ml-auto hidden text-white/65 sm:inline">Plan © les contributeurs OpenStreetMap</span>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  usePageTitle('')
  const { missions, manifesto, benefits, sectors, process, faq } = HOME

  return (
    <>
      <Hero />

      {/* Missions: numbered list with fine rules, alternating offset */}
      <section aria-labelledby="missions" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <SectionHeading id="missions" title={missions.title} pending={!missions.validated} />
        </Reveal>
        <ol className="mt-12 border-b border-navy/15 md:mt-16">
          {missions.items.map((m, i) => (
            <li key={m.title}>
              <Reveal className={`grid gap-2 border-t border-navy/15 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10 ${i % 2 ? 'md:pl-[8%]' : ''}`}>
                <span aria-hidden className="font-serif text-6xl leading-none font-light text-gold-ink md:col-span-2 md:text-7xl">
                  {pad(i + 1)}
                </span>
                <h3 className="text-3xl font-semibold md:col-span-4 md:text-4xl">{m.title}</h3>
                <p className="text-lg text-muted md:col-span-5">{m.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Manifesto: front-page band between two rules */}
      <section aria-labelledby="manifeste" className="on-dark bg-navy text-white">
        <Reveal className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-y-2 border-gold py-2">
            <h2 id="manifeste" className="font-serif text-lg font-normal text-white italic">
              {manifesto.kicker}
              <PendingBadge show={!manifesto.validated} />
            </h2>
            <span className="text-sm text-white/75">{keepTogether('Mermoz-Sacré-Cœur, Dakar')}</span>
          </div>
          <blockquote className="mt-10 md:mt-16 md:pl-[16%]">
            <p className="font-serif text-3xl leading-[1.15] font-light text-white italic sm:text-5xl lg:text-6xl">
              «&nbsp;{keepTogether(manifesto.quote)}&nbsp;»
            </p>
            <footer className="mt-8 flex items-center gap-3 text-white/80">
              <span aria-hidden className="h-px w-10 bg-gold" />
              {manifesto.signature}
            </footer>
          </blockquote>
        </Reveal>
      </section>

      {/* Benefits: sticky title, list with rules */}
      <section aria-labelledby="avantages" className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-12 md:gap-8 md:py-28">
        <Reveal className="self-start md:sticky md:top-28 md:col-span-5">
          <SectionHeading id="avantages" title={benefits.title} pending={!benefits.validated}>
            {benefits.intro}
          </SectionHeading>
        </Reveal>
        <ul className="border-t border-navy/15 md:col-span-6 md:col-start-7 md:mt-24">
          {benefits.items.map((b) => (
            <li key={b} className="flex gap-4 border-b border-navy/15 py-5 text-lg">
              <span aria-hidden className="font-serif text-gold-ink italic">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sectors: marquee */}
      <section aria-labelledby="secteurs" className="pb-20 md:pb-28">
        <Reveal className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
          <SectionHeading id="secteurs" title={sectors.title} />
        </Reveal>
        <Marquee items={SECTORS.map((s) => s.label)} label="Secteurs d'activité des membres" />
      </section>

      {/* Process: vertical timeline with big numbers */}
      <section aria-labelledby="processus" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:grid md:grid-cols-12 md:gap-8 md:py-28">
          <Reveal className="self-start md:sticky md:top-28 md:col-span-4">
            <SectionHeading id="processus" title={process.title} pending={!process.validated} />
            <ButtonLink to="/adhesion" className="mt-8 hidden md:inline-flex" iconRight={<ArrowRight aria-hidden className="size-5" />}>
              Demander mon adhésion
            </ButtonLink>
          </Reveal>
          <ol className="mt-12 md:col-span-7 md:col-start-6 md:mt-0">
            {process.steps.map((s, i) => (
              <li key={s.title} className="relative grid grid-cols-[4.5rem_1fr] gap-4 pb-12 last:pb-0 sm:grid-cols-[6rem_1fr]">
                {i < process.steps.length - 1 && <span aria-hidden className="absolute top-20 bottom-3 left-[1.4rem] w-px bg-gold sm:left-[1.9rem]" />}
                <span aria-hidden className="font-serif text-6xl leading-none font-light text-navy sm:text-7xl">
                  {i + 1}
                </span>
                <Reveal className="pt-2">
                  <h3 className="text-2xl font-semibold sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 text-lg text-muted">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <ButtonLink to="/adhesion" className="mt-12 w-full md:hidden" iconRight={<ArrowRight aria-hidden className="size-5" />}>
            Demander mon adhésion
          </ButtonLink>
        </div>
      </section>

      {/* FAQ: list with rules */}
      <section aria-labelledby="faq" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:grid md:grid-cols-12 md:gap-8 md:py-28">
        <Reveal className="md:col-span-4">
          <SectionHeading id="faq" title={faq.title} pending={!faq.validated} />
        </Reveal>
        <div className="mt-10 border-t border-navy/25 md:col-span-8 md:mt-2">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-b border-navy/25">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl text-navy sm:text-2xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus aria-hidden className="size-6 shrink-0 text-gold-ink transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className="max-w-2xl space-y-2 pb-6 text-lg text-ink">
                <p>{item.a}</p>
                {'link' in item && (
                  <Link to={item.link.to} className="link-draw inline-flex min-h-11 items-center font-semibold text-navy">
                    {item.link.label}
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
