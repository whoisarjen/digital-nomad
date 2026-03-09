import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().default(''),
})

export default defineEventHandler(async (event) => {
  const { q } = await getValidatedQuery(event, searchSchema.parse)

  if (!q.trim()) return []

  const cities = await prisma.city.findMany({
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
    take: 6,
  })

  return cities.map(({ country, ...city }) => ({
    ...city,
    country: country.name,
  }))
})
