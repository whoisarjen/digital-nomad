import { describe, it, expect, vi } from 'vitest'
import { ref, computed, watch, nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import type { SearchResult } from '~/composables/useSearch'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('watch', watch)
vi.stubGlobal('nextTick', nextTick)
vi.stubGlobal('onMounted', onMounted)
vi.stubGlobal('onUnmounted', onUnmounted)
vi.stubGlobal('useLocalePath', () => (path: string) => path)

const mockResults: SearchResult[] = [
  { slug: 'barcelona', name: 'Barcelona', country: 'Spain', costForNomadInUsd: 2100 },
]

vi.mock('~/composables/useSearch', () => ({
  useSearch: (_query: Ref<string>) => ({
    results: computed(() => _query.value.trim() ? mockResults : []),
    isLoading: ref(false),
  }),
}))

import AppSearchPanel from '~/components/AppSearchPanel.vue'

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  Transition: { template: '<div><slot /></div>' },
}

describe('AppSearchPanel', () => {
  it('renders the search input when open', async () => {
    const wrapper = mount(AppSearchPanel, {
      props: { open: true },
      global: { mocks: { $t: (k: string) => k }, stubs },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders city results when query has text', async () => {
    const wrapper = mount(AppSearchPanel, {
      props: { open: true },
      global: { mocks: { $t: (k: string) => k }, stubs },
    })
    await wrapper.find('input[type="text"]').setValue('bar')
    await nextTick()
    expect(wrapper.text()).toContain('Barcelona')
    expect(wrapper.text()).toContain('Spain')
  })

  it('emits close when Escape is pressed on the input', async () => {
    const wrapper = mount(AppSearchPanel, {
      props: { open: true },
      global: { mocks: { $t: (k: string) => k }, stubs },
    })
    await wrapper.find('input[type="text"]').trigger('keydown.esc')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not render search input when open is false', async () => {
    const wrapper = mount(AppSearchPanel, {
      props: { open: false },
      global: { mocks: { $t: (k: string) => k }, stubs },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(false)
  })
})
