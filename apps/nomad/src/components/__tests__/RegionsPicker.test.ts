// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, watch, computed } from 'vue'
import { mount } from '@vue/test-utils'
import RegionsPicker from '~/components/RegionsPicker.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)
vi.stubGlobal('computed', computed)

const mockPush = vi.fn()

vi.stubGlobal('useRoute', () => ({ query: { regions: 'Europe' } }))
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

describe('RegionsPicker', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('passes undefined (not []) to router when all regions are deselected', async () => {
    const wrapper = mount(RegionsPicker, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    // Europe is currently selected (route.query.regions = 'Europe')
    // Click it to deselect — newSelections becomes []
    await wrapper.find('.bg-primary-50').trigger('click')

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ regions: undefined }),
      }),
    )
  })

  it('emits update:modelValue instead of router.push in controlled mode', async () => {
    const wrapper = mount(RegionsPicker, {
      props: {
        modelValue: [],
      },
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    // Click the first region button
    const firstButton = wrapper.findAll('[class*="cursor-pointer"]')[0]
    expect(firstButton).toBeDefined()
    await firstButton!.trigger('click')

    expect(mockPush).not.toHaveBeenCalled()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Array)
    expect((emitted![0]![0] as string[]).length).toBe(1)
  })

  it('reflects modelValue prop as selected options in controlled mode', async () => {
    const wrapper = mount(RegionsPicker, {
      props: {
        modelValue: ['Europe'],
      },
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    // Europe should be highlighted
    expect(wrapper.findAll('.bg-primary-50').length).toBe(1)
  })
})
