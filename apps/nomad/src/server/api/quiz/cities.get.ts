export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const month = typeof query.month === 'string' && /^\d{2}$/.test(query.month) ? query.month : null

  const cities = await prisma.city.findMany({
    select: {
      slug: true,
      name: true,
      costForNomadInUsd: true,
      temperatureC: true,
      internetSpeedCity: true,
      safety: true,
      country: {
        select: {
          name: true,
          region: true,
        },
      },
      image: {
        select: {
          url: true,
          ownerName: true,
          ownerUsername: true,
        },
      },
      monthSummary: {
        select: { temperature2mMax: true },
        ...(month ? { where: { month }, take: 1 } : { take: 0 }),
      },
    },
  })

  return cities.map(({ country, monthSummary, ...city }) => ({
    ...city,
    costForNomadInUsd: city.costForNomadInUsd ? Number(city.costForNomadInUsd) : null,
    temperatureC: city.temperatureC ? Number(city.temperatureC) : null,
    monthTemperatureC: monthSummary[0]?.temperature2mMax != null
      ? Number(monthSummary[0].temperature2mMax)
      : null,
    country: country.name,
    region: country.region,
  }))
})
