import { Link } from 'react-router'
import { ArrowRight, Check, ChevronDown, Compass, Handshake, Megaphone, Users } from 'lucide-react'
import { HOME } from '../content/home'
import { SECTORS } from '../schemas/common'
import { ButtonLink } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { usePageTitle } from '../ui/usePageTitle'

const ICONS = { users: Users, compass: Compass, handshake: Handshake, megaphone: Megaphone } as const

export function HomePage() {
  usePageTitle('')
  const { hero, missions, benefits, sectors, process, faq } = HOME

  return (
    <>
      {/* Hero */}
      <section className="on-dark bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold tracking-wide text-gold uppercase">{hero.eyebrow}</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{hero.title}</h1>
            <p className="max-w-2xl text-lg text-white/85">{hero.lead}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <ButtonLink to="/adhesion" variant="light" iconRight={<ArrowRight aria-hidden className="size-5" />}>
                Demander mon adhésion
              </ButtonLink>
              <ButtonLink to="/a-propos" variant="onDark">
                Découvrir l'AJEMS
              </ButtonLink>
            </div>
          </div>
        </div>
        <div aria-hidden className="h-1 bg-gold" />
      </section>

      {/* Missions */}
      <section aria-labelledby="missions" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading id="missions" eyebrow="L'association" title={missions.title} pending={!missions.validated} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {missions.items.map((m) => {
            const Icon = ICONS[m.icon]
            return (
              <li key={m.title} className="rounded-xl border border-line bg-white p-6">
                <span className="mb-4 grid size-11 place-items-center rounded-lg bg-navy">
                  <Icon aria-hidden className="size-5 text-gold" />
                </span>
                <h3 className="text-xl font-semibold">{m.title}</h3>
                <p className="mt-1.5 text-muted">{m.text}</p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Benefits */}
      <section aria-labelledby="avantages" className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <SectionHeading id="avantages" eyebrow="Adhésion" title={benefits.title} pending={!benefits.validated}>
            {benefits.intro}
          </SectionHeading>
          <ul className="space-y-3">
            {benefits.items.map((b) => (
              <li key={b} className="flex gap-3 rounded-lg bg-surface p-4">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-ink" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sectors */}
      <section aria-labelledby="secteurs" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading id="secteurs" eyebrow="Secteurs" title={sectors.title} />
        <ul className="flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <li key={s.value} className="rounded-full border border-field bg-white px-4 py-2 text-sm">
              {s.label}
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section aria-labelledby="processus" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <SectionHeading id="processus" eyebrow="Comment adhérer" title={process.title} pending={!process.validated} />
          <ol className="grid gap-4 md:grid-cols-3">
            {process.steps.map((s, i) => (
              <li key={s.title} className="relative rounded-xl border border-line bg-surface p-6">
                <span className="mb-4 grid size-10 place-items-center rounded-full bg-navy font-serif text-lg font-bold text-white ring-2 ring-gold ring-offset-2 ring-offset-surface">
                  {i + 1}
                </span>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <ButtonLink to="/adhesion" className="mt-8 w-full sm:w-auto" iconRight={<ArrowRight aria-hidden className="size-5" />}>
            Demander mon adhésion
          </ButtonLink>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading id="faq" eyebrow="FAQ" title={faq.title} pending={!faq.validated} />
        <div className="divide-y divide-line rounded-xl border border-line bg-white">
          {faq.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown aria-hidden className="size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-2 px-5 pb-5 text-ink">
                <p>{item.a}</p>
                {'link' in item && (
                  <Link to={item.link.to} className="inline-flex min-h-11 items-center font-semibold text-navy underline underline-offset-4">
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
