export default defineEventHandler(async () => {
  const cities = await prisma.city.findMany({
    select: {
      slug: true,
      name: true,
      country: { select: { name: true } },
      costForNomadInUsd: true,
      costForExpatInUsd: true,
      costForLocalInUsd: true,
      costForFamilyInUsd: true,
      image: { select: { url: true } },
    },
  })

  return cities.map((city) => ({
    slug: city.slug,
    name: city.name,
    country: city.country.name,
    costForNomadInUsd: Number(city.costForNomadInUsd ?? 0),
    costForExpatInUsd: Number(city.costForExpatInUsd ?? 0),
    costForLocalInUsd: Number(city.costForLocalInUsd ?? 0),
    costForFamilyInUsd: Number(city.costForFamilyInUsd ?? 0),
    imageUrl: city.image?.url ?? null,
  }))
})
