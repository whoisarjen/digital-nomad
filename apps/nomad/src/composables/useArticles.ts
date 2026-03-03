import type { InternalApi } from 'nitropack';
import { type GetArticlesSchema, getArticlesSchema } from '~/shared/global.schema';

export const useArticles = (
  query: globalThis.Ref<Partial<GetArticlesSchema>>,
  queryOptions?: QueryOptions<InternalApi['/api/blog']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/blog']['get']>(
    '/api/blog',
    query,
    queryOptions,
    getArticlesSchema,
  );
};
