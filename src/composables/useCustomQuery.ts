import type { NitroFetchRequest, TypedInternalResponse } from 'nitropack';
import fromPairs from 'lodash/fromPairs'
import sortBy from 'lodash/sortBy'
import toPairs from 'lodash/toPairs'
import { useQuery, type UseQueryOptions, type UseQueryReturnType } from '@tanstack/vue-query';
import type { z } from 'zod';

export type QueryOptions<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData> = 
  Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'> & {
    lazy?: boolean;
    enabled?: boolean;
    select?: (data: TQueryFnData) => TData;
    placeholderData?: <T>(previousData: T | undefined) => T | undefined
  };

export const useCustomQuery = async <T = unknown>(
  url: NitroFetchRequest,
  queryRaw: globalThis.Ref<object> | undefined,
  queryOptions: QueryOptions<T> | undefined,
  schema: z.Schema<object> | undefined,
) => {
  const query = computed(() => {
    if (!queryRaw?.value) {
      return {}
    }

    if (schema) {
      const response = schema.safeParse(queryRaw.value)

      if (!queryOptions?.enabled) {
        return queryRaw.value
      }

      if (response.error) {
        console.error(response.error)
        return {}
      }

      return response.data
    }

    return queryRaw.value
  })

  const customKey = computed(() => {
    const sortedObj = fromPairs(sortBy(toPairs(query?.value)));
    const uniqueKey = JSON.stringify(sortedObj);

    return `${url}${uniqueKey}`
  })

  const queryKey = computed(() => [url, customKey]) // This is weird, but correct way

  const response = useQuery({
    queryKey: queryKey.value, // Keep url as one of keys so we can easy invalidateQueries
    queryFn: ({ signal }) => {
      return $fetch<T>(url, {
        method: 'get',
        credentials: 'include',
        signal,
        query: query?.value ?? {},
      }) as Promise<T>
    },
    ...queryOptions,
  })

  onServerPrefetch(async () => {
    await response.suspense()
  })

  if (!queryOptions?.lazy) {
    await response.suspense()
  }

  return {
    ...response as unknown as UseQueryReturnType<TypedInternalResponse<NitroFetchRequest, T, "get">, Error>,
    queryKey: queryKey.value,
  }
}
