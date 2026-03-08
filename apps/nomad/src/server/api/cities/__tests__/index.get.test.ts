import { describe, it, expect, vi, beforeAll } from 'vitest'
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

describe('GET /api/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/cities/index.get')
  })

  it('applies english_proficiency filter as country.englishProficiency gte', async () => {
    getValidatedQueryMock.mockResolvedValue({
      page: 1,
      limit: 40,
      sort: 'desc',
      orderBy: 'totalScore',
      months: '03',
      english_proficiency: 550,
    })
    prismaMock.monthSummary.findMany.mockResolvedValue([])
    prismaMock.city.count.mockResolvedValue(0)

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
})
