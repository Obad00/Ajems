import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Printer } from 'lucide-react'
import { formatDateTime, memberSections } from '../services/format'
import { useRepository } from '../storage'
import { MEMBER_STATUSES, type MemberStatus } from '../storage/MemberRepository'
import { Alert } from '../ui/Alert'
import { Button, ButtonLink } from '../ui/Button'
import { Select } from '../ui/Select'
import { usePageTitle } from '../ui/usePageTitle'
import { StatusBadge } from './StatusBadge'
import { useMember } from './useMember'

export function MemberDetailPage() {
  const { id } = useParams()
  const { state, reload } = useMember(id)
  const repo = useRepository()
  const [status, setStatus] = useState<MemberStatus | ''>('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  usePageTitle(state.status === 'ready' ? `${state.member.dossier_number} — administration` : 'Fiche — administration')

  if (state.status === 'loading') return <p className="mx-auto max-w-6xl px-4 py-14 text-muted sm:px-6">Chargement de la fiche…</p>
  if (state.status !== 'ready')
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold">{state.status === 'missing' ? 'Fiche introuvable' : 'Impossible de charger la fiche'}</h1>
        <ButtonLink to="/admin" variant="secondary">
          Retour à la liste
        </ButtonLink>
      </div>
    )

  const m = state.member
  const current = status || m.status

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await repo.updateStatus(m.id, current)
      await reload()
      setStatus('')
      setMessage({ tone: 'success', text: 'Statut enregistré.' })
    } catch {
      setMessage({ tone: 'error', text: "Le statut n'a pas été enregistré. Réessayez." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link to="/admin" className="link-draw inline-flex min-h-11 items-center gap-2 font-medium text-navy">
        <ArrowLeft aria-hidden className="size-4" />
        Retour à la liste
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b-2 border-navy pb-6">
        <div className="space-y-2">
          <p className="font-mono text-sm font-semibold text-gold-ink">{m.dossier_number}</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            {m.first_name} <em className="font-normal">{m.last_name}</em>
          </h1>
          <p className="flex flex-wrap items-center gap-3 text-muted">
            <StatusBadge status={m.status} />
            Demande du {formatDateTime(m.created_at)}
          </p>
        </div>
        <ButtonLink to={`/admin/membres/${m.id}/impression`} variant="secondary" iconRight={<Printer aria-hidden className="size-5" />}>
          Imprimer la fiche
        </ButtonLink>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
        <section aria-labelledby="statut" className="self-start border-t border-navy/15 pt-6 lg:sticky lg:top-6 lg:col-span-4">
          <h2 id="statut" className="text-2xl font-semibold">
            Statut du dossier
          </h2>
          <div className="mt-4 space-y-4">
            <Select id="status" label="Nouveau statut" options={MEMBER_STATUSES} placeholder="Choisir…" value={current} onChange={(e) => setStatus(e.target.value as MemberStatus)} />
            <Button onClick={save} loading={saving} disabled={current === m.status} className="w-full">
              Enregistrer le statut
            </Button>
            {message && (
              <Alert tone={message.tone} role={message.tone === 'error' ? 'alert' : 'status'}>
                <p>{message.text}</p>
              </Alert>
            )}
          </div>
        </section>

        <div className="space-y-10 lg:col-span-8">
          {memberSections(m).map((section) => (
            <section key={section.title} aria-label={section.title} className="border-t border-navy/15 pt-6">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <dl className="mt-3 divide-y divide-navy/10">
                {section.rows.map((row) => (
                  <div key={row.label} className="grid gap-0.5 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
                    <dt className="text-sm font-semibold text-muted">{row.label}</dt>
                    <dd className="break-words whitespace-pre-line">{row.value || <span className="text-muted italic">Non renseigné</span>}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
