import type { MemberInput } from '../schemas/member'
import { computePublicStats, type PublicStats } from '../services/stats'
import { StorageError, type CreateResult, type Member, type MemberRepository, type MemberStatus } from './MemberRepository'

type Options = {
  /** Fictitious records to start with (demo admin). */
  seed?: Member[]
  /** Simulated network latency, in ms. */
  latency?: number
  /** When true, every write fails (used to test and demo the error state). */
  failWrites?: boolean
  now?: () => Date
  /** Fixed fictitious public figures (demo); computed from the members otherwise. */
  stats?: PublicStats
}

/** In-memory repository: data lives in the page and disappears on reload. Fictitious data only. */
export class MockRepository implements MemberRepository {
  readonly kind = 'mock' as const
  private members: Member[]
  private sequence: number
  private readonly latency: number
  private readonly failWrites: boolean
  private readonly now: () => Date
  private readonly stats: PublicStats | undefined

  constructor({ seed = [], latency = 0, failWrites = false, now = () => new Date(), stats }: Options = {}) {
    this.members = [...seed]
    this.sequence = seed.length
    this.latency = latency
    this.failWrites = failWrites
    this.now = now
    this.stats = stats
  }

  private wait() {
    return this.latency ? new Promise((r) => setTimeout(r, this.latency)) : Promise.resolve()
  }

  async create(input: MemberInput): Promise<CreateResult> {
    await this.wait()
    if (this.failWrites) throw new StorageError()
    const at = this.now()
    this.sequence += 1
    const dossier_number = `AJEMS-${at.getFullYear()}-${String(this.sequence).padStart(4, '0')}`
    this.members.push({
      ...input,
      id: crypto.randomUUID(),
      dossier_number,
      created_at: at.toISOString(),
      status: 'nouvelle',
      reglement_accepted_at: at.toISOString(),
    })
    return { dossier_number }
  }

  async list(): Promise<Member[]> {
    await this.wait()
    return [...this.members].sort((a, b) => b.created_at.localeCompare(a.created_at))
  }

  async getById(id: string): Promise<Member | null> {
    await this.wait()
    return this.members.find((m) => m.id === id) ?? null
  }

  async getPublicStats(): Promise<PublicStats> {
    await this.wait()
    return this.stats ?? computePublicStats(this.members)
  }

  async updateStatus(id: string, status: MemberStatus): Promise<void> {
    await this.wait()
    if (this.failWrites) throw new StorageError()
    const member = this.members.find((m) => m.id === id)
    if (!member) throw new StorageError('Fiche introuvable.')
    member.status = status
  }
}
