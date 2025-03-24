import { getCitiesBySlugSchema } from "~/shared/global.schema"

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, getCitiesBySlugSchema.parse)

  return await prisma.city.findFirstOrThrow({
    where: { slug },
    select: {
      name: true,
      country: true,
      // weatherIcon: true,
      // temperature: true,
      costForNomadInUsd: true,
      internetSpeed: true,
      pollution: true,
      safety: true,
      population: true,
      image: {
        select: {
          url: true,
          ownerName: true,
          ownerUsername: true,
        }
      },
    }
  })
})
