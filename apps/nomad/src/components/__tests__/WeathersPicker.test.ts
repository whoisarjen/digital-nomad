// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, watch } from 'vue'
import { mount } from '@vue/test-utils'
import WeathersPicker from '~/components/WeathersPicker.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)

const mockPush = vi.fn()

vi.stubGlobal('useRoute', () => ({ query: { weathers: 'SUN' } }))
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

describe('WeathersPicker', () => {
  beforeEach(() => {
    mockPush.mockClear()
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
