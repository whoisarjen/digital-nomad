import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
}))

describe('GET /api/cities/filters', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/cities/filters.get')
  })

  it('returns english_proficiency picker with OPTIONS_LEVEL_GTE', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { population: 1000, internetSpeedCity: 50, costForNomadInUsd: { toNumber: () => 500 } },
      { population: 5000, internetSpeedCity: 100, costForNomadInUsd: { toNumber: () => 1500 } },
      { population: 10000, internetSpeedCity: 200, costForNomadInUsd: { toNumber: () => 3000 } },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result.pickers).toHaveProperty('english_proficiency')
    expect(result.pickers.english_proficiency).toEqual({
      type: 'single',
      operation: 'gte',
      options: [
        { label: 'Middle', value: 'MIDDLE' },
        { label: 'High', value: 'HIGH' },
      ],
    })
  })
})
