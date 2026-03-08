import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', async (importOriginal) => ({
  ...(await importOriginal()),
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
}))

const mockCity = (overrides: Record<string, unknown> = {}) => ({
  slug: 'lisbon',
  name: 'Lisbon',
  country: { name: 'Portugal' },
  costForNomadInUsd: 1800,
  costForExpatInUsd: 2200,
  costForLocalInUsd: 1400,
  costForFamilyInUsd: 3000,
  image: { url: 'https://example.com/lisbon.jpg' },
  ...overrides,
})

describe('GET /api/tools/runway', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/tools/runway.get')
  })

  it('returns all cities with flattened cost fields', async () => {
    prismaMock.city.findMany.mockResolvedValue([mockCity()])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('lisbon')
    expect(result[0].name).toBe('Lisbon')
    expect(result[0].country).toBe('Portugal')
    expect(result[0].costForNomadInUsd).toBe(1800)
    expect(result[0].costForExpatInUsd).toBe(2200)
    expect(result[0].costForLocalInUsd).toBe(1400)
    expect(result[0].costForFamilyInUsd).toBe(3000)
    expect(result[0].imageUrl).toBe('https://example.com/lisbon.jpg')
  })

  it('returns empty array when no cities', async () => {
    prismaMock.city.findMany.mockResolvedValue([])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(0)
  })

  it('coerces Decimal cost fields to numbers', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      mockCity({ costForNomadInUsd: { toNumber: () => 1800 } as unknown as number }),
    ])

    const result = await handler.default(createMockH3Event())

    expect(typeof result[0].costForNomadInUsd).toBe('number')
  })

  it('returns null imageUrl when image is null', async () => {
    prismaMock.city.findMany.mockResolvedValue([mockCity({ image: null })])

    const result = await handler.default(createMockH3Event())

    expect(result[0].imageUrl).toBeNull()
  })

  it('falls back to 0 for null cost fields', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      mockCity({ costForNomadInUsd: null, costForExpatInUsd: null }),
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0].costForNomadInUsd).toBe(0)
    expect(result[0].costForExpatInUsd).toBe(0)
  })
})
