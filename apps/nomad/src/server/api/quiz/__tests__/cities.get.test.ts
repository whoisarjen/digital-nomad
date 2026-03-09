import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
  getQueryMock: vi.fn(() => ({})),
}))

vi.mock('#imports', async (importOriginal) => ({
  ...(await importOriginal()),
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getQuery: getQueryMock,
}))

const mockCity = (overrides: Record<string, unknown> = {}) => ({
  slug: 'lisbon',
  name: 'Lisbon',
  country: { name: 'Portugal', region: 'Europe' },
  costForNomadInUsd: 1800,
  temperatureC: 20,
  internetSpeedCity: 90,
  safety: 'HIGH' as const,
  image: { url: 'https://example.com/lisbon.jpg', ownerName: 'Jane', ownerUsername: 'jane' },
  monthSummary: [],
  ...overrides,
})

describe('GET /api/quiz/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/quiz/cities.get')
  })

  it('returns cities with required quiz scoring fields', async () => {
    prismaMock.city.findMany.mockResolvedValue([mockCity()])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(1)
    const city = result[0]
    expect(city.slug).toBe('lisbon')
    expect(city.name).toBe('Lisbon')
    expect(city.country).toBe('Portugal')
    expect(city.region).toBe('Europe')
    expect(city.costForNomadInUsd).toBe(1800)
    expect(city.temperatureC).toBe(20)
    expect(city.internetSpeedCity).toBe(90)
    expect(city.safety).toBe('HIGH')
    expect(city.image).toEqual({
      url: 'https://example.com/lisbon.jpg',
      ownerName: 'Jane',
      ownerUsername: 'jane',
    })
  })

  it('returns multiple cities', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      mockCity(),
      mockCity({ slug: 'bangkok', name: 'Bangkok', country: { name: 'Thailand', region: 'Asia' } }),
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(2)
    expect(result[1].name).toBe('Bangkok')
    expect(result[1].region).toBe('Asia')
  })

  it('handles null image gracefully', async () => {
    prismaMock.city.findMany.mockResolvedValue([mockCity({ image: null })])

    const result = await handler.default(createMockH3Event())

    expect(result[0].image).toBeNull()
  })

  it('handles null safety gracefully', async () => {
    prismaMock.city.findMany.mockResolvedValue([mockCity({ safety: null })])

    const result = await handler.default(createMockH3Event())

    expect(result[0].safety).toBeNull()
  })

  it('returns monthTemperatureC as null when no month param provided', async () => {
    getQueryMock.mockReturnValue({})
    prismaMock.city.findMany.mockResolvedValue([mockCity({ monthSummary: [] })])

    const result = await handler.default(createMockH3Event())

    expect(result[0].monthTemperatureC).toBeNull()
  })

  it('returns monthTemperatureC from monthSummary when month param provided', async () => {
    getQueryMock.mockReturnValue({ month: '07' })
    prismaMock.city.findMany.mockResolvedValue([
      mockCity({ monthSummary: [{ temperature2mMax: 28.5 }] }),
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0].monthTemperatureC).toBe(28.5)
  })

  it('returns monthTemperatureC as null when monthSummary is empty', async () => {
    getQueryMock.mockReturnValue({ month: '07' })
    prismaMock.city.findMany.mockResolvedValue([mockCity({ monthSummary: [] })])

    const result = await handler.default(createMockH3Event())

    expect(result[0].monthTemperatureC).toBeNull()
  })
})
