import { describe, it, expect } from 'vitest'
import { buildSitemapAlternatives, buildLocalizedEntries } from '~/server/utils/sitemap.utils.server'

describe('buildSitemapAlternatives', () => {
  it('returns empty array for single variant', () => {
    expect(buildSitemapAlternatives([{ lang: 'en', loc: '/cities/bangkok' }])).toEqual([])
  })

  it('includes x-default pointing to en variant', () => {
    const result = buildSitemapAlternatives([
      { lang: 'en', loc: '/cities/bangkok' },
      { lang: 'pl', loc: '/pl/cities/bangkok' },
    ])
    expect(result).toContainEqual({ hreflang: 'x-default', href: '/cities/bangkok' })
  })
})

describe('buildLocalizedEntries', () => {
  it('generates one entry per language', () => {
    const entries = buildLocalizedEntries((lang) => `${lang !== 'en' ? `/${lang}` : ''}/cities/bangkok`)
    expect(entries.length).toBeGreaterThan(1)
    expect(entries[0]).toHaveProperty('loc')
    expect(entries[0]).toHaveProperty('alternatives')
  })

  it('includes extra fields on each entry', () => {
    const entries = buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/cities/bangkok`,
      { lastmod: '2024-01-01' },
    )
    for (const entry of entries) {
      expect(entry).toHaveProperty('lastmod', '2024-01-01')
    }
  })

  it('does not include extra fields when not provided', () => {
    const entries = buildLocalizedEntries((lang) => `/${lang}/regions/europe`)
    expect(entries[0]).not.toHaveProperty('lastmod')
  })
})
