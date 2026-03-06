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

describe('GET /api/__sitemap__/countries', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/countries')
  })

  it('entries do not include _sitemap field', async () => {
    prismaMock.city.findMany.mockResolvedValue([{ countrySlug: 'thailand' }])

    const result = await handler.default(createMockH3Event())

    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('entries include loc and alternatives', async () => {
    prismaMock.city.findMany.mockResolvedValue([{ countrySlug: 'portugal' }])

    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('alternatives')
  })
})
