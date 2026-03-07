import { describe, it, expect, vi, beforeAll } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  buildLocalizedEntries: (buildLoc: (lang: string) => string, extra?: object) => [
    { loc: buildLoc('en'), ...extra, alternatives: [] },
  ],
}))

describe('GET /api/__sitemap__/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/cities')
  })

  it('returns entries for all cities', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'bangkok', updatedAt: new Date('2024-01-01') },
      { slug: 'lisbon', updatedAt: new Date('2024-03-15') },
    ])

    const result = await handler.default()

    expect(result).toHaveLength(2)
    expect(result[0].loc).toBe('/cities/bangkok')
    expect(result[0]).toHaveProperty('lastmod')
  })

  it('entries do not include _sitemap field', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'barcelona', updatedAt: new Date('2024-06-01') },
    ])

    const result = await handler.default()

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })
})
