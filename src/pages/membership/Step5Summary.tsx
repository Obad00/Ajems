import { useState, type FormEvent, type ReactNode } from 'react'
import { Pencil, Send } from 'lucide-react'
import { REGLEMENT } from '../../content/reglement'
import { LEGAL_STATUSES, MEMBER_TYPES, NEEDS, SECTORS, ZONE_LINKS, labelOf, normalizePhone } from '../../schemas/common'
import type { MemberDraft } from '../../schemas/member'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { StepActions } from './shared'
import type { StepIndex } from './draft'

type Row = [label: string, value: ReactNode]

function formatDate(iso?: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function Section({ title, step, rows, onEdit }: { title: string; step: StepIndex; rows: Row[]; onEdit: (s: StepIndex) => void }) {
  const headingId = `summary-${step}`
  return (
    <section aria-labelledby={headingId} className="rounded-lg border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2 sm:px-5">
        <h3 id={headingId} className="text-lg font-semibold">
          {title}
        </h3>
        <Button
          variant="ghost"
          className="min-h-11 px-3 text-sm"
          icon={<Pencil aria-hidden className="size-4" />}
          aria-label={`Modifier : ${title}`}
          onClick={() => onEdit(step)}
        >
          Modifier
        </Button>
      </div>
      <dl className="divide-y divide-line px-4 sm:px-5">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-0.5 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-muted">{label}</dt>
            <dd className="break-words whitespace-pre-line">{value || <span className="text-muted italic">Non renseigné</span>}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

type Props = {
  draft: MemberDraft
  onEdit: (step: StepIndex) => void
  onBack: () => void
  onSubmit: (honeypot: string) => Promise<void>
  submitting: boolean
  error: string | null
}

export function Step5Summary({ draft, onEdit, onBack, onSubmit, submitting, error }: Props) {
  const [honeypot, setHoneypot] = useState('')
  const { identity: i, business: b, skills: s, reglement: r } = draft
  const sectors = (b.sectors ?? []).map((v) => (v === 'autre' && b.sector_other ? `Autre : ${b.sector_other}` : labelOf(SECTORS, v)))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(honeypot)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <p>Vérifiez vos informations avant l'envoi. Vous pouvez encore modifier chaque section.</p>

      {error && (
        <Alert tone="error" role="alert" title="Votre fiche n'a pas été envoyée.">
          <p>{error}</p>
        </Alert>
      )}

      <Section
        title="Identité et contact"
        step={0}
        onEdit={onEdit}
        rows={[
          ['Prénom et nom', `${i.first_name ?? ''} ${i.last_name ?? ''}`.trim()],
          ['Année de naissance', i.birth_year],
          ['Téléphone', i.phone ? (normalizePhone(i.phone) ?? i.phone).replace(/^\+221(\d{2})(\d{3})(\d{2})(\d{2})$/, '+221 $1 $2 $3 $4') : ''],
          ['Email', i.email],
          ['Quartier', i.quartier],
          ['Commune', i.commune],
          ['Lien avec la zone', labelOf(ZONE_LINKS, i.zone_link)],
        ]}
      />
      <Section
        title="Entreprise ou projet"
        step={1}
        onEdit={onEdit}
        rows={[
          ['Situation', labelOf(MEMBER_TYPES, b.member_type)],
          ["Nom de l'entreprise ou du projet", b.business_name],
          ['Secteurs', sectors.join('\n')],
          ['Description', b.description],
          ...(b.member_type === 'entrepreneur' ? ([['Date de création', formatDate(b.founded_on)]] as Row[]) : []),
          ['Statut juridique', labelOf(LEGAL_STATUSES, b.legal_status)],
          ["Localisation de l'activité", b.business_location],
          ['Site web / réseaux', b.links],
        ]}
      />
      <Section
        title="Compétences et besoins"
        step={2}
        onEdit={onEdit}
        rows={[
          ['Compétences principales', s.skills],
          ['Services proposés', s.services],
          ['Expérience', s.experience],
          ['Besoins prioritaires', (s.needs ?? []).map((v) => labelOf(NEEDS, v)).join(', ')],
          ['Précisions', s.needs_details],
        ]}
      />
      <Section
        title="Règlement intérieur"
        step={3}
        onEdit={onEdit}
        rows={[
          ['Règlement accepté', r.reglement_accepted ? `Oui (version ${REGLEMENT.version})` : 'Non'],
          ['Nom complet tapé', r.full_name_typed],
          ['Exactitude certifiée', r.accuracy_confirmed ? 'Oui' : 'Non'],
        ]}
      />

      {/* Honeypot: invisible to people, often filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website_confirm">Ne pas remplir ce champ</label>
        <input
          id="website_confirm"
          name="website_confirm"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <StepActions onBack={onBack} nextLabel="Envoyer ma fiche" nextIcon={<Send aria-hidden className="size-5" />} loading={submitting} />
    </form>
  )
}
