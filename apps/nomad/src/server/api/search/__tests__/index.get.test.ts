import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedQueryMock, getLocaleMock, getLocalizedSelectMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
    article: { findMany: vi.fn() },
  },
  getValidatedQueryMock: vi.fn(),
  getLocaleMock: vi.fn(() => 'En' as const),
  getLocalizedSelectMock: vi.fn(() => 'En'),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getValidatedQuery: getValidatedQueryMock,
  getLocale: getLocaleMock,
  getLocalizedSelect: getLocalizedSelectMock,
}))

describe('GET /api/search', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/search/index.get')
  })

  beforeEach(() => {
    prismaMock.city.findMany.mockResolvedValue([])
    prismaMock.article.findMany.mockResolvedValue([])
  })

  it('returns empty cities and articles when q is empty string', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: '' })

    const result = await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).not.toHaveBeenCalled()
    expect(prismaMock.article.findMany).not.toHaveBeenCalled()
    expect(result).toEqual({ cities: [], articles: [] })
  })

  it('queries city by name (case-insensitive) when q is provided', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'bar' })

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

    expect(result.cities).toEqual([
      { slug: 'barcelona', name: 'Barcelona', country: 'Spain', costForNomadInUsd: 2100 },
    ])
  })

  it('limits city results to 5', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'a' })

    await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    )
  })

  it('queries articles by localized title', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'nomad' })

    await handler.default(createMockH3Event())

    expect(prismaMock.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isPublished: true,
          titleEn: { contains: 'nomad', mode: 'insensitive' },
        }),
        take: 3,
      }),
    )
  })

  it('returns slug, title and readingTimeMinutes per article', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'guide' })
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'nomad-guide', titleEn: 'Nomad Guide', readingTimeMinutes: 5 },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result.articles).toEqual([
      { slug: 'nomad-guide', title: 'Nomad Guide', readingTimeMinutes: 5 },
    ])
  })

  it('returns null title when localized title is null', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'test' })
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'test-article', titleEn: null, readingTimeMinutes: 3 },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result.articles).toEqual([
      { slug: 'test-article', title: null, readingTimeMinutes: 3 },
    ])
  })
})
