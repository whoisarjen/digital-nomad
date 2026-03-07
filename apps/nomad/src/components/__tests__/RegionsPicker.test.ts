// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, watch } from 'vue'
import { mount } from '@vue/test-utils'
import RegionsPicker from '~/components/RegionsPicker.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)

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
})
