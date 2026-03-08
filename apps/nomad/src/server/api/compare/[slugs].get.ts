import { getCompareSchema } from '~/shared/global.schema'
import { buildCompareSlug } from '~/shared/global.utils'

const CITY_SELECT = {
  slug: true,
  name: true,
  country: {
    select: {
      name: true,
      region: true,
      internetSpeed: true,
      internetSpeedRanking: true,
    },
  },
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
  const canonical = buildCompareSlug(slugs.city1, slugs.city2)
  if (canonical !== slugs.raw) {
    await sendRedirect(event, `/api/compare/${canonical}`, 301)
    return
  }

  const [rawA, rawB] = await Promise.all([
    prisma.city.findFirstOrThrow({
      where: { slug: slugs.city1 },
      select: CITY_SELECT,
    }),
    prisma.city.findFirstOrThrow({
      where: { slug: slugs.city2 },
      select: CITY_SELECT,
    }),
  ])

  const { country: countryA, ...fieldsA } = rawA
  const { country: countryB, ...fieldsB } = rawB

  return {
    cityA: {
      ...fieldsA,
      country: countryA.name,
      region: countryA.region,
      internetSpeedCountry: countryA.internetSpeed,
      internetSpeedCountryRanking: countryA.internetSpeedRanking,
    },
    cityB: {
      ...fieldsB,
      country: countryB.name,
      region: countryB.region,
      internetSpeedCountry: countryB.internetSpeed,
      internetSpeedCountryRanking: countryB.internetSpeedRanking,
    },
  }
})
