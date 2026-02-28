import type { InternalApi } from 'nitropack';

export const useArticlesByCity = (
  query: globalThis.Ref<{ citySlug: string }>,
  queryOptions?: QueryOptions<InternalApi['/api/blog/by-city/:citySlug']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/blog/by-city/:citySlug']['get']>(
    `/api/blog/by-city/${query.value.citySlug}`,
    undefined,
    queryOptions,
    undefined,
  );
};
