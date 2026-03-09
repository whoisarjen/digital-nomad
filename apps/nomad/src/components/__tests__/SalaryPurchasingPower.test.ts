// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { ref, computed } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)

vi.stubGlobal('useI18n', () => ({
  t: (k: string, params?: Record<string, unknown>) =>
    params ? Object.entries(params).reduce((s, [k2, v]) => s.replace(`{${k2}}`, String(v)), k) : k,
  locale: { value: 'en' },
}))

vi.stubGlobal('useCurrency', () => ({
  formatCost: (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
}))

import SalaryPurchasingPower from '~/components/SalaryPurchasingPower.vue'

describe('SalaryPurchasingPower', () => {
  it('renders nothing when salary is null', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: null, nomadCost: 1200 },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('[data-testid="salary-power"]').exists()).toBe(false)
  })

  it('renders nothing when nomadCost is null', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: 707, nomadCost: null },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('[data-testid="salary-power"]').exists()).toBe(false)
  })

  it('renders nothing when both are null', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: null, nomadCost: null },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('[data-testid="salary-power"]').exists()).toBe(false)
  })

  it('shows the ratio when salary is less than nomad cost', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: 707, nomadCost: 1200 },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('[data-testid="salary-power"]').exists()).toBe(true)
    // ratio = 1200 / 707 ≈ 1.7
    expect(wrapper.text()).toContain('1.7×')
  })

  it('shows ratio = 0.6× when salary is greater than nomad cost', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: 2000, nomadCost: 1200 },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.find('[data-testid="salary-power"]').exists()).toBe(true)
    // ratio = 1200 / 2000 = 0.6
    expect(wrapper.text()).toContain('0.6×')
  })

  it('displays local salary formatted value', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: 707, nomadCost: 1200 },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('$707')
  })

  it('displays nomad cost formatted value', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: 707, nomadCost: 1200 },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('$1,200')
  })

  it('shows ratio = 1.0× when salary equals nomad cost', () => {
    const wrapper = mount(SalaryPurchasingPower, {
      props: { salary: 1000, nomadCost: 1000 },
      global: { mocks: { $t: (k: string) => k } },
    })
    expect(wrapper.text()).toContain('1.0×')
  })
})
