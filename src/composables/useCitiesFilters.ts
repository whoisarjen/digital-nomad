import type { InternalApi } from 'nitropack';

export const useCitiesFilters = (
  queryOptions?: QueryOptions<InternalApi['/api/cities/filters']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/cities/filters']['get']>(
    '/api/cities/filters',
    undefined,
    queryOptions,
    undefined,
  )
};
