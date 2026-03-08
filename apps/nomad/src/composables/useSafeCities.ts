import type { InternalApi } from 'nitropack'

export const useSafeCities = (
  query: globalThis.Ref<{ context: string }>,
  queryOptions?: QueryOptions<InternalApi['/api/safe-cities/:context']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/safe-cities/:context']['get']>(
    `/api/safe-cities/${query.value.context}`,
    undefined,
    queryOptions,
    undefined,
  )
}
