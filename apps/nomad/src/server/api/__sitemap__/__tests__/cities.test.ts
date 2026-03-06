import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
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

describe('GET /api/__sitemap__/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/cities')
  })

  it('returns entries for cities in the chunk', async () => {
    getQueryMock.mockReturnValue({ chunk: '0', total: '1' })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'bangkok', updatedAt: new Date('2024-01-01') },
      { slug: 'lisbon', updatedAt: new Date('2024-03-15') },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(2)
    expect(result[0].loc).toBe('/cities/bangkok')
    expect(result[0]).toHaveProperty('lastmod')
  })

  it('entries do not include _sitemap field', async () => {
    getQueryMock.mockReturnValue({ chunk: '0', total: '1' })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'barcelona', updatedAt: new Date('2024-06-01') },
    ])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('only processes cities in the given chunk', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'a', updatedAt: new Date() },
      { slug: 'b', updatedAt: new Date() },
      { slug: 'c', updatedAt: new Date() },
      { slug: 'd', updatedAt: new Date() },
    ])

    getQueryMock.mockReturnValue({ chunk: '0', total: '2' })
    const chunk0 = await handler.default(createMockH3Event())

    getQueryMock.mockReturnValue({ chunk: '1', total: '2' })
    const chunk1 = await handler.default(createMockH3Event())

    expect(chunk0).toHaveLength(2)
    expect(chunk1).toHaveLength(2)
    expect(chunk0[0].loc).not.toBe(chunk1[0].loc)
  })
})
