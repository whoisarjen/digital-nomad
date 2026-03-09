export const QUIZ_REGIONS = [
  'Europe',
  'Asia',
  'MiddleEast',
  'LatinAmerica',
  'NorthAmerica',
  'Africa',
  'Oceania',
] as const

export type QuizRegion = (typeof QUIZ_REGIONS)[number]

export interface QuizAnswers {
  budget: number     // 0=<$1k, 1=$1k–$1.5k, 2=$1.5k–$2.5k, 3=$2.5k+
  climate: number    // 0=cold, 1=mild, 2=warm, 3=hot, 4=any
  internet: number   // 0=basic(20), 1=good(50), 2=fast(100), 3=any
  safety: number     // 0=high, 1=moderate, 2=adventurous
  regions: number[]  // indices into QUIZ_REGIONS, empty = anywhere
}

export const MAX_QUIZ_SCORE = 15 // 5 dimensions × 3pts each

const BUDGET_THRESHOLDS = [1000, 1500, 2500] as const // upper exclusive bounds for brackets 0, 1, 2

function getBudgetBracket(cost: number): number {
  if (cost < BUDGET_THRESHOLDS[0]) return 0
  if (cost < BUDGET_THRESHOLDS[1]) return 1
  if (cost < BUDGET_THRESHOLDS[2]) return 2
  return 3
}

const CLIMATE_MIDPOINTS: [number, number, number, number] = [5, 18, 25, 30] // preferred °C midpoint per index

const INTERNET_THRESHOLDS: [number, number, number] = [20, 50, 100] // Mbps per index

export function scoreCity(
  city: {
    costForNomadInUsd: number | null
    temperatureC: number | null
    monthTemperatureC?: number | null
    internetSpeedCity: number | null
    safety: 'HIGH' | 'MIDDLE' | 'LOW' | null
    region: string | null
  },
  answers: QuizAnswers,
): number {
  let score = 0

  // --- Budget ---
  if (city.costForNomadInUsd != null) {
    const cityBracket = getBudgetBracket(Number(city.costForNomadInUsd))
    const diff = Math.abs(cityBracket - answers.budget)
    if (diff === 0) score += 3
    else if (diff === 1) score += 1
  }

  // --- Climate ---
  const effectiveTemp = city.monthTemperatureC ?? city.temperatureC
  if (answers.climate === 4) {
    score += 3
  } else if (effectiveTemp != null) {
    const midpoint = CLIMATE_MIDPOINTS[answers.climate as 0 | 1 | 2 | 3]
    const diff = Math.abs(Number(effectiveTemp) - midpoint)
    if (diff <= 5) score += 3
    else if (diff <= 12) score += 1
  }

  // --- Internet ---
  if (answers.internet === 3) {
    score += 3
  } else if (city.internetSpeedCity != null) {
    const threshold = INTERNET_THRESHOLDS[answers.internet as 0 | 1 | 2]
    if (city.internetSpeedCity >= threshold) score += 3
    else if (city.internetSpeedCity >= threshold * 0.8) score += 1
  }

  // --- Safety ---
  if (answers.safety === 2) {
    // Adventurous — any safety is fine
    score += 3
  } else if (answers.safety === 0) {
    // Prefer HIGH safety
    if (city.safety === 'HIGH') score += 3
    else if (city.safety === 'MIDDLE') score += 1
    // LOW or null → 0pts
  } else {
    // Prefer MIDDLE safety (anything HIGH or MIDDLE is fine, LOW is 1pt)
    if (city.safety === 'HIGH' || city.safety === 'MIDDLE') score += 3
    else score += 1 // LOW or null → 1pt (adventurous territory)
  }

  // --- Regions ---
  if (answers.regions.length === 0) {
    score += 3
  } else if (city.region != null) {
    const cityRegionIdx = QUIZ_REGIONS.indexOf(city.region as QuizRegion)
    if (cityRegionIdx !== -1 && answers.regions.includes(cityRegionIdx)) score += 3
  }

  return score
}
