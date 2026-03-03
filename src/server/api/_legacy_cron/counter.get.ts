import { Level } from "@prisma/client"

const INDEX_MAP = {
  "purchasingPowerIndex": {
    "low_until": 40,
    "medium_until": 70,
    "ideal_value": "Higher"
  },
  "safetyIndex": {
    "low_until": 40,
    "medium_until": 70,
    "ideal_value": "Higher"
  },
  "healthCareIndex": {
    "low_until": 40,
    "medium_until": 70,
    "ideal_value": "Higher"
  },
  "climateIndex": {
    "low_until": 40,
    "medium_until": 70,
    "ideal_value": "Higher"
  },
  "costOfLivingIndex": {
    "low_until": 40,
    "medium_until": 70,
    "ideal_value": "Lower"
  },
  "propertyPriceToIncomeRatio": {
    "low_until": 5,
    "medium_until": 15,
    "ideal_value": "Lower"
  },
  "trafficCommuteTimeIndex": {
    "low_until": 20,
    "medium_until": 50,
    "ideal_value": "Lower"
  },
  "pollutionIndex": {
    "low_until": 30,
    "medium_until": 60,
    "ideal_value": "Lower"
  }
} as const

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
  const cities = await prisma.qualityIndex.findMany()

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
