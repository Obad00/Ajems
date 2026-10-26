import { PRIVACY } from '../content/privacy'
import { Reveal } from '../ui/Reveal'
import { usePageTitle } from '../ui/usePageTitle'

export function PrivacyPage() {
  usePageTitle('Confidentialité et mentions légales')
  const { mapCredit } = PRIVACY.legal
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <header className="max-w-3xl space-y-5">
        <h1 className="text-5xl font-semibold sm:text-6xl">
          Confidentialité <em className="font-normal">et</em> mentions légales
        </h1>
        <p className="text-xl leading-relaxed text-muted">{PRIVACY.intro}</p>
        <p className="text-sm text-muted">Dernière mise à jour : {PRIVACY.updated}</p>
      </header>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
        <nav aria-label="Sommaire" className="self-start md:sticky md:top-24 md:col-span-4">
          <p className="font-serif text-lg text-navy italic">Sommaire</p>
          <ol className="mt-3 border-t border-navy/15">
            {[...PRIVACY.sections, { id: 'mentions', title: PRIVACY.legal.title }].map((s) => (
              <li key={s.id} className="border-b border-navy/15">
                <a href={`#${s.id}`} className="flex min-h-11 items-center py-1 text-navy">
                  <span className="link-draw">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="md:col-span-8">
          {PRIVACY.sections.map((s) => (
            <Reveal key={s.id}>
              <section aria-labelledby={s.id} className="scroll-mt-24 space-y-3 border-t border-navy/15 py-8">
                <h2 id={s.id} className="text-2xl font-semibold sm:text-3xl">
                  {s.title}
                </h2>
                {s.list && (
                  <ul className="space-y-2">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-3">
                        <span aria-hidden className="font-serif text-gold-ink italic">—</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            </Reveal>
          ))}

          <section aria-labelledby="mentions" className="scroll-mt-24 border-t-2 border-navy pt-8">
            <h2 id="mentions" className="text-2xl font-semibold sm:text-3xl">
              {PRIVACY.legal.title}
            </h2>
            <dl className="mt-4 divide-y divide-navy/10">
              {PRIVACY.legal.items.map(([label, value]) => (
                <div key={label} className="grid gap-0.5 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div className="grid gap-0.5 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-muted">{mapCredit.label}</dt>
                <dd>
                  {mapCredit.text}{' '}
                  <a href={mapCredit.href} className="link-draw font-semibold text-navy" rel="noopener" target="_blank">
                    {mapCredit.linkLabel}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}
