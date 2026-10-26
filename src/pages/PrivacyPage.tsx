import { PRIVACY } from '../content/privacy'
import { Card } from '../ui/Card'
import { usePageTitle } from '../ui/usePageTitle'

export function PrivacyPage() {
  usePageTitle('Confidentialité et mentions légales')
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <p className="text-sm font-semibold tracking-wide text-gold-ink uppercase">Vos données</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Confidentialité et mentions légales</h1>
        <p className="text-muted">{PRIVACY.intro}</p>
        <p className="text-sm text-muted">Dernière mise à jour : {PRIVACY.updated}</p>
      </header>

      <nav aria-label="Sommaire" className="mb-8 rounded-xl border border-line bg-white p-5">
        <p className="mb-2 font-semibold text-navy">Sommaire</p>
        <ol className="grid gap-x-6 sm:grid-cols-2">
          {PRIVACY.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex min-h-11 items-center text-navy underline-offset-4 hover:underline">
                {s.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#mentions" className="flex min-h-11 items-center text-navy underline-offset-4 hover:underline">
              {PRIVACY.legal.title}
            </a>
          </li>
        </ol>
      </nav>

      <Card className="space-y-8">
        {PRIVACY.sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id} className="scroll-mt-24 space-y-2">
            <h2 id={s.id} className="text-xl font-bold">
              {s.title}
            </h2>
            {s.list && (
              <ul className="list-disc space-y-1.5 pl-5 marker:text-gold-ink">
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
            {s.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}

        <section aria-labelledby="mentions" className="scroll-mt-24 space-y-3 border-t border-line pt-8">
          <h2 id="mentions" className="text-xl font-bold">
            {PRIVACY.legal.title}
          </h2>
          <dl className="divide-y divide-line">
            {PRIVACY.legal.items.map(([label, value]) => (
              <div key={label} className="grid gap-0.5 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Card>
    </div>
  )
}
