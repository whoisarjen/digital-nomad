import type { InternalApi } from 'nitropack';
import { type GetCitiesSchema, getCitiesSchema } from '~/shared/global.schema';

export const useCities = (
  query: globalThis.Ref<Partial<GetCitiesSchema>>,
  queryOptions?: QueryOptions<InternalApi['/api/cities']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/cities']['get']>(
    '/api/cities',
    query,
    queryOptions,
    getCitiesSchema,
  )
};
