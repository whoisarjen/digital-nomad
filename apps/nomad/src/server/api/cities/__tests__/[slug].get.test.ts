import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedRouterParamsMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findFirstOrThrow: vi.fn() },
  },
  getValidatedRouterParamsMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getValidatedRouterParams: getValidatedRouterParamsMock,
}))

const mockCity = (overrides: Record<string, unknown> = {}) => ({
  name: 'Bangkok',
  countrySlug: 'thailand',
  country: {
    name: 'Thailand',
    region: 'Asia',
    internetSpeed: 100,
    internetSpeedRanking: 50,
    englishProficiency: 416,
    plugTypes: 'A,B,C,I',
    voltage: 220,
    frequency: 50,
  },
  costForNomadInUsd: 1500,
  costForExpatInUsd: 2000,
  costForLocalInUsd: 500,
  costForFamilyInUsd: 3000,
  pollution: 'MIDDLE',
  safety: 'HIGH',
  climate: 'HIGH',
  healthCare: 'MIDDLE',
  population: 8000000,
  internetSpeedCity: 120,
  internetSpeedCityRanking: 30,
  airQualityNow: 'MIDDLE',
  airQualityScore: 50,
  airQualityNowScore: 60,
  humidity: 70,
  image: null,
  monthSummary: [],
  ...overrides,
})

describe('GET /api/cities/[slug]', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/cities/[slug].get')
  })

  it('returns englishProficiency as LOW for score < 450', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(mockCity())

    const result = await handler.default(createMockH3Event({ params: { slug: 'bangkok' } }))

    expect(result.englishProficiency).toBe('LOW')
  })

  it('returns englishProficiency as MIDDLE for score >= 450', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'lisbon' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(
      mockCity({ country: { name: 'Portugal', region: 'Europe', internetSpeed: 80, internetSpeedRanking: 20, englishProficiency: 540 } }),
    )

    const result = await handler.default(createMockH3Event({ params: { slug: 'lisbon' } }))

    expect(result.englishProficiency).toBe('MIDDLE')
  })

  it('returns englishProficiency as HIGH for score >= 550', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'amsterdam' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(
      mockCity({ country: { name: 'Netherlands', region: 'Europe', internetSpeed: 150, internetSpeedRanking: 5, englishProficiency: 650 } }),
    )

    const result = await handler.default(createMockH3Event({ params: { slug: 'amsterdam' } }))

    expect(result.englishProficiency).toBe('HIGH')
  })

  it('returns englishProficiency as null for score 0', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'nowhere' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(
      mockCity({ country: { name: 'Unknown', region: 'Africa', internetSpeed: 10, internetSpeedRanking: 100, englishProficiency: 0 } }),
    )

    const result = await handler.default(createMockH3Event({ params: { slug: 'nowhere' } }))

    expect(result.englishProficiency).toBeNull()
  })

  it('returns plugTypes, voltage, frequency from country', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(mockCity())

    const result = await handler.default(createMockH3Event({ params: { slug: 'bangkok' } }))

    expect(result.plugTypes).toBe('A,B,C,I')
    expect(result.voltage).toBe(220)
    expect(result.frequency).toBe(50)
  })

  it('returns null plugTypes/voltage/frequency when country has no electricity data', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'nowhere' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(
      mockCity({
        country: {
          name: 'Unknown',
          region: 'Africa',
          internetSpeed: 10,
          internetSpeedRanking: 100,
          englishProficiency: 0,
          plugTypes: null,
          voltage: null,
          frequency: null,
        },
      }),
    )

    const result = await handler.default(createMockH3Event({ params: { slug: 'nowhere' } }))

    expect(result.plugTypes).toBeNull()
    expect(result.voltage).toBeNull()
    expect(result.frequency).toBeNull()
  })
})
