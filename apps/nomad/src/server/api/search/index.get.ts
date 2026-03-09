import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().default(''),
})

export default defineEventHandler(async (event) => {
  const language = getLocale(event)
  const select = getLocalizedSelect(language)

  const { q } = await getValidatedQuery(event, searchSchema.parse)

  if (!q.trim()) return { cities: [], articles: [] }

  const [cities, articles] = await Promise.all([
    prisma.city.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { country: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: {
        slug: true,
        name: true,
        costForNomadInUsd: true,
        country: { select: { name: true } },
      },
      take: 5,
    }),
    prisma.article.findMany({
      where: {
        isPublished: true,
        publishedAt: { lte: new Date() },
        [`title${select}` as const]: { contains: q, mode: 'insensitive' },
      },
      select: {
        slug: true,
        [`title${select}` as const]: true,
        readingTimeMinutes: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
  ])

  return {
    cities: cities.map(({ country, ...city }) => ({
      ...city,
      country: country.name,
    })),
    articles: articles.map((a) => ({
      slug: a.slug,
      title: a[`title${select}` as const] ?? null,
      readingTimeMinutes: a.readingTimeMinutes,
    })),
  }
})
