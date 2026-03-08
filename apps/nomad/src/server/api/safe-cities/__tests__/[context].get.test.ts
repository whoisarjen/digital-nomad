import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedRouterParamsMock } = vi.hoisted(() => ({
  prismaMock: {
    monthSummary: { findMany: vi.fn() },
  },
  getValidatedRouterParamsMock: vi.fn(),
}))

vi.mock('#imports', async (importOriginal) => ({
  ...(await importOriginal()),
  defineEventHandler: (handler: Function) => handler,
  getValidatedRouterParams: getValidatedRouterParamsMock,
  prisma: prismaMock,
}))

vi.stubGlobal('createError', (opts: object) => Object.assign(new Error(), opts))

vi.mock('~/shared/global.utils', async (importOriginal) => ({
  ...(await importOriginal()),
  getUserCurrentMonthString: vi.fn(() => '03'),
}))

const mockCity = {
  slug: 'lisbon',
  name: 'Lisbon',
  country: { name: 'Portugal' },
  costForNomadInUsd: 1800,
  internetSpeedCity: 120,
  safety: 'HIGH' as const,
  population: 500000,
  image: { url: 'https://example.com/lisbon.jpg', ownerName: 'Jane', ownerUsername: 'jane' },
}

const mockSummary = (overrides: Record<string, any> = {}) => ({
  totalScore: 88,
  weatherIcon: 'SUN',
  temperature2mMax: 22,
  city: { ...mockCity, ...overrides },
})

describe('GET /api/safe-cities/[context]', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/safe-cities/[context].get')
  })

  it('returns safe cities and stats for context=all', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ context: 'all' })
    prismaMock.monthSummary.findMany.mockResolvedValue([mockSummary()])

    const result = await handler.default(createMockH3Event({ params: { context: 'all' } }))

    expect(result.context).toBe('all')
    expect(result.cities).toHaveLength(1)
    expect(result.cities[0].name).toBe('Lisbon')
    expect(result.cities[0].safety).toBe('HIGH')
    expect(result.cities[0].totalScore).toBe(88)
  })

  it('returns safe cities for context=women', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ context: 'women' })
    prismaMock.monthSummary.findMany.mockResolvedValue([mockSummary()])

    const result = await handler.default(createMockH3Event({ params: { context: 'women' } }))

    expect(result.context).toBe('women')
    expect(result.region).toBeNull()
    expect(result.cities).toHaveLength(1)
  })

  it('returns safe cities for a regional context', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ context: 'europe' })
    prismaMock.monthSummary.findMany.mockResolvedValue([mockSummary()])

    const result = await handler.default(createMockH3Event({ params: { context: 'europe' } }))

    expect(result.context).toBe('europe')
    expect(result.region).toBe('Europe')
  })

  it('computes costMin and costMax', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ context: 'all' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ costForNomadInUsd: 1000 }),
      mockSummary({ slug: 'porto', name: 'Porto', costForNomadInUsd: 800 }),
    ])

    const result = await handler.default(createMockH3Event({ params: { context: 'all' } }))

    expect(result.stats.costMin).toBe(800)
    expect(result.stats.costMax).toBe(1000)
  })

  it('computes avgSpeed', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ context: 'all' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ internetSpeedCity: 100 }),
      mockSummary({ slug: 'porto', internetSpeedCity: 60 }),
    ])

    const result = await handler.default(createMockH3Event({ params: { context: 'all' } }))

    expect(result.stats.avgSpeed).toBe(80)
  })

  it('returns null stats when data is missing', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ context: 'all' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ costForNomadInUsd: null, internetSpeedCity: null }),
    ])

    const result = await handler.default(createMockH3Event({ params: { context: 'all' } }))

    expect(result.stats.costMin).toBeNull()
    expect(result.stats.costMax).toBeNull()
    expect(result.stats.avgSpeed).toBeNull()
  })

  it('throws 404 for an invalid context', async () => {
    getValidatedRouterParamsMock.mockRejectedValue(Object.assign(new Error(), { statusCode: 400 }))

    await expect(
      handler.default(createMockH3Event({ params: { context: 'invalid' } }))
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
