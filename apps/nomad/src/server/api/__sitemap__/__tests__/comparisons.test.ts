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
  buildLocalizedEntries: (buildLoc: (lang: string) => string) => [
    { loc: buildLoc('en'), alternatives: [] },
  ],
}))

describe('GET /api/__sitemap__/comparisons', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/comparisons')
  })

  it('entries do not include _sitemap field', async () => {
    getQueryMock.mockReturnValue({ chunk: '0', total: '2' })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'bangkok' },
      { slug: 'barcelona' },
      { slug: 'lisbon' },
    ])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('only processes cities in the given chunk', async () => {
    getQueryMock.mockReturnValue({ chunk: '0', total: '2' })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'a' },
      { slug: 'b' },
      { slug: 'c' },
      { slug: 'd' },
    ])

    const chunk0Result = await handler.default(createMockH3Event())

    getQueryMock.mockReturnValue({ chunk: '1', total: '2' })
    const chunk1Result = await handler.default(createMockH3Event())

    // Chunks should cover different city pairings
    expect(chunk0Result.length).toBeGreaterThan(0)
    expect(chunk1Result.length).toBeGreaterThan(0)

    // Combined should equal full coverage
    const allLocs = new Set([
      ...chunk0Result.map((e: { loc: string }) => e.loc),
      ...chunk1Result.map((e: { loc: string }) => e.loc),
    ])
    const chunk0Locs = new Set(chunk0Result.map((e: { loc: string }) => e.loc))
    const chunk1Locs = new Set(chunk1Result.map((e: { loc: string }) => e.loc))
    expect(allLocs.size).toBe(chunk0Locs.size + chunk1Locs.size) // no overlap
  })

  it('entries include loc and alternatives', async () => {
    getQueryMock.mockReturnValue({ chunk: '0', total: '1' })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'paris' },
      { slug: 'berlin' },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('alternatives')
  })
})
