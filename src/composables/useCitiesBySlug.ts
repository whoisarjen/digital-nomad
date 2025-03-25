import type { InternalApi } from 'nitropack';
import { type GetCitiesBySlugSchema, getCitiesBySlugSchema } from '~/shared/global.schema';

export const useCitiesBySlug = (
  query: globalThis.Ref<Partial<GetCitiesBySlugSchema>>,
  queryOptions?: QueryOptions<InternalApi['/api/cities/:slug']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/cities/:slug']['get']>(
    `/api/cities/${query.value.slug}`,
    undefined,
    queryOptions,
    getCitiesBySlugSchema,
  )
};
