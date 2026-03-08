import { useCurrency } from '~/composables/useCurrency'

export default defineNuxtPlugin(async () => {
  const { setRates } = useCurrency()

  try {
    const rates = await $fetch<Record<string, number>>('/api/exchange-rates')
    setRates(rates)
  } catch {
    // Rates will stay empty, formatCost falls back to USD
  }
})
