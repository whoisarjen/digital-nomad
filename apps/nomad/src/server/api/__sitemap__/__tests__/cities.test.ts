import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  buildSitemapAlternatives: (variants: { lang: string; loc: string }[]) => [
    ...variants.map((v) => ({ hreflang: v.lang, href: v.loc })),
    { hreflang: 'x-default', href: variants[0]!.loc },
  ],
}))

describe('GET /api/__sitemap__/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/cities')
  })

  it('returns one entry per language for each city', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'bangkok', updatedAt: new Date('2024-01-01') },
    ])

    const result = await handler.default(createMockH3Event())

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(1)
  })

  it('entries do not include _sitemap field', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'barcelona', updatedAt: new Date('2024-06-01') },
    ])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('entries include loc, lastmod, and alternatives', async () => {
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'lisbon', updatedAt: new Date('2024-03-15') },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('lastmod')
    expect(result[0]).toHaveProperty('alternatives')
    expect(Array.isArray(result[0].alternatives)).toBe(true)
  })
})
