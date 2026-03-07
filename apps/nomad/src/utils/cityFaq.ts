type Level = 'HIGH' | 'MIDDLE' | 'LOW'

type MonthSummary = {
  month: string
  totalScore: number
  apparentTemperatureMax: number | string
  rainSum: number | string
}

type CityFaqData = {
  name: string
  costForNomadInUsd: number | string | null
  internetSpeedCity: number | null
  internetSpeedCityRanking: number | null
  safety: Level | null
  monthSummary: MonthSummary[]
  airQualityScore: number | null
  airQualityNow: number | null
}

type FaqQuestion = {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

type TranslateFn = (key: string, params?: Record<string, unknown>) => string

function makeQuestion(name: string, text: string): FaqQuestion {
  return {
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  }
}

export function buildCityFaqItems(
  data: CityFaqData,
  t: TranslateFn,
  locale: string,
): FaqQuestion[] {
  const items: FaqQuestion[] = []

  if (data.costForNomadInUsd != null) {
    items.push(makeQuestion(
      t('city.faq.affordableQuestion', { city: data.name }),
      t('city.faq.affordableAnswer', { city: data.name, cost: data.costForNomadInUsd }),
    ))
  }

  if (data.internetSpeedCity != null) {
    items.push(makeQuestion(
      t('city.faq.internetQuestion', { city: data.name }),
      t('city.faq.internetAnswer', { city: data.name, speed: data.internetSpeedCity, rank: data.internetSpeedCityRanking ?? '?' }),
    ))
  }

  if (data.safety != null) {
    items.push(makeQuestion(
      t('city.faq.safetyQuestion', { city: data.name }),
      t('city.faq.safetyAnswer', { city: data.name, safety: data.safety.toLowerCase() }),
    ))
  }

  if (data.monthSummary.length > 0) {
    const best = [...data.monthSummary].sort((a, b) => b.totalScore - a.totalScore)[0]!
    const monthName = new Date(2023, Number(best.month) - 1).toLocaleString(locale, { month: 'long' })
    items.push(makeQuestion(
      t('city.faq.weatherQuestion', { city: data.name }),
      t('city.faq.weatherAnswer', { city: data.name, month: monthName, temp: Math.round(Number(best.apparentTemperatureMax)), rain: Math.round(Number(best.rainSum)) }),
    ))
  }

  if (data.airQualityScore != null) {
    items.push(makeQuestion(
      t('city.faq.airQualityQuestion', { city: data.name }),
      t('city.faq.airQualityAnswer', { city: data.name, score: data.airQualityScore, aqiNow: data.airQualityNow ?? 'N/A' }),
    ))
  }

  return items
}
