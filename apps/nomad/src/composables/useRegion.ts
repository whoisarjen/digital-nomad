import type { InternalApi } from 'nitropack'

export const useRegion = (
  query: globalThis.Ref<{ region: string }>,
  queryOptions?: QueryOptions<InternalApi['/api/regions/:region']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/regions/:region']['get']>(
    `/api/regions/${query.value.region}`,
    undefined,
    queryOptions,
    undefined,
  )
}
