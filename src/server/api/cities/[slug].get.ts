import { getCitiesBySlugSchema } from "~/shared/global.schema"

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, getCitiesBySlugSchema.parse)

  return await prisma.city.findFirstOrThrow({
    where: { slug },
    select: {
      name: true,
      country: true,
      costForNomadInUsd: true,
      pollution: true,
      safety: true,
      population: true,
      internetSpeedCity: true,
      internetSpeedCityRanking: true,
      internetSpeedCountry: true,
      internetSpeedCountryRanking: true,
      airQualityNow: true,
      airQualityScore: true,
      airQualityNowScore: true,
      humidity: true,
      image: {
        select: {
          url: true,
          ownerName: true,
          ownerUsername: true,
        }
      },
      monthSummary: {
        select: {
          month: true,
          weatherIcon: true,
          apparentTemperatureMax: true,
          rainSum: true,
          sunshineDuration: true,
          totalScore: true,
        },
        orderBy: {
          month: 'asc',
        },
      }
    }
  })
})
