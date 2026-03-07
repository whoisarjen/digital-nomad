import { describe, it, expect } from 'vitest'
import { getHtmlDir } from '~/utils/i18n-content'

describe('getHtmlDir', () => {
  it('returns rtl for Arabic', () => {
    expect(getHtmlDir('ar')).toBe('rtl')
  })

  it('returns ltr for non-RTL locales', () => {
    expect(getHtmlDir('en')).toBe('ltr')
    expect(getHtmlDir('pl')).toBe('ltr')
    expect(getHtmlDir('ja')).toBe('ltr')
  })
})
