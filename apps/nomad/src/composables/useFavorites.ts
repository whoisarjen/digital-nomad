import { getFavoritesSchema } from '~/shared/global.schema'
import type { QueryOptions } from '~/composables/useCustomQuery'

export const useFavorites = (
  query?: globalThis.Ref<{ page?: number; limit?: number }>,
  queryOptions?: QueryOptions,
) => {
  return useCustomQuery('/api/favorites', query, queryOptions, getFavoritesSchema)
}
