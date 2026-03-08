import { ref, computed } from 'vue'

const STORAGE_KEY = 'nomad:currency'

export type CurrencyCode =
  | 'USD' | 'EUR' | 'GBP' | 'PLN' | 'THB' | 'CZK'
  | 'TRY' | 'BRL' | 'MXN' | 'JPY' | 'KRW' | 'AUD'
  | 'CAD' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'INR'

export const SUPPORTED_CURRENCIES: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
]

const SYMBOL_MAP = Object.fromEntries(
  SUPPORTED_CURRENCIES.map(c => [c.code, c.symbol])
) as Record<CurrencyCode, string>

const currency = ref<CurrencyCode>('USD')
const rates = ref<Record<string, number>>({})

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SYMBOL_MAP[stored as CurrencyCode]) {
    currency.value = stored as CurrencyCode
  }
}

export function useCurrency() {
  function setCurrency(code: CurrencyCode) {
    currency.value = code
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }

  function setRates(newRates: Record<string, number>) {
    rates.value = newRates
  }

  function rawConvert(usdAmount: number): number {
    if (currency.value === 'USD') return usdAmount
    const rate = rates.value[currency.value]
    if (!rate) return usdAmount
    return Math.round(usdAmount * rate)
  }

  function formatCost(usdAmount: number): string {
    const converted = rawConvert(usdAmount)
    const code = rates.value[currency.value] || currency.value === 'USD'
      ? currency.value
      : 'USD'
    const symbol = SYMBOL_MAP[code] ?? '$'
    return `${symbol}${converted.toLocaleString('en-US')}`
  }

  const currencySymbol = computed(() => SYMBOL_MAP[currency.value] ?? '$')

  return {
    currency,
    rates,
    currencySymbol,
    setCurrency,
    setRates,
    rawConvert,
    formatCost,
  }
}
