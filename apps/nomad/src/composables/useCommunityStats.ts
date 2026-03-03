export const useCommunityStats = (queryOptions?: any) => {
  return useCustomQuery('/api/community/stats', undefined, queryOptions, undefined)
}
