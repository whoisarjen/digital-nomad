import { CACHE_TAGS } from '~/constants/cache.constant';

export default defineCustomCacheEventHandler(async () => {
  const response = await $fetch<{ rates: Record<string, number> }>(
    'https://api.frankfurter.dev/v1/latest?base=USD'
  )

  return response.rates
}, {
  tags: [CACHE_TAGS.EXCHANGE_RATES],
  ttlSeconds: 86400, // the ECB publishes once per day
  varyByLocale: false, // plain numbers, identical in every locale
})
