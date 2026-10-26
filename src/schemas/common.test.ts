import { describe, expect, it } from 'vitest'
import { namesMatch, normalizeName, normalizePhone } from './common'

describe('normalizePhone', () => {
  it.each([
    ['771234567', '+221771234567'],
    ['77 123 45 67', '+221771234567'],
    ['77.123.45.67', '+221771234567'],
    ['+221 77 123 45 67', '+221771234567'],
    ['00221771234567', '+221771234567'],
    ['338001234', '+221338001234'],
    ['+33 6 12 34 56 78', '+33612345678'],
    ['0033612345678', '+33612345678'],
  ])('accepts %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each([
    ['', 'empty'],
    ['77123456', '8 digits'],
    ['7712345678', '10 digits'],
    ['571234567', 'Senegal number not starting with 3 or 7'],
    ['+22177123456', '+221 with 8 digits'],
    ['0612345678', 'national French number without country code'],
    ['abc', 'letters'],
  ])('rejects %s (%s)', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

describe('namesMatch', () => {
  it('ignores accents, case, extra spaces and hyphens', () => {
    expect(normalizeName('  Aïssatou   NDIAYE ')).toBe('aissatou ndiaye')
    expect(namesMatch('aissatou ndiaye', 'Aïssatou', 'Ndiaye')).toBe(true)
    expect(namesMatch('Fatou Bintou Sarr', 'Fatou-Bintou', 'Sarr')).toBe(true)
  })

  it('accepts last name first', () => {
    expect(namesMatch('Ndiaye Aïssatou', 'Aïssatou', 'Ndiaye')).toBe(true)
  })

  it('rejects a different name', () => {
    expect(namesMatch('Awa Ndiaye', 'Aïssatou', 'Ndiaye')).toBe(false)
    expect(namesMatch('Aïssatou', 'Aïssatou', 'Ndiaye')).toBe(false)
    expect(namesMatch('', 'Aïssatou', 'Ndiaye')).toBe(false)
  })
})
