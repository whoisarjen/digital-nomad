import { getUserCurrentMonthString } from '~/shared/global.utils'

export default defineEventHandler(async () => {
  const currentMonth = getUserCurrentMonthString()

  const topCities = await prisma.monthSummary.findMany({
    where: { month: currentMonth },
    orderBy: { totalScore: 'desc' },
    take: 20,
    select: {
      totalScore: true,
      costForNomadInUsd: true,
      city: {
        select: {
          name: true,
          country: true,
          slug: true,
          region: true,
          internetSpeedCity: true,
          safety: true,
          image: { select: { url: true } },
        },
      },
    },
  })

  const cities = topCities.map((ms) => ({
    name: ms.city.name,
    country: ms.city.country,
    slug: ms.city.slug,
    region: ms.city.region,
    totalScore: ms.totalScore,
    cost: ms.costForNomadInUsd ? Number(ms.costForNomadInUsd) : null,
    internetSpeed: ms.city.internetSpeedCity,
    safety: ms.city.safety,
    imageUrl: ms.city.image?.url || null,
  }))

  // Generate popular pairs from top cities (pair neighbors in ranking)
  const pairs: { slugs: string; cityA: string; cityB: string; countryA: string; countryB: string }[] = []
  const pairSet = new Set<string>()

  for (let i = 0; i < Math.min(cities.length, 12); i++) {
    for (let j = i + 1; j < Math.min(cities.length, 12); j++) {
      if (pairs.length >= 12) break

      const a = cities[i]
      const b = cities[j]

      // Prefer cross-region pairs for more interesting comparisons
      if (a.region === b.region && pairs.length > 4) continue

      const [first, second] = a.slug < b.slug ? [a, b] : [b, a]
      const key = `${first.slug}-vs-${second.slug}`

      if (!pairSet.has(key)) {
        pairSet.add(key)
        pairs.push({
          slugs: key,
          cityA: first.name,
          cityB: second.name,
          countryA: first.country,
          countryB: second.country,
        })
      }
    }
    if (pairs.length >= 12) break
  }

  return { cities, popularPairs: pairs }
})
