// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, watch, computed } from 'vue'
import { mount } from '@vue/test-utils'
import MonthsPicker from '~/components/MonthsPicker.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)
vi.stubGlobal('computed', computed)

const mockPush = vi.fn()

vi.stubGlobal('useRoute', () => ({ query: {} }))
vi.stubGlobal('useRouter', () => ({ push: mockPush }))
vi.stubGlobal('useCustomI18n', () => ({ t: (key: string) => key }))

vi.mock('~/shared/global.utils', () => ({
  getUserCurrentMonthString: () => '03',
}))

describe('MonthsPicker', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('emits update:modelValue instead of calling router.push in controlled mode', async () => {
    const wrapper = mount(MonthsPicker, {
      props: { modelValue: '03' },
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    // Click April (4th month button, value '04')
    const buttons = wrapper.findAll('.cursor-pointer')
    expect(buttons[3]).toBeDefined()
    await buttons[3]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['04'])
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('uses modelValue for selected state in controlled mode', () => {
    const wrapper = mount(MonthsPicker, {
      props: { modelValue: '07' },
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    // July button (index 6) should have the selected class
    const buttons = wrapper.findAll('.cursor-pointer')
    expect(buttons[6]).toBeDefined()
    expect(buttons[6]!.classes().some(c => c.includes('bg-primary-500'))).toBe(true)
  })

  it('calls router.push in standalone mode (no modelValue)', async () => {
    const wrapper = mount(MonthsPicker, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    const buttons = wrapper.findAll('.cursor-pointer')
    expect(buttons[3]).toBeDefined()
    await buttons[3]!.trigger('click')

    expect(mockPush).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})
