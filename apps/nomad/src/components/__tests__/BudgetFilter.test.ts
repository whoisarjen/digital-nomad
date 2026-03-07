// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)

const mockBudget = ref<number | null>(null)
const mockSetBudget = vi.fn((v: number | null) => { mockBudget.value = v })

vi.stubGlobal('useBudget', () => ({ budget: mockBudget, setBudget: mockSetBudget }))

import BudgetFilter from '~/components/BudgetFilter.vue'

describe('BudgetFilter', () => {
  beforeEach(() => {
    mockBudget.value = null
    mockSetBudget.mockClear()
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

  it('shows clear button when budget is set', () => {
    mockBudget.value = 2000
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('budget.clearBudget')
  })

  it('does not show clear button when budget is null', () => {
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).not.toContain('budget.clearBudget')
  })

  it('calls setBudget(null) when clear button is clicked', async () => {
    mockBudget.value = 2000
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    const clearBtn = wrapper.findAll('button').find(b => b.text().includes('budget.clearBudget'))
    expect(clearBtn).toBeDefined()
    await clearBtn!.trigger('click')
    expect(mockSetBudget).toHaveBeenCalledWith(null)
  })

  it('shows current budget value when set', () => {
    mockBudget.value = 2500
    const wrapper = mount(BudgetFilter, {
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('2500')
  })
})
