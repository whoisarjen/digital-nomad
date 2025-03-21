import { Level } from "@prisma/client"
import { INDEX_MAP } from "~/shared/global.utils"

const getLevelForGTE = (key: keyof typeof INDEX_MAP, value: number | undefined) => {
  if (value === undefined) {
    return undefined
  }

  if (INDEX_MAP[key].medium_until < value) {
    return Level.HIGH
  }

  if (INDEX_MAP[key].low_until < value) {
    return Level.MIDDLE
  }

  return Level.LOW
}

export default defineEventHandler(async () => {
  const cities = await prisma.city.findMany()

  await processInBatches(cities, async city => {
    await prisma.city.update({
      where: {
        slug: city.slug,
      },
      data: {
        safety: getLevelForGTE('safetyIndex', city.safetyIndex?.toNumber()),
        climate: getLevelForGTE('climateIndex', city.climateIndex?.toNumber()),
        pollution: getLevelForGTE('pollutionIndex', city.pollutionIndex?.toNumber()),
        purchasingPower: getLevelForGTE('purchasingPowerIndex', city.pollutionIndex?.toNumber()),
        healthCare: getLevelForGTE('healthCareIndex', city.pollutionIndex?.toNumber()),
        costOfLiving: getLevelForGTE('costOfLivingIndex', city.pollutionIndex?.toNumber()),
        propertyPriceToIncome: getLevelForGTE('propertyPriceToIncomeRatio', city.pollutionIndex?.toNumber()),
        trafficCommuteTime: getLevelForGTE('trafficCommuteTimeIndex', city.pollutionIndex?.toNumber()),
      }
    })
  })

  return 'Hello Nitro'
})
