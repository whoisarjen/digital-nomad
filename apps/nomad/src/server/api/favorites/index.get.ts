import { getFavoritesSchema } from '~/shared/global.schema'
import { getUserCurrentMonthString } from '~/shared/global.utils'

export default defineProtectedEventHandler(async (event, session) => {
  const { page, limit } = await getValidatedQuery(event, getFavoritesSchema.parse)
  const currentMonth = getUserCurrentMonthString()
  const userId = session.user.id

  const [favorites, count] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        citySlug: true,
        createdAt: true,
        city: {
          select: {
            slug: true,
            name: true,
            country: { select: { name: true, region: true } },
            costForNomadInUsd: true,
            internetSpeedCity: true,
            safety: true,
            image: { select: { url: true, ownerName: true, ownerUsername: true } },
            monthSummary: {
              where: { month: currentMonth },
              select: {
                weatherIcon: true,
                temperature2mMax: true,
                totalScore: true,
              },
              take: 1,
            },
          },
        },
      },
    }),
    prisma.favorite.count({ where: { userId } }),
  ])

  return {
    data: favorites.map(f => {
      const ms = f.city.monthSummary[0]
      return {
        slug: f.city.slug,
        name: f.city.name,
        country: f.city.country.name,
        region: f.city.country.region,
        costForNomadInUsd: f.city.costForNomadInUsd,
        internetSpeedCity: f.city.internetSpeedCity,
        safety: f.city.safety,
        image: f.city.image,
        weatherIcon: ms?.weatherIcon ?? null,
        temperature: ms?.temperature2mMax ?? null,
        totalScore: ms?.totalScore ?? null,
        savedAt: f.createdAt,
      }
    }),
    count,
    pagesCount: Math.ceil(count / limit),
  }
})
