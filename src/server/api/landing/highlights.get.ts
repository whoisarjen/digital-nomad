import { getUserCurrentMonthString } from '~/shared/global.utils'

export default defineEventHandler(async () => {
  const currentMonth = getUserCurrentMonthString()

  const [topCities, cityCount, peakCount, memberCount] = await Promise.all([
    prisma.monthSummary.findMany({
      where: { month: currentMonth },
      orderBy: { totalScore: 'desc' },
      take: 5,
      select: {
        totalScore: true,
        temperature2mMean: true,
        costForNomadInUsd: true,
        weatherIcon: true,
        city: {
          select: {
            name: true,
            country: true,
            slug: true,
            internetSpeedCity: true,
            safety: true,
            image: { select: { url: true } },
          },
        },
      },
    }),
    prisma.city.count(),
    prisma.monthSummary.count({
      where: { month: currentMonth, totalScore: { gte: 70 } },
    }),
    prisma.user.count(),
  ])

  return {
    topCities: topCities.map((ms) => ({
      name: ms.city.name,
      country: ms.city.country,
      slug: ms.city.slug,
      totalScore: ms.totalScore,
      temperature: Number(ms.temperature2mMean),
      cost: ms.costForNomadInUsd ? Number(ms.costForNomadInUsd) : null,
      weatherIcon: ms.weatherIcon,
      internetSpeed: ms.city.internetSpeedCity,
      safety: ms.city.safety,
      imageUrl: ms.city.image?.url || null,
    })),
    cityCount,
    peakCount,
    memberCount,
    currentMonth,
  }
})
