// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed, ref, watch } from 'vue'
import { mount } from '@vue/test-utils'
import WeathersPicker from '~/components/WeathersPicker.vue'

vi.stubGlobal('computed', computed)
vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)

const mockPush = vi.fn()

vi.stubGlobal('useRoute', () => ({ query: { weathers: 'SUN' } }))
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

describe('WeathersPicker', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('emits update:modelValue instead of calling router.push in controlled mode', async () => {
    const wrapper = mount(WeathersPicker, {
      props: { modelValue: ['SUN'] },
      global: {
        mocks: { $t: (key: string) => key },
        stubs: { WeatherIcon: { template: '<span />' } },
      },
    })

    // Find the CLOUDY button (second weather option, not selected)
    const buttons = wrapper.findAll('.cursor-pointer')
    const cloudyButton = buttons.at(1)!
    await cloudyButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['SUN', 'CLOUDY']])
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('passes undefined (not []) to router when all weathers are deselected', async () => {
    const wrapper = mount(WeathersPicker, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: { WeatherIcon: { template: '<span />' } },
      },
    })

    // SUN is currently selected (route.query.weathers = 'SUN')
    // Click it to deselect — newSelections becomes []
    await wrapper.find('.bg-primary-50').trigger('click')

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ weathers: undefined }),
      }),
    )
  })
})
