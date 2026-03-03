export default defineEventHandler(async () => {
  const countries = await prisma.city.groupBy({
    by: ['countrySlug', 'country', 'countryCode'],
    _count: { id: true },
    _avg: {
      costForNomadInUsd: true,
      internetSpeedCity: true,
    },
    orderBy: { _count: { id: 'desc' } },
  })

  return countries.map((c) => ({
    countrySlug: c.countrySlug,
    country: c.country,
    countryCode: c.countryCode,
    cityCount: c._count.id,
    avgCost: c._avg.costForNomadInUsd ? Number(c._avg.costForNomadInUsd) : null,
    avgInternet: c._avg.internetSpeedCity ? Math.round(c._avg.internetSpeedCity) : null,
  }))
})
