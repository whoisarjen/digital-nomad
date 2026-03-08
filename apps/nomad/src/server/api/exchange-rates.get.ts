export default defineCachedEventHandler(async () => {
  const response = await $fetch<{ rates: Record<string, number> }>(
    'https://api.frankfurter.dev/v1/latest?base=USD'
  )

  return response.rates
}, {
  maxAge: 86400, // cache for 24 hours (ECB updates once per day)
  swr: true,     // serve stale while revalidating
})
