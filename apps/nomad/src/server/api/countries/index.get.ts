export default defineEventHandler(async () => {
  const [stats, countries] = await Promise.all([
    prisma.city.groupBy({
      by: ['countrySlug'],
      _count: true,
      _avg: {
        costForNomadInUsd: true,
        internetSpeedCity: true,
      },
      orderBy: { _count: { slug: 'desc' } },
    }),
    prisma.country.findMany({
      select: { slug: true, name: true, code: true },
    }),
  ])

  const countryMap = new Map(countries.map((c) => [c.slug, c]))

  return stats.map((c) => ({
    countrySlug: c.countrySlug,
    country: countryMap.get(c.countrySlug)?.name ?? '',
    countryCode: countryMap.get(c.countrySlug)?.code ?? '',
    cityCount: c._count,
    avgCost: c._avg.costForNomadInUsd ? Number(c._avg.costForNomadInUsd) : null,
    avgInternet: c._avg.internetSpeedCity ? Math.round(c._avg.internetSpeedCity) : null,
  }))
})
