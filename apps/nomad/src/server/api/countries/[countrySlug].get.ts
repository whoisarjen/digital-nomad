import { z } from 'zod'
import { getUserCurrentMonthString } from '~/shared/global.utils'

const schema = z.object({ countrySlug: z.string().min(1).max(100) })

export default defineEventHandler(async (event) => {
  const { countrySlug } = await getValidatedRouterParams(event, (params) => schema.parse(params))
  const currentMonth = getUserCurrentMonthString()

  const monthSummaries = await prisma.monthSummary.findMany({
    where: {
      month: currentMonth,
      city: { countrySlug },
    },
    orderBy: [
      { totalScore: 'desc' },
      { popularity: 'desc' },
    ],
    take: 20,
    select: {
      totalScore: true,
      weatherIcon: true,
      temperature2mMax: true,
      city: {
        select: {
          slug: true,
          name: true,
          country: true,
          countryCode: true,
          countrySlug: true,
          costForNomadInUsd: true,
          internetSpeedCity: true,
          safety: true,
          image: {
            select: { url: true, ownerName: true, ownerUsername: true },
          },
        },
      },
    },
  })

  if (monthSummaries.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Country not found' })
  }

  const cities = monthSummaries.map((ms) => ({
    ...ms.city,
    costForNomadInUsd: ms.city.costForNomadInUsd ? Number(ms.city.costForNomadInUsd) : null,
    weatherIcon: ms.weatherIcon,
    temperature: ms.temperature2mMax,
    totalScore: ms.totalScore,
  }))

  const costs = cities.map((c) => c.costForNomadInUsd ?? 0).filter(Boolean)
  const speeds = cities.map((c) => c.internetSpeedCity ?? 0).filter(Boolean)

  const firstCity = monthSummaries[0]!.city

  return {
    country: firstCity.country,
    countryCode: firstCity.countryCode,
    countrySlug: firstCity.countrySlug,
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
