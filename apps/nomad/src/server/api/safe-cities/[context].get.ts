import { SAFE_CITIES_SLUG_MAP, getUserCurrentMonthString } from '~/shared/global.utils'
import { getSafeCitiesSchema } from '~/shared/global.schema'

export default defineEventHandler(async (event) => {
  const { context } = await getValidatedRouterParams(event, (params) => getSafeCitiesSchema.parse(params))

  const regionEnum = SAFE_CITIES_SLUG_MAP[context as keyof typeof SAFE_CITIES_SLUG_MAP]
  const currentMonth = getUserCurrentMonthString()

  const monthSummaries = await prisma.monthSummary.findMany({
    where: {
      month: currentMonth,
      safety: 'HIGH',
      ...(regionEnum ? { city: { country: { region: regionEnum } } } : {}),
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
          country: { select: { name: true } },
          costForNomadInUsd: true,
          internetSpeedCity: true,
          safety: true,
          population: true,
          image: {
            select: { url: true, ownerName: true, ownerUsername: true },
          },
        },
      },
    },
  })

  const cities = monthSummaries.map((ms) => {
    const { country: countryData, ...cityFields } = ms.city
    return {
      ...cityFields,
      country: countryData.name,
      weatherIcon: ms.weatherIcon,
      temperature: ms.temperature2mMax,
      totalScore: ms.totalScore,
    }
  })

  const costs = cities.map((c) => Number(c.costForNomadInUsd ?? 0)).filter(Boolean)
  const speeds = cities.map((c) => c.internetSpeedCity ?? 0).filter(Boolean)

  return {
    context,
    region: regionEnum ?? null,
    cities,
    stats: {
      cityCount: cities.length,
      costMin: costs.length ? Math.min(...costs) : null,
      costMax: costs.length ? Math.max(...costs) : null,
      avgSpeed: speeds.length ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length) : null,
    },
  }
})
