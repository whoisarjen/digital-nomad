import type { InternalApi } from 'nitropack'

export const useQuizCities = (
  month: Ref<string> | undefined,
  queryOptions?: QueryOptions<InternalApi['/api/quiz/cities']['get']>,
) => {
  const params = computed<object>(() => (month?.value ? { month: month.value } : {}))
  return useCustomQuery<InternalApi['/api/quiz/cities']['get']>(
    '/api/quiz/cities',
    params,
    queryOptions,
    undefined,
  )
}
