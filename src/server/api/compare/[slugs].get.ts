import { getCompareSchema } from '~/shared/global.schema'

const CITY_SELECT = {
  slug: true,
  name: true,
  country: true,
  region: true,
  costForNomadInUsd: true,
  costForExpatInUsd: true,
  costForLocalInUsd: true,
  costForFamilyInUsd: true,
  pollution: true,
  safety: true,
  climate: true,
  healthCare: true,
  population: true,
  internetSpeedCity: true,
  internetSpeedCityRanking: true,
  internetSpeedCountry: true,
  internetSpeedCountryRanking: true,
  airQualityNow: true,
  airQualityScore: true,
  airQualityNowScore: true,
  humidity: true,
  image: {
    select: {
      url: true,
      ownerName: true,
      ownerUsername: true,
    },
  },
  monthSummary: {
    select: {
      month: true,
      weatherIcon: true,
      apparentTemperatureMax: true,
      rainSum: true,
      sunshineDuration: true,
      totalScore: true,
    },
    orderBy: { month: 'asc' as const },
  },
} as const

export default defineEventHandler(async (event) => {
  const { slugs } = await getValidatedRouterParams(event, getCompareSchema.parse)

  // Enforce canonical alphabetical ordering
  if (slugs.city1 > slugs.city2) {
    const canonical = `/api/compare/${slugs.city2}-vs-${slugs.city1}`
    await sendRedirect(event, canonical, 301)
    return
  }

  const [cityA, cityB] = await Promise.all([
    prisma.city.findFirstOrThrow({
      where: { slug: slugs.city1 },
      select: CITY_SELECT,
    }),
    prisma.city.findFirstOrThrow({
      where: { slug: slugs.city2 },
      select: CITY_SELECT,
    }),
  ])

  return { cityA, cityB }
})
