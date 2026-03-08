// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed, reactive, getCurrentInstance } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('getCurrentInstance', getCurrentInstance)

const mockBudget = ref<number>(2000)
const mockSetBudget = vi.fn((v: number | null) => { mockBudget.value = v ?? 2000 })
vi.stubGlobal('useBudget', () => ({ budget: mockBudget, setBudget: mockSetBudget }))

const mockRoute = reactive({ query: {} as Record<string, any> })
const mockPush = vi.fn()
vi.stubGlobal('useRoute', () => mockRoute)
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

import BudgetFilter from '~/components/BudgetFilter.vue'

describe('BudgetFilter', () => {
  beforeEach(() => {
    mockBudget.value = 2000
    mockSetBudget.mockClear()
    mockRoute.query = {}
    mockPush.mockClear()
  })

  it('renders label', () => {
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('budget.filterLabel')
  })

  it('renders a range slider input', () => {
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('input[type="range"]').exists()).toBe(true)
  })

  it('calls setBudget when slider changes', async () => {
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    const slider = wrapper.find('input[type="range"]')
    await slider.setValue('3000')
    await slider.trigger('input')
    expect(mockSetBudget).toHaveBeenCalledWith(3000)
  })

  it('shows current budget value', () => {
    mockBudget.value = 2500
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('2,500')
  })

  it('does not show a clear button', () => {
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).not.toContain('budget.clearBudget')
  })

  it('renders a "show only affordable" toggle', () => {
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('toggle is unchecked when prices filter is not in query', () => {
    mockRoute.query = {}
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('toggle is checked when costs filter is active in query', () => {
    mockRoute.query = { costs: '2000' }
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('checking the toggle adds costs filter to query', async () => {
    mockRoute.query = {}
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(mockPush).toHaveBeenCalledWith({ query: { costs: '2000' } })
  })

  it('unchecking the toggle removes costs filter from query', async () => {
    mockRoute.query = { costs: '2000' }
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    await wrapper.find('input[type="checkbox"]').setValue(false)
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(mockPush).toHaveBeenCalledWith({ query: {} })
  })

  describe('controlled mode (with modelValue)', () => {
    it('checkbox reflects modelValue instead of route.query', () => {
      mockRoute.query = {}
      const wrapper = mount(BudgetFilter, {
        props: { modelValue: '1500' },
        global: { mocks: { $t: (k: string) => k } },
      })
      const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
      expect(checkbox.checked).toBe(true)
    })

    it('checkbox is unchecked when modelValue is undefined', () => {
      mockRoute.query = { costs: '2000' }
      const wrapper = mount(BudgetFilter, {
        props: { modelValue: undefined },
        global: { mocks: { $t: (k: string) => k } },
      })
      const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
      expect(checkbox.checked).toBe(false)
    })

    it('checking toggle emits update:modelValue with costs string', async () => {
      const wrapper = mount(BudgetFilter, {
        props: { modelValue: undefined },
        global: { mocks: { $t: (k: string) => k } },
      })
      await wrapper.find('input[type="checkbox"]').setValue(true)
      await wrapper.find('input[type="checkbox"]').trigger('change')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2000'])
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('unchecking toggle emits update:modelValue with undefined', async () => {
      const wrapper = mount(BudgetFilter, {
        props: { modelValue: '2000' },
        global: { mocks: { $t: (k: string) => k } },
      })
      await wrapper.find('input[type="checkbox"]').setValue(false)
      await wrapper.find('input[type="checkbox"]').trigger('change')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([undefined])
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('slider input emits update:modelValue when filter is active', async () => {
      const wrapper = mount(BudgetFilter, {
        props: { modelValue: '2000' },
        global: { mocks: { $t: (k: string) => k } },
      })
      const slider = wrapper.find('input[type="range"]')
      await slider.setValue('3000')
      await slider.trigger('input')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['3000'])
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('slider input does not emit when filter is not active in controlled mode', async () => {
      const wrapper = mount(BudgetFilter, {
        props: { modelValue: undefined },
        global: { mocks: { $t: (k: string) => k } },
      })
      const slider = wrapper.find('input[type="range"]')
      await slider.setValue('3000')
      await slider.trigger('input')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })
})
