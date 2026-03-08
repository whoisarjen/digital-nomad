import { getCitiesBySlugSchema } from "~/shared/global.schema"

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, getCitiesBySlugSchema.parse)

  const city = await prisma.city.findFirstOrThrow({
    where: { slug },
    select: {
      name: true,
      countrySlug: true,
      country: {
        select: {
          name: true,
          region: true,
          internetSpeed: true,
          internetSpeedRanking: true,
          englishProficiency: true,
          plugTypes: true,
          voltage: true,
          frequency: true,
        },
      },
      costForNomadInUsd: true,
      costForExpatInUsd: true,
      costForLocalInUsd: true,
      costForFamilyInUsd: true,
      pollution: true,
      safety: true,
      climate: true,
      healthCare: true,
      population: true,
      internetSpeedCity: true,
      internetSpeedCityRanking: true,
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

  const { country: countryData, ...cityFields } = city

  const ep = countryData.englishProficiency
  const englishProficiency = ep === 0 ? null : ep >= 550 ? 'HIGH' : ep >= 450 ? 'MIDDLE' : 'LOW'

  return {
    ...cityFields,
    country: countryData.name,
    region: countryData.region,
    internetSpeedCountry: countryData.internetSpeed,
    internetSpeedCountryRanking: countryData.internetSpeedRanking,
    englishProficiency,
    plugTypes: countryData.plugTypes ?? null,
    voltage: countryData.voltage ?? null,
    frequency: countryData.frequency ?? null,
  }
})
