import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    monthSummary: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
}))

describe('GET /api/rankings/best-cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/rankings/best-cities.get')
  })

  it('returns one entry per month with topCity fields', async () => {
    prismaMock.monthSummary.findMany.mockResolvedValue([
      {
        month: '01',
        totalScore: 4,
        city: { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', image: null },
      },
      {
        month: '02',
        totalScore: 3,
        city: { slug: 'lisbon', name: 'Lisbon', country: 'Portugal', image: null },
      },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      month: '01',
      topCity: { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', totalScore: 4, image: null },
    })
  })

  it('queries with distinct month, ordered by totalScore desc', async () => {
    prismaMock.monthSummary.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.monthSummary.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        distinct: ['month'],
        orderBy: [{ month: 'asc' }, { totalScore: 'desc' }],
      }),
    )
  })

  it('filters to only the 12 calendar months', async () => {
    prismaMock.monthSummary.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.monthSummary.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { month: { in: ['01','02','03','04','05','06','07','08','09','10','11','12'] } },
      }),
    )
  })
})
