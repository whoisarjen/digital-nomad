// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import App from '~/app.vue'

const useHeadSpy = vi.fn()

const mockI18nHead = ref({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: 'https://nomad.whoisarjen.com/regions/europe' },
    { rel: 'alternate', hreflang: 'en', href: 'https://nomad.whoisarjen.com/regions/europe' },
    { rel: 'alternate', hreflang: 'pl', href: 'https://nomad.whoisarjen.com/pl/regiony/europe' },
  ],
  meta: [
    { property: 'og:locale', content: 'en_US' },
  ],
})

vi.stubGlobal('ref', ref)
vi.stubGlobal('useHead', useHeadSpy)
vi.stubGlobal('useLocaleHead', () => mockI18nHead)
vi.stubGlobal('useSchemaOrg', vi.fn())
vi.stubGlobal('defineWebSite', vi.fn())
vi.stubGlobal('defineWebPage', vi.fn())
vi.stubGlobal('getHtmlDir', () => 'ltr')

describe('app.vue', () => {
  beforeEach(() => {
    useHeadSpy.mockClear()
  })

  it('passes link tags from useLocaleHead into useHead', () => {
    mount(App, {
      global: {
        stubs: { NuxtLayout: true, NuxtPage: true },
      },
    })

    expect(useHeadSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        link: expect.any(Function),
      }),
    )

    const headArgs = useHeadSpy.mock.calls[0]?.[0]
    const links = headArgs?.link?.()
    expect(links).toEqual(mockI18nHead.value.link)
  })

  it('passes meta tags from useLocaleHead into useHead', () => {
    mount(App, {
      global: {
        stubs: { NuxtLayout: true, NuxtPage: true },
      },
    })

    const headArgs = useHeadSpy.mock.calls[0]?.[0]
    const metas = headArgs?.meta?.()
    expect(metas).toEqual(mockI18nHead.value.meta)
  })
})
