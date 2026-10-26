import { Link, useParams } from 'react-router'
import { ArrowLeft, Printer } from 'lucide-react'
import { PAPER_SIGNATURE_NOTICE, REGLEMENT } from '../content/reglement'
import { formatDateTime, memberSections } from '../services/format'
import { Button } from '../ui/Button'
import { ReglementText } from '../ui/ReglementText'
import { usePageTitle } from '../ui/usePageTitle'
import { useMember } from './useMember'

/** A4 printable form: member data, the accepted règlement and a handwritten signature area. */
export function MemberPrintPage() {
  const { id } = useParams()
  const { state } = useMember(id)
  usePageTitle(state.status === 'ready' ? `Fiche ${state.member.dossier_number}` : 'Fiche imprimable')

  if (state.status === 'loading') return <p className="mx-auto max-w-3xl px-4 py-14 text-muted">Chargement…</p>
  if (state.status !== 'ready') return <p className="mx-auto max-w-3xl px-4 py-14">Fiche introuvable.</p>

  const m = state.member
  const sameVersion = m.reglement_version === REGLEMENT.version

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to={`/admin/membres/${m.id}`} className="link-draw inline-flex min-h-11 items-center gap-2 font-medium text-navy">
          <ArrowLeft aria-hidden className="size-4" />
          Retour à la fiche
        </Link>
        <Button onClick={() => window.print()} icon={<Printer aria-hidden className="size-5" />}>
          Imprimer
        </Button>
      </div>

      <article className="bg-white p-6 text-[0.95rem] sm:p-10 print:p-0 print:text-[10pt]">
        <header className="flex items-baseline justify-between gap-4 border-y-2 border-navy py-2 print:border-black">
          <span className="font-serif text-lg italic">AJEMS — Fiche d'adhésion</span>
          <span className="font-mono text-sm font-semibold">{m.dossier_number}</span>
        </header>
        <h1 className="mt-6 text-3xl font-semibold print:text-[20pt]">
          {m.first_name} {m.last_name}
        </h1>
        <p className="text-sm text-muted print:text-black">Demande reçue le {formatDateTime(m.created_at)}</p>

        {/* Règlement data is printed with the règlement text below, not twice. */}
        {memberSections(m)
          .filter((section) => section.title !== 'Règlement intérieur')
          .map((section) => (
            <section key={section.title} className="mt-6">
              <h2 className="border-b border-navy/30 pb-1 text-lg font-semibold print:border-black">{section.title}</h2>
              <dl className="mt-2 grid grid-cols-[11rem_1fr] gap-x-4 gap-y-1">
                {section.rows.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-sm text-muted print:text-black">{row.label}</dt>
                    <dd className="break-words whitespace-pre-line">{row.value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

        <section className="mt-8 break-before-page">
          <h2 className="border-b border-navy/30 pb-1 text-lg font-semibold print:border-black">
            {REGLEMENT.title} — version {m.reglement_version}
          </h2>
          <p className="mt-2 text-sm">
            Accepté en ligne le {formatDateTime(m.reglement_accepted_at)}, avec saisie du nom « {m.full_name_typed} ».
            {m.accuracy_confirmed && ' Exactitude des informations certifiée.'}
          </p>
          {sameVersion ? (
            <div className="mt-4 text-sm">
              <ReglementText />
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold">
              Le texte de la version {m.reglement_version} n'est plus affiché sur le site : joindre l'exemplaire papier de cette version.
            </p>
          )}
        </section>

        <section aria-label="Signatures" className="mt-10 break-inside-avoid border-2 border-navy p-5 print:border-black">
          <p className="text-sm">{PAPER_SIGNATURE_NOTICE.replace('pourra vous être demandée lors de la réunion', 'est apposée ci-dessous')}</p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <p>
              Fait à : <span className="inline-block w-40 border-b border-dotted border-black align-bottom" />
            </p>
            <p>
              Le : <span className="inline-block w-40 border-b border-dotted border-black align-bottom" />
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold">Signature du membre</p>
              <p className="text-xs text-muted print:text-black">précédée de la mention « Lu et approuvé »</p>
              <div className="mt-2 h-28 border border-dashed border-navy/50 print:border-black" />
            </div>
            <div>
              <p className="font-semibold">Pour le bureau de l'AJEMS</p>
              <p className="text-xs text-muted print:text-black">nom, fonction et signature</p>
              <div className="mt-2 h-28 border border-dashed border-navy/50 print:border-black" />
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
