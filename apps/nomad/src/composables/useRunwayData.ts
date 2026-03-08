export type RunwayCity = {
  slug: string
  name: string
  country: string
  costForNomadInUsd: number
  costForExpatInUsd: number
  costForLocalInUsd: number
  costForFamilyInUsd: number
  imageUrl: string | null
}

export const useRunwayData = () => {
  return useCustomQuery<RunwayCity[]>('/api/tools/runway', undefined, undefined, undefined)
}
