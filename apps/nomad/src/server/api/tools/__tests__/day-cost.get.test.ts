import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getLocaleMock, getLocalizedSelectMock, getValidatedQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findFirstOrThrow: vi.fn() },
  },
  getLocaleMock: vi.fn(() => 'En' as const),
  getLocalizedSelectMock: vi.fn(() => 'En'),
  getValidatedQueryMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getLocale: getLocaleMock,
  getLocalizedSelect: getLocalizedSelectMock,
  getValidatedQuery: getValidatedQueryMock,
}))

const mockCity = (overrides: Record<string, unknown> = {}) => ({
  slug: 'bangkok',
  name: 'Bangkok',
  mealInexpensiveRestaurant: '2.50',
  mealMidRangeRestaurant: '15.00',
  cappuccino: '2.00',
  domesticBeerRestaurant: '1.80',
  taxi1km: '0.50',
  oneWayTicket: '0.60',
  ...overrides,
})

describe('GET /api/tools/day-cost', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/tools/day-cost.get')
  })

  it('returns city price fields for a valid citySlug', async () => {
    getValidatedQueryMock.mockResolvedValue({ citySlug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(mockCity())

    const result = await handler.default(
      createMockH3Event({ query: { citySlug: 'bangkok' } }),
    )

    expect(result.citySlug).toBe('bangkok')
    expect(result.cityName).toBe('Bangkok')
    expect(result.mealInexpensiveRestaurant).toBe(2.5)
    expect(result.cappuccino).toBe(2.0)
    expect(result.domesticBeerRestaurant).toBe(1.8)
  })

  it('returns mealMidRangeRestaurant as numeric', async () => {
    getValidatedQueryMock.mockResolvedValue({ citySlug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(mockCity())

    const result = await handler.default(
      createMockH3Event({ query: { citySlug: 'bangkok' } }),
    )

    expect(typeof result.mealMidRangeRestaurant).toBe('number')
    expect(result.mealMidRangeRestaurant).toBe(15.0)
  })

  it('returns null for missing price fields', async () => {
    getValidatedQueryMock.mockResolvedValue({ citySlug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(
      mockCity({
        mealInexpensiveRestaurant: null,
        cappuccino: null,
      }),
    )

    const result = await handler.default(
      createMockH3Event({ query: { citySlug: 'bangkok' } }),
    )

    expect(result.mealInexpensiveRestaurant).toBeNull()
    expect(result.cappuccino).toBeNull()
  })

  it('returns taxi1km and oneWayTicket', async () => {
    getValidatedQueryMock.mockResolvedValue({ citySlug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue(mockCity())

    const result = await handler.default(
      createMockH3Event({ query: { citySlug: 'bangkok' } }),
    )

    expect(result.taxi1km).toBe(0.5)
    expect(result.oneWayTicket).toBe(0.6)
  })
})
