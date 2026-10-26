import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Download, Search } from 'lucide-react'
import { SECTORS } from '../schemas/common'
import { downloadCsv } from '../services/csv'
import { formatDateTime, sectorsLabel } from '../services/format'
import { DEFAULT_FILTERS, filterMembers, type MemberFilters } from '../services/members'
import { MEMBER_STATUSES, type Member } from '../storage/MemberRepository'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Select } from '../ui/Select'
import { usePageTitle } from '../ui/usePageTitle'
import { StatusBadge } from './StatusBadge'
import { useMembers } from './useMember'

const REGLEMENT_FILTERS = [
  { value: 'accepted', label: 'Accepté' },
  { value: 'missing', label: 'Non accepté' },
]
const NO_MEMBERS: Member[] = []
const SORTS = [
  { value: 'newest', label: 'Plus récentes d’abord' },
  { value: 'oldest', label: 'Plus anciennes d’abord' },
]

export function MembersPage() {
  usePageTitle('Membres — administration')
  const state = useMembers()
  // Filters live in memory only (no web storage).
  const [filters, setFilters] = useState<MemberFilters>(DEFAULT_FILTERS)
  const set = <K extends keyof MemberFilters>(key: K, value: MemberFilters[K]) => setFilters((f) => ({ ...f, [key]: value }))

  const members = state.status === 'ready' ? state.members : NO_MEMBERS
  const visible = useMemo(() => filterMembers(members, filters), [members, filters])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Les <em className="font-normal">membres</em>
        </h1>
        <Button
          variant="secondary"
          icon={<Download aria-hidden className="size-5" />}
          disabled={!visible.length}
          onClick={() => downloadCsv(visible)}
        >
          Exporter en CSV ({visible.length})
        </Button>
      </div>

      <form role="search" aria-label="Rechercher et filtrer les fiches" onSubmit={(e) => e.preventDefault()} className="mt-8 grid gap-4 border-y border-navy/15 py-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Field
            id="q"
            label="Recherche"
            optional
            type="search"
            hint="Nom, téléphone, entreprise ou numéro de dossier."
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            className="pl-10"
          />
          <Search aria-hidden className="pointer-events-none absolute bottom-3.5 left-3 size-5 text-muted" />
        </div>
        <Select id="f-sector" label="Secteur" optional placeholder="Tous" options={SECTORS} value={filters.sector} onChange={(e) => set('sector', e.target.value as MemberFilters['sector'])} />
        <Select id="f-status" label="Statut" optional placeholder="Tous" options={MEMBER_STATUSES} value={filters.status} onChange={(e) => set('status', e.target.value as MemberFilters['status'])} />
        <Select
          id="f-reglement"
          label="Règlement"
          optional
          placeholder="Tous"
          options={REGLEMENT_FILTERS}
          value={filters.reglement === 'all' ? '' : filters.reglement}
          onChange={(e) => set('reglement', (e.target.value || 'all') as MemberFilters['reglement'])}
        />
        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4 lg:col-span-5">
          <div className="w-full sm:max-w-xs">
            <Select id="f-sort" label="Tri par date" options={SORTS} placeholder="Plus récentes d’abord" value={filters.sort === 'newest' ? '' : filters.sort} onChange={(e) => set('sort', (e.target.value || 'newest') as MemberFilters['sort'])} />
          </div>
          <Button variant="ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Réinitialiser
          </Button>
        </div>
      </form>

      <p role="status" className="mt-6 text-sm text-muted">
        {state.status === 'ready' && `${visible.length} fiche${visible.length > 1 ? 's' : ''} sur ${members.length}`}
      </p>

      {state.status === 'loading' && <p className="mt-6 text-muted">Chargement des fiches…</p>}
      {state.status === 'error' && (
        <div className="mt-6">
          <Alert tone="error" role="alert" title="Impossible de charger les fiches.">
            <p>Vérifiez votre connexion puis rechargez la page.</p>
          </Alert>
        </div>
      )}
      {state.status === 'ready' && !visible.length && <p className="mt-6 font-serif text-xl text-navy italic">Aucune fiche ne correspond à ces critères.</p>}

      {visible.length > 0 && (
        <>
          {/* Desktop: table */}
          <table className="mt-4 hidden w-full border-collapse text-left md:table">
            <caption className="sr-only">Fiches d'adhésion</caption>
            <thead>
              <tr className="border-b-2 border-navy text-sm text-muted">
                <th scope="col" className="py-3 pr-4 font-semibold">Dossier</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Nom</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Entreprise ou projet</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Secteurs</th>
                <th scope="col" className="py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((m) => (
                <tr key={m.id} className="border-b border-navy/10 align-top hover:bg-white">
                  <td className="py-3 pr-4 font-mono text-sm">
                    <Link to={`/admin/membres/${m.id}`} className="link-draw inline-flex min-h-11 items-center font-semibold text-navy">
                      {m.dossier_number}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 pt-5 text-sm whitespace-nowrap text-muted">{formatDateTime(m.created_at)}</td>
                  <td className="py-3 pr-4 pt-5">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="py-3 pr-4 pt-5">{m.business_name}</td>
                  <td className="max-w-56 py-3 pr-4 pt-5 text-sm text-muted">{sectorsLabel(m)}</td>
                  <td className="py-3 pt-5">
                    <StatusBadge status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: list with rules */}
          <ul className="mt-4 border-t border-navy/15 md:hidden">
            {visible.map((m) => (
              <li key={m.id} className="border-b border-navy/15">
                <Link to={`/admin/membres/${m.id}`} className="block space-y-1 py-4">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm font-semibold text-navy">{m.dossier_number}</span>
                    <StatusBadge status={m.status} />
                  </span>
                  <span className="block font-serif text-xl text-navy">
                    {m.first_name} {m.last_name}
                  </span>
                  <span className="block text-sm text-muted">
                    {m.business_name} · {formatDateTime(m.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
