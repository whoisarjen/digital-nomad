import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    article: { findMany: vi.fn() },
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

describe('GET /api/__sitemap__/articles', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/articles')
  })

  it('entries do not include _sitemap field', async () => {
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'how-to-find-nomad-cities', updatedAt: new Date('2024-05-01') },
    ])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('entries include loc, lastmod, and alternatives', async () => {
    prismaMock.article.findMany.mockResolvedValue([
      { slug: 'nomad-guide', updatedAt: new Date('2024-02-01') },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('lastmod')
    expect(result[0]).toHaveProperty('alternatives')
  })
})
