import { describe, it, expect } from 'vitest'
import { scoreCity, MAX_QUIZ_SCORE, QUIZ_REGIONS } from '~/shared/quiz.utils'

const baseCity = {
  costForNomadInUsd: 1200,   // bracket 1 ($1000–$1499)
  temperatureC: 20,           // mild (close to 18°C midpoint)
  internetSpeedCity: 60,      // good (≥50 Mbps)
  safety: 'MIDDLE' as const,
  region: 'Europe' as const,
}

const allAny = { budget: 1, climate: 4, internet: 3, safety: 2, regions: [] as number[] }

describe('scoreCity', () => {
  it('returns MAX_QUIZ_SCORE when all preferences are "any" and city fits bracket', () => {
    const score = scoreCity(baseCity, allAny)
    expect(score).toBe(MAX_QUIZ_SCORE)
  })

  describe('budget', () => {
    it('gives 3pts for exact bracket match (bracket 1 = $1000–$1499)', () => {
      const score = scoreCity(baseCity, { ...allAny, budget: 1 })
      expect(score).toBe(MAX_QUIZ_SCORE) // all dimensions max
    })

    it('gives 1pt for adjacent bracket (1 apart)', () => {
      // city bracket 1, preference bracket 2 → adjacent
      const scoreAdj = scoreCity(baseCity, { ...allAny, budget: 2 })
      const scoreExact = scoreCity(baseCity, { ...allAny, budget: 1 })
      expect(scoreExact - scoreAdj).toBe(2) // 3pts vs 1pt
    })

    it('gives 0pts for non-adjacent bracket (2 apart)', () => {
      // city bracket 1, preference bracket 3 → 2 away
      const scoreWrong = scoreCity(baseCity, { ...allAny, budget: 3 })
      const scoreExact = scoreCity(baseCity, { ...allAny, budget: 1 })
      expect(scoreExact - scoreWrong).toBe(3) // 3pts vs 0pts
    })

    it('city <$1000 is bracket 0', () => {
      const cheapCity = { ...baseCity, costForNomadInUsd: 800 }
      const score = scoreCity(cheapCity, { ...allAny, budget: 0 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('city $2500+ is bracket 3', () => {
      const expCity = { ...baseCity, costForNomadInUsd: 3000 }
      const score = scoreCity(expCity, { ...allAny, budget: 3 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('handles null cost gracefully (0pts)', () => {
      const score = scoreCity({ ...baseCity, costForNomadInUsd: null }, { ...allAny, budget: 1 })
      expect(score).toBe(MAX_QUIZ_SCORE - 3) // lost budget pts
    })
  })

  describe('climate', () => {
    it('gives 3pts when preference is any (index 4)', () => {
      const score = scoreCity({ ...baseCity, temperatureC: -10 }, { ...allAny, climate: 4 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 3pts within ±5°C of midpoint', () => {
      // Mild midpoint = 18°C, city = 20°C → diff 2 → 3pts
      const score = scoreCity({ ...baseCity, temperatureC: 20 }, { ...allAny, climate: 1 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 1pt within ±12°C of midpoint', () => {
      // Mild midpoint = 18°C, city = 28°C → diff 10 → 1pt
      const score = scoreCity({ ...baseCity, temperatureC: 28 }, { ...allAny, climate: 1 })
      const scoreAny = scoreCity({ ...baseCity, temperatureC: 28 }, allAny)
      expect(scoreAny - score).toBe(2) // 3pts vs 1pt
    })

    it('gives 0pts beyond ±12°C', () => {
      // Mild midpoint = 18°C, city = 35°C → diff 17 → 0pts
      const score = scoreCity({ ...baseCity, temperatureC: 35 }, { ...allAny, climate: 1 })
      const scoreAny = scoreCity({ ...baseCity, temperatureC: 35 }, allAny)
      expect(scoreAny - score).toBe(3) // 3pts vs 0pts
    })

    it('handles null temperature gracefully (0pts unless any)', () => {
      const score = scoreCity({ ...baseCity, temperatureC: null }, { ...allAny, climate: 1 })
      const scoreAny = scoreCity({ ...baseCity, temperatureC: null }, allAny)
      expect(scoreAny - score).toBe(3)
    })
  })

  describe('internet', () => {
    it('gives 3pts when preference is any (index 3)', () => {
      const score = scoreCity({ ...baseCity, internetSpeedCity: 0 }, allAny)
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 3pts when city meets or exceeds threshold', () => {
      // Good = 50 Mbps, city = 60 Mbps → 3pts
      const score = scoreCity({ ...baseCity, internetSpeedCity: 60 }, { ...allAny, internet: 1 })
      const scoreAny = scoreCity({ ...baseCity, internetSpeedCity: 60 }, allAny)
      expect(score).toBe(scoreAny)
    })

    it('gives 1pt when within 20% below threshold', () => {
      // Good = 50 Mbps, 80% = 40 Mbps, city = 42 Mbps → 1pt
      const score = scoreCity({ ...baseCity, internetSpeedCity: 42 }, { ...allAny, internet: 1 })
      const scoreAny = scoreCity({ ...baseCity, internetSpeedCity: 42 }, allAny)
      expect(scoreAny - score).toBe(2) // 3pts vs 1pt
    })

    it('gives 0pts below 80% of threshold', () => {
      // Good = 50 Mbps, 80% = 40 Mbps, city = 30 Mbps → 0pts
      const score = scoreCity({ ...baseCity, internetSpeedCity: 30 }, { ...allAny, internet: 1 })
      const scoreAny = scoreCity({ ...baseCity, internetSpeedCity: 30 }, allAny)
      expect(scoreAny - score).toBe(3) // 3pts vs 0pts
    })

    it('handles null internet speed gracefully (0pts)', () => {
      const score = scoreCity({ ...baseCity, internetSpeedCity: null }, { ...allAny, internet: 1 })
      const scoreAny = scoreCity({ ...baseCity, internetSpeedCity: null }, allAny)
      expect(scoreAny - score).toBe(3)
    })
  })

  describe('safety', () => {
    it('gives 3pts when preference is adventurous (index 2)', () => {
      const score = scoreCity({ ...baseCity, safety: 'LOW' }, allAny)
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 3pts for HIGH when preferring safe (index 0)', () => {
      const score = scoreCity({ ...baseCity, safety: 'HIGH' }, { ...allAny, safety: 0 })
      const scoreAdv = scoreCity({ ...baseCity, safety: 'HIGH' }, allAny)
      expect(score).toBe(scoreAdv)
    })

    it('gives 1pt for MIDDLE when preferring safe (index 0)', () => {
      const score = scoreCity({ ...baseCity, safety: 'MIDDLE' }, { ...allAny, safety: 0 })
      const scoreAdv = scoreCity({ ...baseCity, safety: 'MIDDLE' }, allAny)
      expect(scoreAdv - score).toBe(2) // 3pts vs 1pt
    })

    it('gives 0pts for LOW when preferring safe (index 0)', () => {
      const score = scoreCity({ ...baseCity, safety: 'LOW' }, { ...allAny, safety: 0 })
      const scoreAdv = scoreCity({ ...baseCity, safety: 'LOW' }, allAny)
      expect(scoreAdv - score).toBe(3) // 3pts vs 0pts
    })

    it('gives 3pts for HIGH when preferring moderate (index 1)', () => {
      const score = scoreCity({ ...baseCity, safety: 'HIGH' }, { ...allAny, safety: 1 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 3pts for MIDDLE when preferring moderate (index 1)', () => {
      const score = scoreCity({ ...baseCity, safety: 'MIDDLE' }, { ...allAny, safety: 1 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 1pt for LOW when preferring moderate (index 1)', () => {
      const score = scoreCity({ ...baseCity, safety: 'LOW' }, { ...allAny, safety: 1 })
      const scoreAdv = scoreCity({ ...baseCity, safety: 'LOW' }, allAny)
      expect(scoreAdv - score).toBe(2) // 3pts vs 1pt
    })

    it('handles null safety gracefully', () => {
      // null safety = 0pts for safety preference 0 (safe)
      const score = scoreCity({ ...baseCity, safety: null }, { ...allAny, safety: 0 })
      const scoreAdv = scoreCity({ ...baseCity, safety: null }, allAny)
      expect(scoreAdv - score).toBe(3)
    })
  })

  describe('monthTemperatureC', () => {
    it('uses monthTemperatureC instead of temperatureC for climate scoring when provided', () => {
      // annual temp 20°C (diff 2 from mild midpoint 18°C → 3pts)
      // monthly temp 35°C (diff 17 from mild midpoint 18°C → 0pts)
      const withMonthly = scoreCity(
        { ...baseCity, temperatureC: 20, monthTemperatureC: 35 },
        { ...allAny, climate: 1 },
      )
      const withAnnual = scoreCity(
        { ...baseCity, temperatureC: 20, monthTemperatureC: null },
        { ...allAny, climate: 1 },
      )
      expect(withAnnual - withMonthly).toBe(3) // monthly overrides and scores 0pts vs 3pts
    })

    it('falls back to temperatureC when monthTemperatureC is null', () => {
      // annual temp 20°C → within ±5 of mild midpoint 18°C → 3pts
      const score = scoreCity(
        { ...baseCity, temperatureC: 20, monthTemperatureC: null },
        { ...allAny, climate: 1 },
      )
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('falls back to temperatureC when monthTemperatureC is undefined', () => {
      // annual temp 20°C → 3pts for mild climate
      const score = scoreCity({ ...baseCity, temperatureC: 20 }, { ...allAny, climate: 1 })
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 3pts when monthTemperatureC is within ±5 of midpoint', () => {
      // monthly temp 19°C, prefer mild (midpoint 18°C) → diff 1 → 3pts
      const score = scoreCity(
        { ...baseCity, temperatureC: 5, monthTemperatureC: 19 },
        { ...allAny, climate: 1 },
      )
      expect(score).toBe(MAX_QUIZ_SCORE)
    })
  })

  describe('regions', () => {
    it('gives 3pts when regions array is empty (anywhere)', () => {
      const score = scoreCity(baseCity, allAny)
      expect(score).toBe(MAX_QUIZ_SCORE)
    })

    it('gives 3pts when city region is in selected regions', () => {
      // Europe is index 0 in QUIZ_REGIONS
      const europeIdx = QUIZ_REGIONS.indexOf('Europe')
      const score = scoreCity({ ...baseCity, region: 'Europe' }, { ...allAny, regions: [europeIdx] })
      const scoreAny = scoreCity({ ...baseCity, region: 'Europe' }, allAny)
      expect(score).toBe(scoreAny)
    })

    it('gives 0pts when city region is not in selected regions', () => {
      const asiaIdx = QUIZ_REGIONS.indexOf('Asia')
      const score = scoreCity({ ...baseCity, region: 'Europe' }, { ...allAny, regions: [asiaIdx] })
      const scoreAny = scoreCity({ ...baseCity, region: 'Europe' }, allAny)
      expect(scoreAny - score).toBe(3) // 3pts vs 0pts
    })

    it('handles null region gracefully (0pts when region selected)', () => {
      const score = scoreCity({ ...baseCity, region: null }, { ...allAny, regions: [0] })
      const scoreAny = scoreCity({ ...baseCity, region: null }, allAny)
      expect(scoreAny - score).toBe(3)
    })
  })
})
