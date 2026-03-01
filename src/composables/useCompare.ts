import type { InternalApi } from 'nitropack'

export const useCompare = (
  slugs: globalThis.Ref<string>,
  queryOptions?: QueryOptions<InternalApi['/api/compare/:slugs']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/compare/:slugs']['get']>(
    `/api/compare/${slugs.value}`,
    undefined,
    queryOptions,
    undefined,
  )
}
