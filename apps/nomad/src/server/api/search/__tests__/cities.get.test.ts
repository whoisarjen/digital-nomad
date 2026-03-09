import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
  getValidatedQueryMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getValidatedQuery: getValidatedQueryMock,
}))

describe('GET /api/search/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/search/cities.get')
  })

  beforeEach(() => {
    prismaMock.city.findMany.mockResolvedValue([])
  })

  it('returns empty array when q is empty string', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: '' })

    const result = await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('queries city by name (case-insensitive) when q is provided', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'bar' })
    prismaMock.city.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { name: { contains: 'bar', mode: 'insensitive' } },
          ]),
        }),
      }),
    )
  })

  it('returns slug, name, country and costForNomadInUsd per city', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'bar' })
    prismaMock.city.findMany.mockResolvedValue([
      {
        slug: 'barcelona',
        name: 'Barcelona',
        costForNomadInUsd: 2100,
        country: { name: 'Spain' },
      },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toEqual([
      { slug: 'barcelona', name: 'Barcelona', country: 'Spain', costForNomadInUsd: 2100 },
    ])
  })

  it('limits results to 6', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'a' })
    prismaMock.city.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 6 }),
    )
  })
})
