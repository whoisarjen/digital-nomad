import { REGION_SLUG_MAP, REGION_SLUGS, getUserCurrentMonthString } from '~/shared/global.utils'

export default defineEventHandler(async () => {
  const currentMonth = getUserCurrentMonthString()

  const regions = await Promise.all(
    REGION_SLUGS.map(async (slug) => {
      const regionEnum = REGION_SLUG_MAP[slug]

      const [topEntry, cityCount] = await Promise.all([
        prisma.monthSummary.findFirst({
          where: {
            month: currentMonth,
            city: { region: regionEnum },
          },
          orderBy: [{ totalScore: 'desc' }, { popularity: 'desc' }],
          select: {
            city: {
              select: {
                image: {
                  select: {
                    url: true,
                    ownerName: true,
                    ownerUsername: true,
                  },
                },
              },
            },
          },
        }),
        prisma.city.count({ where: { region: regionEnum } }),
      ])

      return {
        slug,
        region: regionEnum,
        cityCount,
        imageUrl: topEntry?.city.image?.url ?? null,
        imageOwnerName: topEntry?.city.image?.ownerName ?? null,
        imageOwnerUsername: topEntry?.city.image?.ownerUsername ?? null,
      }
    }),
  )

  return regions
})
