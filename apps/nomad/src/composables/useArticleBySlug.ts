import type { InternalApi } from 'nitropack';

export const useArticleBySlug = (
  query: globalThis.Ref<{ slug: string }>,
  queryOptions?: QueryOptions<InternalApi['/api/blog/:slug']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/blog/:slug']['get']>(
    `/api/blog/${query.value.slug}`,
    undefined,
    queryOptions,
    undefined,
  );
};
