import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  buildSitemapAlternatives: (variants: { lang: string; loc: string }[]) => [
    ...variants.map((v) => ({ hreflang: v.lang, href: v.loc })),
    { hreflang: 'x-default', href: variants[0]!.loc },
  ],
}))

describe('GET /api/__sitemap__/regions', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/regions')
  })

  it('entries do not include _sitemap field', async () => {
    const result = await handler.default(createMockH3Event())

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    for (const entry of result) {
      expect(entry).not.toHaveProperty('_sitemap')
    }
  })

  it('entries include loc and alternatives', async () => {
    const result = await handler.default(createMockH3Event())

    expect(result[0]).toHaveProperty('loc')
    expect(result[0]).toHaveProperty('alternatives')
  })
})
