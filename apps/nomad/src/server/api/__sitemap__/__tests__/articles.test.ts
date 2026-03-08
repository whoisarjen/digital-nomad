import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    article: { findMany: vi.fn() },
  },
  getQueryMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getQuery: getQueryMock,
  buildLocalizedEntries: (buildLoc: (lang: string) => string, extra?: object) => [
    { loc: buildLoc('en'), ...extra, alternatives: [] },
  ],
}))

describe('GET /api/__sitemap__/articles', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/articles')
  })

  it('entries do not include _sitemap field', async () => {
    getQueryMock.mockReturnValue({ chunk: '0' })
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'how-to-find-nomad-cities', updatedAt: new Date('2024-05-01') },
    ])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('entries include loc, lastmod, and alternatives', async () => {
    getQueryMock.mockReturnValue({ chunk: '0' })
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'nomad-guide', updatedAt: new Date('2024-02-01') },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('lastmod')
    expect(result[0]).toHaveProperty('alternatives')
  })

  it('returns entries for articles in the chunk', async () => {
    getQueryMock.mockReturnValue({ chunk: '0' })
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'nomad-guide', updatedAt: new Date('2024-01-01') },
      { slug: 'best-cities', updatedAt: new Date('2024-03-15') },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(2)
    expect(result[0].loc).toBe('/blog/nomad-guide')
    expect(result[0]).toHaveProperty('lastmod')
  })

  it('passes correct skip/take to prisma for each chunk', async () => {
    getQueryMock.mockReturnValue({ chunk: '3' })
    prismaMock.article.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 150, take: 50 }),
    )
  })
})
