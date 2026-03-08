import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    country: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  buildLocalizedEntries: (buildLoc: (lang: string) => string) => [
    { loc: buildLoc('en'), alternatives: [] },
  ],
}))

describe('GET /api/__sitemap__/countries', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/countries')
  })

  it('entries do not include _sitemap field', async () => {
    prismaMock.country.findMany.mockResolvedValue([{ slug: 'thailand' }])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('entries include loc and alternatives', async () => {
    prismaMock.country.findMany.mockResolvedValue([{ slug: 'portugal' }])

    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('alternatives')
  })
})
