// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'

describe('useCurrency', () => {
  beforeEach(async () => {
    localStorage.clear()
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency, setRates } = useCurrency()
    setCurrency('USD')
    setRates({})
  })

  it('defaults to USD', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { currency } = useCurrency()
    expect(currency.value).toBe('USD')
  })

  it('setCurrency updates the reactive currency ref', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { currency, setCurrency } = useCurrency()
    setCurrency('EUR')
    expect(currency.value).toBe('EUR')
  })

  it('setCurrency persists value to localStorage', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency } = useCurrency()
    setCurrency('GBP')
    expect(localStorage.getItem('nomad:currency')).toBe('GBP')
  })

  it('formatCost returns USD format when no rates loaded', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { formatCost } = useCurrency()
    expect(formatCost(1500)).toBe('$1,500')
  })

  it('formatCost converts to EUR when currency is EUR and rates are loaded', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency, setRates, formatCost } = useCurrency()
    setRates({ EUR: 0.92, GBP: 0.79 })
    setCurrency('EUR')
    // 1500 * 0.92 = 1380
    expect(formatCost(1500)).toBe('€1,380')
  })

  it('formatCost uses correct symbol for each currency', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency, setRates, formatCost } = useCurrency()
    setRates({ GBP: 0.5, PLN: 4.0, THB: 35.0, JPY: 150.0 })

    setCurrency('GBP')
    expect(formatCost(1000)).toBe('£500')

    setCurrency('PLN')
    expect(formatCost(1000)).toContain('4,000')

    setCurrency('JPY')
    expect(formatCost(1000)).toContain('150,000')
  })

  it('formatCost falls back to USD if rate is missing for selected currency', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency, setRates, formatCost } = useCurrency()
    setRates({ EUR: 0.92 })
    setCurrency('GBP') // rate not loaded
    expect(formatCost(1500)).toBe('$1,500')
  })

  it('rawConvert returns the numeric converted value', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency, setRates, rawConvert } = useCurrency()
    setRates({ EUR: 0.92 })
    setCurrency('EUR')
    expect(rawConvert(100)).toBe(92)
  })

  it('rawConvert returns USD amount when no rate available', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { rawConvert } = useCurrency()
    expect(rawConvert(100)).toBe(100)
  })

  it('currencySymbol returns the correct symbol', async () => {
    const { useCurrency } = await import('~/composables/useCurrency')
    const { setCurrency, currencySymbol } = useCurrency()

    expect(currencySymbol.value).toBe('$')

    setCurrency('EUR')
    expect(currencySymbol.value).toBe('€')

    setCurrency('GBP')
    expect(currencySymbol.value).toBe('£')
  })
})
