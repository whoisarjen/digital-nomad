import type { Level } from '@prisma/client'
import { formatNumber } from '~/shared/global.utils'

interface CityData {
  name: string
  country: string
  region: string | null
  slug: string
  costForNomadInUsd: number | null
  costForExpatInUsd: number | null
  costForLocalInUsd: number | null
  costForFamilyInUsd: number | null
  internetSpeedCity: number | null
  internetSpeedCityRanking: number | null
  safety: Level | null
  climate: Level | null
  pollution: Level | null
  healthCare: Level | null
  population: number
  airQualityScore: number | null
  humidity: string | null
  monthSummary: Array<{
    month: string
    weatherIcon: string
    apparentTemperatureMax: any
    rainSum: any
    sunshineDuration: any
    totalScore: number
  }>
}

interface ContentSection {
  key: string
  params: Record<string, string | number>
}

const LEVEL_ORDER: Record<string, number> = { LOW: 0, MIDDLE: 1, HIGH: 2 }

// Deterministic variant selector — always returns same variant for same slug pair
const selectVariant = (slugA: string, slugB: string): 1 | 2 | 3 => {
  const hash = [...(slugA + slugB)].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return ((hash % 3) + 1) as 1 | 2 | 3
}

const getNumericBranch = (a: number, b: number, lowerIsBetter: boolean): string => {
  const pct = Math.round(Math.abs(a - b) / Math.max(a, b) * 100)
  const aIsBetter = lowerIsBetter ? a < b : a > b
  const bIsBetter = lowerIsBetter ? b < a : b > a

  if (pct < 5) return 'tied'
  if (aIsBetter) return pct >= 20 ? 'aWinsBig' : 'aWinsSmall'
  if (bIsBetter) return pct >= 20 ? 'bWinsBig' : 'bWinsSmall'
  return 'tied'
}

const getLevelBranch = (a: Level | null, b: Level | null, inverted = false): string => {
  if (!a || !b || a === b) return 'tied'
  const aVal = LEVEL_ORDER[a] ?? 0
  const bVal = LEVEL_ORDER[b] ?? 0
  const aIsBetter = inverted ? aVal < bVal : aVal > bVal
  return aIsBetter ? 'aWins' : 'bWins'
}

const getBestMonth = (monthSummary: CityData['monthSummary']) => {
  if (!monthSummary.length) return null
  const best = monthSummary.reduce((acc, m) => m.totalScore > acc.totalScore ? m : acc, monthSummary[0])
  return best
}

const getMonthName = (month: string, locale: string): string => {
  return new Date(2023, Number(month) - 1).toLocaleString(getLocaleBcp47(locale), { month: 'long' })
}

export const useComparisonContent = (cityA: CityData, cityB: CityData) => {
  const { locale } = useCustomI18n()
  const v = selectVariant(cityA.slug, cityB.slug)

  const sections: ContentSection[] = []

  // --- INTRO ---
  const sameCountry = cityA.country === cityB.country
  const sameRegion = cityA.region === cityB.region
  sections.push({
    key: sameCountry ? 'compare.intro.sameCountry' : sameRegion ? 'compare.intro.sameRegion' : 'compare.intro.diffRegion',
    params: {
      cityA: cityA.name,
      cityB: cityB.name,
      countryA: cityA.country,
      countryB: cityB.country,
      regionA: cityA.region?.replace(/([A-Z])/g, ' $1').trim() ?? '',
      regionB: cityB.region?.replace(/([A-Z])/g, ' $1').trim() ?? '',
    },
  })

  // --- COST ---
  const costA = Number(cityA.costForNomadInUsd ?? 0)
  const costB = Number(cityB.costForNomadInUsd ?? 0)
  if (costA && costB) {
    const branch = getNumericBranch(costA, costB, true)
    const pct = Math.round(Math.abs(costA - costB) / Math.max(costA, costB) * 100)
    const annualSavings = Math.abs(costA - costB) * 12
    const variantSuffix = branch !== 'tied' ? `_v${v}` : ''

    sections.push({
      key: `compare.cost.${branch}${variantSuffix}`,
      params: {
        cityA: cityA.name,
        cityB: cityB.name,
        costA,
        costB,
        pct,
        annualSavings,
      },
    })

    // Family cost addendum
    const famA = Number(cityA.costForFamilyInUsd ?? 0)
    const famB = Number(cityB.costForFamilyInUsd ?? 0)
    if (famA && famB) {
      sections.push({
        key: 'compare.cost.family',
        params: {
          cityA: cityA.name,
          cityB: cityB.name,
          famCostA: famA,
          famCostB: famB,
        },
      })
    }
  }

  // --- INTERNET ---
  const speedA = cityA.internetSpeedCity ?? 0
  const speedB = cityB.internetSpeedCity ?? 0
  if (speedA && speedB) {
    const branch = getNumericBranch(speedA, speedB, false)
    const variantSuffix = branch !== 'tied' ? `_v${v}` : ''

    sections.push({
      key: `compare.internet.${branch}${variantSuffix}`,
      params: {
        cityA: cityA.name,
        cityB: cityB.name,
        speedA,
        speedB,
        rankA: cityA.internetSpeedCityRanking ?? 0,
        rankB: cityB.internetSpeedCityRanking ?? 0,
      },
    })
  }

  // --- SAFETY ---
  const safetyBranch = getLevelBranch(cityA.safety, cityB.safety)
  sections.push({
    key: `compare.safety.${safetyBranch}`,
    params: {
      cityA: cityA.name,
      cityB: cityB.name,
      safetyA: cityA.safety ?? 'N/A',
      safetyB: cityB.safety ?? 'N/A',
    },
  })

  // --- HEALTHCARE ---
  const healthBranch = getLevelBranch(cityA.healthCare, cityB.healthCare)
  sections.push({
    key: `compare.healthcare.${healthBranch}`,
    params: {
      cityA: cityA.name,
      cityB: cityB.name,
      healthA: cityA.healthCare ?? 'N/A',
      healthB: cityB.healthCare ?? 'N/A',
    },
  })

  // --- WEATHER ---
  const bestA = getBestMonth(cityA.monthSummary)
  const bestB = getBestMonth(cityB.monthSummary)
  if (bestA && bestB) {
    sections.push({
      key: 'compare.weather.narrative',
      params: {
        cityA: cityA.name,
        cityB: cityB.name,
        bestMonthA: getMonthName(bestA.month, locale.value),
        bestMonthB: getMonthName(bestB.month, locale.value),
        tempA: Number(bestA.apparentTemperatureMax).toFixed(0),
        tempB: Number(bestB.apparentTemperatureMax).toFixed(0),
        scoreA: bestA.totalScore,
        scoreB: bestB.totalScore,
        rainA: Number(bestA.rainSum).toFixed(0),
        rainB: Number(bestB.rainSum).toFixed(0),
      },
    })
  }

  // --- WHO SHOULD CHOOSE (profile bullets) ---
  const profileBulletsA = getProfileBullets(cityA, locale.value)
  const profileBulletsB = getProfileBullets(cityB, locale.value)

  // --- VERDICT ---
  const verdictScoreA = computeVerdictScore(cityA)
  const verdictScoreB = computeVerdictScore(cityB)
  const verdictBranch = verdictScoreA > verdictScoreB ? 'aWins' : verdictScoreA < verdictScoreB ? 'bWins' : 'tied'
  sections.push({
    key: `compare.verdict.${verdictBranch}_v${v}`,
    params: {
      cityA: cityA.name,
      cityB: cityB.name,
      countryA: cityA.country,
      countryB: cityB.country,
    },
  })

  return {
    sections,
    profileBulletsA,
    profileBulletsB,
    verdictWinner: verdictBranch,
  }
}

interface ProfileBullet {
  key: string
  params: Record<string, string | number>
}

function getProfileBullets(city: CityData, locale: string): ProfileBullet[] {
  const bullets: ProfileBullet[] = []
  const cost = Number(city.costForNomadInUsd ?? 0)
  const speed = city.internetSpeedCity ?? 0
  const famCost = Number(city.costForFamilyInUsd ?? 0)

  if (cost > 0 && cost < 1500) {
    bullets.push({ key: 'compare.profile.budgetNomad', params: { cost } })
  }
  if (speed > 100) {
    bullets.push({ key: 'compare.profile.bandwidthWork', params: { speed } })
  }
  if (city.safety === 'HIGH') {
    bullets.push({ key: 'compare.profile.safetySeeking', params: {} })
  }
  if ((city.airQualityScore ?? 0) >= 4) {
    bullets.push({ key: 'compare.profile.cleanAir', params: { score: city.airQualityScore ?? 0 } })
  }
  if (famCost > 0 && famCost < 3500) {
    bullets.push({ key: 'compare.profile.familyNomad', params: { cost: famCost } })
  }
  if (city.population > 2_000_000) {
    bullets.push({ key: 'compare.profile.bigCityEnergy', params: { pop: formatNumber(city.population) } })
  }
  if (city.population < 500_000) {
    bullets.push({ key: 'compare.profile.smallTownFeel', params: { pop: formatNumber(city.population) } })
  }

  const bestMonth = getBestMonth(city.monthSummary)
  if (bestMonth) {
    bullets.push({
      key: 'compare.profile.bestSeason',
      params: {
        month: getMonthName(bestMonth.month, locale),
        temp: Number(bestMonth.apparentTemperatureMax).toFixed(0),
        score: bestMonth.totalScore,
      },
    })
  }

  return bullets
}

function computeVerdictScore(city: CityData): number {
  let score = 0
  const cost = Number(city.costForNomadInUsd ?? 0)
  if (cost > 0) score += Math.max(0, 3000 - cost) / 100 // Lower cost = more points (max 30)
  score += (city.internetSpeedCity ?? 0) / 10 // Higher speed = more points
  score += (LEVEL_ORDER[city.safety ?? 'LOW'] ?? 0) * 10
  score += (LEVEL_ORDER[city.healthCare ?? 'LOW'] ?? 0) * 5
  score += (city.airQualityScore ?? 0) * 3
  // Pollution inverted: LOW pollution = better
  score += (2 - (LEVEL_ORDER[city.pollution ?? 'HIGH'] ?? 2)) * 5
  return score
}
