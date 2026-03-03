import type { InternalApi } from 'nitropack'

export const useComparePairs = (
  queryOptions?: QueryOptions<InternalApi['/api/compare']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/compare']['get']>(
    '/api/compare',
    undefined,
    queryOptions,
    undefined,
  )
}
