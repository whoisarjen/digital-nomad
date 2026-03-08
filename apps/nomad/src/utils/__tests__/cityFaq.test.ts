import { describe, it, expect } from 'vitest'
import { buildCityFaqItems } from '~/utils/cityFaq'

const t = (key: string, params?: Record<string, unknown>) => {
  if (!params) return key
  // Append param values so assertions can check for city names, costs, etc.
  return `${key} ${Object.values(params).join(' ')}`
}

const fullData = {
  name: 'Bangkok',
  costForNomadInUsd: 1200,
  internetSpeedCity: 80,
  internetSpeedCityRanking: 15,
  safety: 'MIDDLE' as const,
  monthSummary: [
    { month: '1', totalScore: 90, apparentTemperatureMax: 28, rainSum: 10 },
    { month: '6', totalScore: 50, apparentTemperatureMax: 35, rainSum: 200 },
  ],
  airQualityScore: 3,
  airQualityNow: 75,
}

describe('buildCityFaqItems', () => {
  it('returns 5 FAQ items when all data is present', () => {
    const items = buildCityFaqItems(fullData, t, 'en-US')
    expect(items).toHaveLength(5)
  })

  it('each item has @type Question with name and acceptedAnswer', () => {
    const items = buildCityFaqItems(fullData, t, 'en-US')
    for (const item of items) {
      expect(item['@type']).toBe('Question')
      expect(item.name).toBeTruthy()
      expect(item.acceptedAnswer['@type']).toBe('Answer')
      expect(item.acceptedAnswer.text).toBeTruthy()
    }
  })

  it('includes city name in affordability question and answer', () => {
    const items = buildCityFaqItems(fullData, t, 'en-US')
    expect(items[0]!.name).toContain('Bangkok')
    expect(items[0]!.acceptedAnswer.text).toContain('Bangkok')
  })

  it('skips affordability FAQ when costForNomadInUsd is null', () => {
    const items = buildCityFaqItems({ ...fullData, costForNomadInUsd: null }, t, 'en-US')
    expect(items).toHaveLength(4)
  })

  it('skips internet FAQ when internetSpeedCity is null', () => {
    const items = buildCityFaqItems({ ...fullData, internetSpeedCity: null, internetSpeedCityRanking: null }, t, 'en-US')
    expect(items).toHaveLength(4)
  })

  it('skips safety FAQ when safety is null', () => {
    const items = buildCityFaqItems({ ...fullData, safety: null }, t, 'en-US')
    expect(items).toHaveLength(4)
  })

  it('skips weather FAQ when monthSummary is empty', () => {
    const items = buildCityFaqItems({ ...fullData, monthSummary: [] }, t, 'en-US')
    expect(items).toHaveLength(4)
  })

  it('skips air quality FAQ when airQualityScore is null', () => {
    const items = buildCityFaqItems({ ...fullData, airQualityScore: null, airQualityNow: null }, t, 'en-US')
    expect(items).toHaveLength(4)
  })

  it('returns 0 items when all data is null', () => {
    const items = buildCityFaqItems(
      { ...fullData, costForNomadInUsd: null, internetSpeedCity: null, internetSpeedCityRanking: null, safety: null, monthSummary: [], airQualityScore: null, airQualityNow: null },
      t,
      'en-US',
    )
    expect(items).toHaveLength(0)
  })
})
