import { City, MonthSummary } from "@prisma/client"
import _ from "lodash"

class TotalScoreFactory {
  private city = null as City | null
  private monthSummary = null as MonthSummary | null

  constructor(city: City, monthSummary: MonthSummary) {
    this.city = city
    this.monthSummary = monthSummary
  }

  getCity() {
    if (!this.city) {
      throw new Error('Missing city in TotalScoreFactory')
    }
    return this.city
  }

  getMonthSummary() {
    if (!this.monthSummary) {
      throw new Error('Missing monthSummary in TotalScoreFactory')
    }
    return this.monthSummary
  }

  getPopularityScore() {
    const { popularity } = this.getMonthSummary()
    if (!popularity) return null // Catch also 0

    const logValue = Math.log10(popularity)

    if (logValue < 1) {
      return 1;
    }

    if (logValue < 2) {
      return 2;
    }

    if (logValue < 3) {
      return 3;
    }

    if (logValue < 4) {
      return 5;
    }

    return 8;
  }

  getRegionScore() {
    const { region } = this.getCity()

    if (region === 'Asia' || region === 'Europe') {
      return 2.5
    }

    if (region === 'LatinAmerica' || region === 'NorthAmerica') {
      return 1.5
    }

    if (region === 'MiddleEast') {
      return 1
    }

    if (region === 'Africa') {
      return 0.5
    }

    return 0
  }

  getWeatherIconScore() {
    const { weatherIcon } = this.getMonthSummary()

    if (weatherIcon === 'SUN') {
      return 1
    }

    return 0
  }

  getTemperatureScore() {
    const { temperature2mMax } = this.getMonthSummary()
    if (temperature2mMax === null) return null
    if (temperature2mMax.toNumber() < 10 || 40 < temperature2mMax.toNumber()) {
      return 1
    }

    if (temperature2mMax.toNumber() < 15 || 35 < temperature2mMax.toNumber()) {
      return 2
    }

    if (temperature2mMax.toNumber() < 20 || 30 < temperature2mMax.toNumber()) {
      return 3
    }

    return 5
  }

  getPollutionScore() {
    const { pollution } = this.getCity()
    if (pollution === null) return null
    if (pollution === 'LOW') {
      return 1
    } else if (pollution === 'MIDDLE') {
      return 0.5
    } else {
      return 0
    }
  }

  getCostOfLivingScore() {
    const { costOfLiving } = this.getCity()
    if (costOfLiving === null) return null
    if (costOfLiving === 'LOW') {
      return 2
    } else if (costOfLiving === 'MIDDLE') {
      return 1
    } else {
      return 0
    }
  }

  getHeathCareScore() {
    const { healthCare } = this.getCity()
    if (healthCare === null) return null
    if (healthCare === 'LOW') {
      return 0
    } else if (healthCare === 'MIDDLE') {
      return 0.5
    } else {
      return 1
    }
  }

  getSafetyScore() {
    const { safety } = this.getCity()
    if (safety === null) return null
    if (safety === 'LOW') {
      return 0
    } else if (safety === 'MIDDLE') {
      return 0.5
    } else {
      return 1
    }
  }

  getPurchasingPowerScore() {
    const { purchasingPower } = this.getCity()
    if (purchasingPower === null) return null
    if (purchasingPower === 'LOW') {
      return 1
    } else if (purchasingPower === 'MIDDLE') {
      return 2
    } else {
      return 3
    }
  }

  getWeatherScore() {
    return [
      this.getWeatherIconScore(),
      this.getTemperatureScore(),
    ].filter(score => score !== null).reduce((prev, curr) => prev += curr, 0)
  }

  getCityScore() {
    return [
      this.getPopularityScore(),
      this.getRegionScore(),
      this.getPollutionScore(),
      this.getCostOfLivingScore(),
      this.getHeathCareScore(),
      this.getSafetyScore(),
      this.getPurchasingPowerScore(),
    ].filter(score => score !== null).reduce((prev, curr) => prev += curr, 0)
  }

  getTotalScore() {
    const weatherScore = this.getWeatherScore()
    const cityScore = this.getCityScore()

    return parseInt(((weatherScore + cityScore) * 10).toString())
  }
}

export default defineEventHandler(async () => {
  const cities = await prisma.city.findMany({ select: { slug: true }})

  await processInBatches(cities, async ({ slug }) => {
    const city = await prisma.city.findFirstOrThrow({
      where: {
        slug,
      },
      include: {
        monthSummary: true,
      }
    })

    await processInBatches(city.monthSummary, async monthSummary => {
      await prisma.monthSummary.update({
        where: { id: monthSummary.id },
        data: {
          totalScore: new TotalScoreFactory(city, monthSummary).getTotalScore(),
        }
      })
    }, city.monthSummary.length, false)
  }, 50)

  return 'Done'
})
