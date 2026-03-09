// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, computed } from 'vue'

// Stub Vue auto-imports that Nuxt provides globally
vi.stubGlobal('computed', computed)

// Stub useCurrency before importing the component
vi.stubGlobal('useCurrency', () => ({
  formatCost: (v: number) => `$${v.toFixed(2)}`,
}))

// Stub Lucide icons that are resolved as global components
const IconStub = defineComponent({ template: '<span />' })

import ComparePriceTable from '~/components/ComparePriceTable.vue'

const makeCity = (overrides: Record<string, string | null> = {}) => ({
  mealInexpensiveRestaurant: '10.00',
  mealMidRangeRestaurant: '30.00',
  mcMeal: '8.00',
  cappuccino: '3.50',
  domesticBeerRestaurant: '4.00',
  importedBeerRestaurant: '5.00',
  cokeRestaurant: '2.00',
  waterRestaurant: '1.00',
  milk1L: '1.50',
  bread500g: '2.00',
  rice1kg: '1.80',
  eggs12: '3.00',
  chickenFillets1kg: '7.00',
  beefRound1kg: '12.00',
  localCheese1kg: '8.00',
  apples1kg: '2.00',
  banana1kg: '1.20',
  oranges1kg: '1.80',
  tomato1kg: '1.50',
  potato1kg: '1.00',
  onion1kg: '0.90',
  lettuce: '1.20',
  water15L: '0.80',
  wineBottleMidRange: '8.00',
  domesticBeerMarket: '1.50',
  importedBeerMarket: '2.50',
  cigarettes20Pack: '6.00',
  oneWayTicket: '1.80',
  monthlyTransportPass: '50.00',
  taxiStart: '2.00',
  taxi1km: '1.20',
  taxi1hourWaiting: '15.00',
  gasoline1L: '1.60',
  volkswagenGolf: '28000.00',
  toyotaCorolla: '25000.00',
  utilitiesMonthly85m2: '120.00',
  mobileMinutePrepaid: '0.10',
  internet60mbps: '30.00',
  fitnessClubMonthly: '40.00',
  tennisCourt1h: '15.00',
  cinema1seat: '12.00',
  preschoolMonthly: '400.00',
  internationalPrimarySchoolYearly: '8000.00',
  jeans: '60.00',
  summerDress: '35.00',
  nikeShoes: '80.00',
  leatherBusinessShoes: '100.00',
  apartment1brCentre: '1200.00',
  apartment1brOutside: '800.00',
  apartment3brCentre: '2200.00',
  apartment3brOutside: '1400.00',
  pricePerM2Centre: '5000.00',
  pricePerM2Outside: '3000.00',
  averageMonthlyNetSalary: '3000.00',
  mortgageInterestRate: '3.50',
  ...overrides,
})

const defaultProps = {
  cityAName: 'Barcelona',
  cityBName: 'Lisbon',
  cityAPrices: makeCity(),
  cityBPrices: makeCity({ mealInexpensiveRestaurant: '8.00' }),
}

describe('ComparePriceTable', () => {
  it('renders the component', () => {
    const wrapper = mount(ComparePriceTable, {
      props: defaultProps,
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders city names in column headers', () => {
    const wrapper = mount(ComparePriceTable, {
      props: defaultProps,
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    expect(wrapper.text()).toContain('Barcelona')
    expect(wrapper.text()).toContain('Lisbon')
  })

  it('renders category headers', () => {
    const wrapper = mount(ComparePriceTable, {
      props: defaultProps,
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    expect(wrapper.text()).toContain('costBreakdown.cat.restaurants')
  })

  it('skips rows where both values are null', () => {
    const pricesWithNull = makeCity({
      mealInexpensiveRestaurant: null,
    })
    const wrapper = mount(ComparePriceTable, {
      props: {
        ...defaultProps,
        cityAPrices: pricesWithNull,
        cityBPrices: makeCity({ mealInexpensiveRestaurant: null }),
      },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    // The null row for mealInexpensive should not render a price cell
    const rows = wrapper.findAll('[data-testid="price-row"]')
    const rowTexts = rows.map(r => r.text())
    expect(rowTexts.some(t => t.includes('costBreakdown.items.mealInexpensive'))).toBe(false)
  })

  it('shows a % diff column', () => {
    const wrapper = mount(ComparePriceTable, {
      props: defaultProps,
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    // Barcelona meal = 10, Lisbon meal = 8, diff = 20%
    expect(wrapper.text()).toContain('20%')
  })

  it('highlights the cheaper city with a green tint class', () => {
    const wrapper = mount(ComparePriceTable, {
      props: defaultProps,
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    // Lisbon mealInexpensive is 8 vs Barcelona's 10, so Lisbon is cheaper
    const html = wrapper.html()
    expect(html).toContain('cheaper-b')
  })

  it('shows — when one city value is null but the other is not', () => {
    const wrapper = mount(ComparePriceTable, {
      props: {
        ...defaultProps,
        cityAPrices: makeCity({ mealInexpensiveRestaurant: null }),
      },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { LucideBarChart2: IconStub, LucideInfo: IconStub },
      },
    })
    expect(wrapper.text()).toContain('—')
  })
})
