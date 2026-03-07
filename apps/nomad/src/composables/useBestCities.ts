import type { InternalApi } from 'nitropack'

export const useBestCities = (
  queryOptions?: QueryOptions<InternalApi['/api/rankings/best-cities']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/rankings/best-cities']['get']>(
    '/api/rankings/best-cities',
    undefined,
    queryOptions,
    undefined,
  )
}
