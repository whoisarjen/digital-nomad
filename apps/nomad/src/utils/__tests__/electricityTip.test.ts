import { describe, it, expect } from 'vitest'
import { getElectricityTip } from '../electricityTip'

describe('getElectricityTip', () => {
  it('returns null when no data', () => {
    expect(getElectricityTip(null, null)).toBeNull()
  })

  it('recommends UK adapter for Type G only', () => {
    const tip = getElectricityTip('G', 230)
    expect(tip).toContain('UK-style adapter')
  })

  it('recommends Type C/F adapter for European sockets', () => {
    const tip = getElectricityTip('C,F', 230)
    expect(tip).toContain('Type C/F adapter')
  })

  it('recommends North American adapter for Type A/B', () => {
    const tip = getElectricityTip('A,B', 120)
    expect(tip).toContain('North American adapter')
  })

  it('recommends Australian adapter for Type I only', () => {
    const tip = getElectricityTip('I', 230)
    expect(tip).toContain('Australian adapter')
  })

  it('notes that 230V is safe for modern electronics', () => {
    const tip = getElectricityTip('C,F', 230)
    expect(tip).toContain('230V')
    expect(tip).toContain('most modern electronics')
  })

  it('warns about low voltage for Americas/Japan', () => {
    const tip = getElectricityTip('A,B', 120)
    expect(tip).toContain('120V')
    expect(tip).toContain('check your devices')
  })

  it('handles mixed plug types by listing them', () => {
    const tip = getElectricityTip('A,B,C,I', 220)
    expect(tip).toContain('Type A, B, C, I')
  })
})
