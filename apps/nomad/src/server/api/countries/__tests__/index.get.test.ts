import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { groupBy: vi.fn() },
    country: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
}))

describe('GET /api/countries', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/countries/index.get')
  })

  it('returns mapped countries list', async () => {
    prismaMock.city.groupBy.mockResolvedValue([
      {
        countrySlug: 'thailand',
        _count: 5,
        _avg: { costForNomadInUsd: 1500, internetSpeedCity: 80.7 },
      },
    ])
    prismaMock.country.findMany.mockResolvedValue([
      { slug: 'thailand', name: 'Thailand', code: 'TH' },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      countrySlug: 'thailand',
      country: 'Thailand',
      countryCode: 'TH',
      cityCount: 5,
      avgCost: 1500,
      avgInternet: 81,
    })
  })

  it('rounds avgInternet to nearest integer', async () => {
    prismaMock.city.groupBy.mockResolvedValue([
      {
        countrySlug: 'portugal',
        _count: 2,
        _avg: { costForNomadInUsd: 2000, internetSpeedCity: 124.4 },
      },
    ])
    prismaMock.country.findMany.mockResolvedValue([
      { slug: 'portugal', name: 'Portugal', code: 'PT' },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0].avgInternet).toBe(124)
  })

  it('returns null for avgCost and avgInternet when data is missing', async () => {
    prismaMock.city.groupBy.mockResolvedValue([
      {
        countrySlug: 'unknown',
        _count: 1,
        _avg: { costForNomadInUsd: null, internetSpeedCity: null },
      },
    ])
    prismaMock.country.findMany.mockResolvedValue([
      { slug: 'unknown', name: 'Unknown', code: '' },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0].avgCost).toBeNull()
    expect(result[0].avgInternet).toBeNull()
  })

  it('returns empty array when no countries exist', async () => {
    prismaMock.city.groupBy.mockResolvedValue([])
    prismaMock.country.findMany.mockResolvedValue([])

    const result = await handler.default(createMockH3Event())

    expect(result).toEqual([])
  })
})
