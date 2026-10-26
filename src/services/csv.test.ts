import { describe, expect, it } from 'vitest'
import { demoMembers } from '../storage/seed'
import { csvCell, csvFileName, membersToCsv } from './csv'

const NOW = new Date('2026-10-30T10:00:00Z')

describe('CSV export', () => {
  it('starts with a UTF-8 BOM and uses ";" with CRLF lines', () => {
    const csv = membersToCsv(demoMembers(NOW).slice(0, 2))
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    const lines = csv.slice(1).split('\r\n')
    expect(lines).toHaveLength(4) // header + 2 rows + trailing empty
    expect(lines[0].split(';')[0]).toBe('Numéro de dossier')
    expect(lines[0].split(';')).toHaveLength(28)
  })

  it('keeps accents as is', () => {
    const [member] = demoMembers(NOW)
    const csv = membersToCsv([{ ...member, first_name: 'Aïssatou', commune: 'Mermoz-Sacré-Cœur' }])
    expect(csv).toContain(';Aïssatou;')
    expect(csv).toContain(';Mermoz-Sacré-Cœur;')
  })

  it('quotes cells containing ";", quotes or line breaks', () => {
    expect(csvCell('Couture; retouches')).toBe('"Couture; retouches"')
    expect(csvCell('Atelier "Exemple"')).toBe('"Atelier ""Exemple"""')
    expect(csvCell('ligne 1\nligne 2')).toBe('"ligne 1\nligne 2"')
    expect(csvCell('simple')).toBe('simple')
  })

  it('neutralises spreadsheet formulas typed by the public', () => {
    expect(csvCell('=HYPERLINK("http://x")')).toBe('"\'=HYPERLINK(""http://x"")"')
    expect(csvCell('+221 77 000 10 00')).toBe("'+221 77 000 10 00")
    expect(csvCell('-1')).toBe("'-1")
    expect(csvCell('@SUM(A1)')).toBe("'@SUM(A1)")
  })

  it('exports allowed columns only (no internal id)', () => {
    const [member] = demoMembers(NOW)
    const csv = membersToCsv([member])
    expect(csv).not.toContain(member.id)
    expect(csv).toContain(member.dossier_number)
  })

  it('names the file with the date', () => {
    expect(csvFileName(NOW)).toBe('ajems-membres-2026-10-30.csv')
  })
})
