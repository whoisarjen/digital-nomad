export const useFeatures = (queryOptions?: any) => {
  return useCustomQuery('/api/features', undefined, queryOptions, undefined)
}
