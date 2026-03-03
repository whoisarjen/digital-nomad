import { getRegionSchema } from '~/shared/global.schema'
import { REGION_SLUG_MAP, getUserCurrentMonthString } from '~/shared/global.utils'

export default defineEventHandler(async (event) => {
  const { region: regionSlug } = await getValidatedRouterParams(event, (params) => getRegionSchema.parse(params))

  if (!(regionSlug in REGION_SLUG_MAP)) {
    throw createError({ statusCode: 404, statusMessage: 'Region not found' })
  }

  const regionEnum = REGION_SLUG_MAP[regionSlug as keyof typeof REGION_SLUG_MAP]
  const currentMonth = getUserCurrentMonthString()

  const monthSummaries = await prisma.monthSummary.findMany({
    where: {
      month: currentMonth,
      city: { region: regionEnum },
    },
    orderBy: [
      { totalScore: 'desc' },
      { popularity: 'desc' },
    ],
    select: {
      totalScore: true,
      weatherIcon: true,
      temperature2mMax: true,
      city: {
        select: {
          slug: true,
          name: true,
          country: true,
          costForNomadInUsd: true,
          internetSpeedCity: true,
          safety: true,
          population: true,
          image: {
            select: { url: true },
          },
        },
      },
    },
  })

  const cities = monthSummaries.map((ms) => ({
    ...ms.city,
    weatherIcon: ms.weatherIcon,
    temperature: ms.temperature2mMax,
    totalScore: ms.totalScore,
  }))

  const costs = cities.map((c) => Number(c.costForNomadInUsd ?? 0)).filter(Boolean)
  const speeds = cities.map((c) => c.internetSpeedCity ?? 0).filter(Boolean)

  return {
    region: regionEnum,
    cities,
    stats: {
      cityCount: cities.length,
      costMin: costs.length ? Math.min(...costs) : null,
      costMax: costs.length ? Math.max(...costs) : null,
      avgSpeed: speeds.length ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length) : null,
      safetyHighCount: cities.filter((c) => c.safety === 'HIGH').length,
    },
  }
})
