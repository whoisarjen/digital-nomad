import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  buildLocalizedEntries: (buildLoc: (lang: string) => string, extra?: object) => [
    { loc: buildLoc('en'), ...extra, alternatives: [] },
  ],
}))

describe('GET /api/__sitemap__/best-cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/best-cities')
  })

  it('returns 12 entries — one per month', async () => {
    const result = await handler.default(createMockH3Event())
    expect(result).toHaveLength(12)
  })

  it('first entry points to /best-cities/january', async () => {
    const result = await handler.default(createMockH3Event())
    expect(result[0].loc).toBe('/best-cities/january')
  })

  it('last entry points to /best-cities/december', async () => {
    const result = await handler.default(createMockH3Event())
    expect(result[result.length - 1].loc).toBe('/best-cities/december')
  })
})
