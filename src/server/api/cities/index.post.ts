// import { cities } from '../../../../data.json'
import { Prisma } from '@prisma/client'

export default defineEventHandler(async () => {
  await processInBatches([] as any[], async option => {
    const data = {
      slug: option.slug,
      name: option.name,
      country: option.country,
      image: option.image,
      longitude: option.longitude,
      latitude: option.latitude,
      population: Number(option.population ?? 0),
      temperatureC: Number(option.temperatureC ?? 0),
      costForNomadInUsd: option.cost_for_nomad_in_usd,
      costForExpatInUsd: option.cost_for_expat_in_usd,
      costForLocalInUsd: option.cost_for_local_in_usd,
      costForFamilyInUsd: option.cost_for_family_in_usd,
      region: option.region,
      nameChinese: option.name_chinese ?? '',
      countryChinese: option.country_chinese,
      airQualityNow: option.air_quality_now,
      airQuality: option.air_quality,
      countryCode: option.country_code,
      countrySlug: option.country_slug,
      stateCode: option.state_code,
      stateChinese: option.state_chinese,
      state: option.state,
      internetSpeed: option.internet_speed,
      internetSpeedDigitalNomad: option.internet_speed,
      internetSpeedCity: 0,
      internetSpeedCityRanking: 0,
      internetSpeedCountry: 0,
      internetSpeedCountryRanking: 0,
      airQualityScore: option.air_quality_score,
      airQualityNowScore: option.air_quality_now_score,
      humidity: option.humidity,
      rank: option.rank,
      totalScore: option.total_score,
      overallScore: option.overall_score,
      costScore: option.cost_score,
      likesScore: option.likes_score ?? 0,
      safetyLevel: option.safety_level,
    } satisfies Prisma.CityCreateInput

    await prisma.city.upsert({
      where: {
        slug: option.slug,
      },
      create: data,
      update: data,
    })
  })

  return
})
