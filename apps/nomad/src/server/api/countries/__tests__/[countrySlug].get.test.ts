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

// createError is injected as a Nuxt global in server routes, not imported from #imports
vi.stubGlobal('createError', (opts: object) => Object.assign(new Error(), opts))

vi.mock('~/shared/global.utils', () => ({
  getUserCurrentMonthString: vi.fn(() => '2024-03'),
}))

const mockCity = {
  slug: 'bangkok',
  name: 'Bangkok',
  country: { name: 'Thailand', code: 'TH' },
  countrySlug: 'thailand',
  costForNomadInUsd: 1500,
  internetSpeedCity: 80,
  safety: 'MIDDLE',
  image: { url: 'https://example.com/bangkok.jpg', ownerName: 'John', ownerUsername: 'john' },
}

const mockSummary = (overrides: Record<string, any> = {}) => ({
  totalScore: 85,
  weatherIcon: 'sunny',
  temperature2mMax: 32,
  city: { ...mockCity, ...overrides },
})

describe('GET /api/countries/[countrySlug]', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/countries/[countrySlug].get')
  })

  it('returns country data with cities and stats', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ countrySlug: 'thailand' })
    prismaMock.monthSummary.findMany.mockResolvedValue([mockSummary()])

    const result = await handler.default(createMockH3Event({ params: { countrySlug: 'thailand' } }))

    expect(result.country).toBe('Thailand')
    expect(result.countryCode).toBe('TH')
    expect(result.countrySlug).toBe('thailand')
    expect(result.cities).toHaveLength(1)
    expect(result.cities[0].name).toBe('Bangkok')
    expect(result.cities[0].totalScore).toBe(85)
    expect(result.cities[0].weatherIcon).toBe('sunny')
  })

  it('computes costMin and costMax from city costs', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ countrySlug: 'thailand' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ costForNomadInUsd: 1000 }),
      mockSummary({ slug: 'chiangmai', name: 'Chiang Mai', costForNomadInUsd: 800 }),
    ])

    const result = await handler.default(createMockH3Event({ params: { countrySlug: 'thailand' } }))

    expect(result.stats.costMin).toBe(800)
    expect(result.stats.costMax).toBe(1000)
  })

  it('computes avgSpeed from city internet speeds', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ countrySlug: 'portugal' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ internetSpeedCity: 100 }),
      mockSummary({ slug: 'porto', internetSpeedCity: 60 }),
    ])

    const result = await handler.default(createMockH3Event({ params: { countrySlug: 'portugal' } }))

    expect(result.stats.avgSpeed).toBe(80)
  })

  it('counts only HIGH safety cities', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ countrySlug: 'portugal' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ safety: 'HIGH' }),
      mockSummary({ slug: 'porto', safety: 'MIDDLE' }),
      mockSummary({ slug: 'faro', safety: 'LOW' }),
    ])

    const result = await handler.default(createMockH3Event({ params: { countrySlug: 'portugal' } }))

    expect(result.stats.safetyHighCount).toBe(1)
  })

  it('returns stats with null cost fields when costs are missing', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ countrySlug: 'unknown' })
    prismaMock.monthSummary.findMany.mockResolvedValue([
      mockSummary({ costForNomadInUsd: null as unknown as number, internetSpeedCity: null as unknown as number }),
    ])

    const result = await handler.default(createMockH3Event({ params: { countrySlug: 'unknown' } }))

    expect(result.stats.costMin).toBeNull()
    expect(result.stats.costMax).toBeNull()
    expect(result.stats.avgSpeed).toBeNull()
  })

  it('throws 404 when no cities found for countrySlug', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ countrySlug: 'nonexistent' })
    prismaMock.monthSummary.findMany.mockResolvedValue([])

    await expect(
      handler.default(createMockH3Event({ params: { countrySlug: 'nonexistent' } }))
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})
