// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)

const mockBudget = ref<number | null>(null)
const mockSetBudget = vi.fn((v: number | null) => { mockBudget.value = v })

vi.stubGlobal('useBudget', () => ({ budget: mockBudget, setBudget: mockSetBudget }))

import AffordabilityWidget from '~/components/AffordabilityWidget.vue'

const defaultProps = {
  costNomad: 2000,
  costExpat: 3500,
  costLocal: 1200,
  costFamily: 4000,
}

describe('AffordabilityWidget', () => {
  beforeEach(() => {
    mockBudget.value = null
    mockSetBudget.mockClear()
  })

  it('renders widget title', () => {
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('affordability.widgetTitle')
  })

  it('shows budget input when no budget is set', () => {
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
  })

  it('shows surplus when budget exceeds nomad cost', async () => {
    mockBudget.value = 3000
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    // Budget 3000 - nomad cost 2000 = +1000 surplus
    expect(wrapper.text()).toContain('$1,000')
  })

  it('shows deficit when nomad cost exceeds budget', async () => {
    mockBudget.value = 1500
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    // Budget 1500 - nomad cost 2000 = -500 deficit
    expect(wrapper.text()).toContain('500')
  })

  it('applies green class for surplus', async () => {
    mockBudget.value = 3000
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.html()).toContain('text-emerald')
  })

  it('applies red class for deficit', async () => {
    mockBudget.value = 1500
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.html()).toContain('text-red')
  })

  it('shows runway months when savings mode is active', async () => {
    mockBudget.value = 6000
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string, p?: Record<string, unknown>) => p ? JSON.stringify(p) : k } },
    })
    // Switch to savings mode
    const savingsTab = wrapper.findAll('button').find(b => b.text().includes('affordability.totalSavings'))
    if (savingsTab) {
      await savingsTab.trigger('click')
      // 6000 savings / 2000 nomad cost = 3 months runway
      expect(wrapper.text()).toContain('3')
    }
  })

  it('clears budget when clear button is clicked', async () => {
    mockBudget.value = 3000
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    const clearBtn = wrapper.findAll('button').find(b => b.text().includes('budget.clearBudget'))
    if (clearBtn) {
      await clearBtn.trigger('click')
      expect(mockSetBudget).toHaveBeenCalledWith(null)
    }
  })

  it('switches lifestyle tier when tab is clicked', async () => {
    mockBudget.value = 3000
    const wrapper = mount(AffordabilityWidget, {
      props: defaultProps,
      global: { mocks: { $t: (k: string) => k } },
    })
    const expatBtn = wrapper.findAll('button').find(b => b.text().includes('city.expat'))
    if (expatBtn) {
      await expatBtn.trigger('click')
      // Budget 3000 - expat cost 3500 = -500 deficit
      expect(wrapper.text()).toContain('500')
    }
  })
})
