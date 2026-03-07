import { z } from 'zod'
import { buildCompareSlug } from '~/shared/global.utils'

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, z.object({ slug: z.string() }).parse)

  const city = await prisma.city.findFirstOrThrow({
    where: { slug },
    select: {
      slug: true,
      name: true,
      region: true,
      costForNomadInUsd: true,
    },
  })

  const relatedCities = await prisma.city.findMany({
    where: {
      region: city.region,
      slug: { not: slug },
    },
    select: {
      slug: true,
      name: true,
      country: true,
      costForNomadInUsd: true,
    },
    orderBy: { costForNomadInUsd: 'asc' },
    take: 20,
  })

  const cityCost = Number(city.costForNomadInUsd ?? 0)

  const sorted = relatedCities
    .map((c) => ({
      ...c,
      diff: Math.abs(Number(c.costForNomadInUsd ?? 0) - cityCost),
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 6)

  return sorted.map((related) => {
    const compareSlug = buildCompareSlug(slug, related.slug)
    const [firstSlug] = compareSlug.split('-vs-')
    const cityAName = firstSlug === slug ? city.name : related.name
    const cityBName = firstSlug === slug ? related.name : city.name

    return {
      slugs: compareSlug,
      cityAName,
      cityBName,
    }
  })
})
