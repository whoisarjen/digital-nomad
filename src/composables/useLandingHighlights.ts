export const useLandingHighlights = (queryOptions?: any) => {
  return useCustomQuery('/api/landing/highlights', undefined, queryOptions, undefined)
}
