// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, watch, computed } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)
vi.stubGlobal('computed', computed)

const mockPush = vi.fn()

vi.stubGlobal('useRoute', () => ({ query: {} }))
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

import TemperaturesPicker from '~/components/TemperaturesPicker.vue'

describe('TemperaturesPicker', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('initializes min/max from modelValue in controlled mode', () => {
    const wrapper = mount(TemperaturesPicker, {
      props: { modelValue: ['gte:10', 'lte:30'] },
      global: { mocks: { $t: (k: string) => k } },
    })

    const inputs = wrapper.findAll('input[type="number"]')
    const minEl = inputs.at(0)!
    const maxEl = inputs.at(1)!
    expect((minEl.element as HTMLInputElement).value).toBe('10')
    expect((maxEl.element as HTMLInputElement).value).toBe('30')
  })

  it('emits update:modelValue instead of calling router.push in controlled mode', async () => {
    const wrapper = mount(TemperaturesPicker, {
      props: { modelValue: ['gte:10', 'lte:30'] },
      global: { mocks: { $t: (k: string) => k } },
    })

    const minInput = wrapper.findAll('input[type="number"]').at(0)!
    await minInput.setValue(5)
    await minInput.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['gte:5', 'lte:30']])
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('calls router.push in standalone mode (no modelValue)', async () => {
    const wrapper = mount(TemperaturesPicker, {
      global: { mocks: { $t: (k: string) => k } },
    })

    const maxInput = wrapper.findAll('input[type="number"]').at(1)!
    await maxInput.setValue(40)
    await maxInput.trigger('input')

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          temperatures: ['gte:-50', 'lte:40'],
        }),
      }),
    )
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('syncs values when modelValue prop changes', async () => {
    const wrapper = mount(TemperaturesPicker, {
      props: { modelValue: ['gte:10', 'lte:30'] },
      global: { mocks: { $t: (k: string) => k } },
    })

    await wrapper.setProps({ modelValue: ['gte:5', 'lte:25'] })

    const inputs = wrapper.findAll('input[type="number"]')
    expect((inputs.at(0)!.element as HTMLInputElement).value).toBe('5')
    expect((inputs.at(1)!.element as HTMLInputElement).value).toBe('25')
  })
})
