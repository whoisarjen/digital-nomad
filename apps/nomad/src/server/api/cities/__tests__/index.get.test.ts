import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    monthSummary: { findMany: vi.fn() },
    city: { count: vi.fn() },
  },
  getValidatedQueryMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getValidatedQuery: getValidatedQueryMock,
}))

vi.mock('#auth', () => ({
  getServerSession: vi.fn(() => null),
}))

const BASE_QUERY = {
  page: 1,
  limit: 40,
  sort: 'desc',
  orderBy: 'totalScore',
  months: '03',
  lifestyle: [],
}

describe('GET /api/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/cities/index.get')
  })

  beforeEach(() => {
    prismaMock.monthSummary.findMany.mockResolvedValue([])
    prismaMock.city.count.mockResolvedValue(0)
  })

  it('applies english_proficiency filter as country.englishProficiency gte', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      english_proficiency: 550,
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { country: { englishProficiency: { gte: 550 } } },
          ]),
        }),
      }),
    )
  })

  it('applies budget_food lifestyle preset (meal < $5)', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['budget_food'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { mealInexpensiveRestaurant: { lt: 5 } },
          ]),
        }),
      }),
    )
  })

  it('applies cheap_beer lifestyle preset (domesticBeerRestaurant < $2)', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['cheap_beer'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { domesticBeerRestaurant: { lt: 2 } },
          ]),
        }),
      }),
    )
  })

  it('applies fast_internet lifestyle preset (internetSpeedCity >= 60)', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['fast_internet'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { internetSpeedCity: { gte: 60 } },
          ]),
        }),
      }),
    )
  })

  it('applies affordable_gym lifestyle preset (fitnessClubMonthly < $30)', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['affordable_gym'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { fitnessClubMonthly: { lt: 30 } },
          ]),
        }),
      }),
    )
  })

  it('applies budget_rent lifestyle preset (apartment1brOutside < $500)', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['budget_rent'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { apartment1brOutside: { lt: 500 } },
          ]),
        }),
      }),
    )
  })

  it('applies nomad_bundle lifestyle preset (apartment1brOutside + fitnessClubMonthly + internet60mbps < $800)', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['nomad_bundle'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            {
              apartment1brOutside: { lt: 800, not: null },
              fitnessClubMonthly: { not: null },
              internet60mbps: { not: null },
            },
          ]),
        }),
      }),
    )
  })

  it('stacks multiple lifestyle presets with AND logic', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: ['budget_food', 'cheap_beer'],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { mealInexpensiveRestaurant: { lt: 5 } },
            { domesticBeerRestaurant: { lt: 2 } },
          ]),
        }),
      }),
    )
  })

  it('does not add any filter when lifestyle is empty', async () => {
    getValidatedQueryMock.mockResolvedValue({
      ...BASE_QUERY,
      lifestyle: [],
    })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined }),
    )
  })
})
