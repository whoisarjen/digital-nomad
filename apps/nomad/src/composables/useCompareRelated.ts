import type { InternalApi } from 'nitropack'

export const useCompareRelated = (
  slug: globalThis.Ref<string>,
  queryOptions?: QueryOptions<InternalApi['/api/compare/related/:slug']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/compare/related/:slug']['get']>(
    `/api/compare/related/${slug.value}`,
    undefined,
    queryOptions,
    undefined,
  )
}
