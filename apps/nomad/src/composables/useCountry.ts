import type { InternalApi } from 'nitropack'

export const useCountries = (
  queryOptions?: QueryOptions<InternalApi['/api/countries']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/countries']['get']>(
    '/api/countries',
    undefined,
    queryOptions,
    undefined,
  )
}

export const useCountry = (
  query: globalThis.Ref<{ countrySlug: string }>,
  queryOptions?: QueryOptions<InternalApi['/api/countries/:countrySlug']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/countries/:countrySlug']['get']>(
    `/api/countries/${query.value.countrySlug}`,
    undefined,
    queryOptions,
    undefined,
  )
}
