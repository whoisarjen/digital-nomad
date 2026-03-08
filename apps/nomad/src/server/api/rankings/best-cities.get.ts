import { MONTH_SLUG_MAP } from '~/shared/months.constant'

const ALL_MONTHS = Object.values(MONTH_SLUG_MAP)

export default defineEventHandler(async () => {
  const summaries = await prisma.monthSummary.findMany({
    where: { month: { in: ALL_MONTHS } },
    orderBy: [{ month: 'asc' }, { totalScore: 'desc' }],
    distinct: ['month'],
    select: {
      month: true,
      totalScore: true,
      city: {
        select: {
          slug: true,
          name: true,
          country: { select: { name: true } },
          image: {
            select: {
              url: true,
              width: true,
              height: true,
              blurHash: true,
              ownerName: true,
              ownerUsername: true,
            },
          },
        },
      },
    },
  })

  return summaries.map((s) => ({
    month: s.month,
    topCity: {
      slug: s.city.slug,
      name: s.city.name,
      country: s.city.country.name,
      totalScore: s.totalScore,
      image: s.city.image,
    },
  }))
})
