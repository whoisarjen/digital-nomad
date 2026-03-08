// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed, reactive, watch, onMounted, onUnmounted, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('watch', watch)
vi.stubGlobal('onMounted', onMounted)
vi.stubGlobal('onUnmounted', onUnmounted)

const mockRoute = reactive({ query: {} as Record<string, string | string[] | undefined> })
const mockPush = vi.fn()
vi.stubGlobal('useRoute', () => mockRoute)
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

import FiltersDrawer from '~/components/FiltersDrawer.vue'

const AuthGateStub = defineComponent({
  setup(_, { slots }) {
    return () => slots.default?.({ isLocked: false })
  },
})

const stubComponent = { template: '<div />' }

describe('FiltersDrawer', () => {
  beforeEach(() => {
    mockRoute.query = {}
    mockPush.mockClear()
    document.body.style.overflow = ''
  })

  const mountDrawer = (props: Partial<Record<string, unknown>> = {}) =>
    mount(FiltersDrawer, {
      props: {
        modelValue: true,
        pickers: null,
        activeFilterCount: 0,
        isFavoritesActive: false,
        ...props,
      },
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          Teleport: true,
          Transition: false,
          AuthGate: AuthGateStub,
          WeathersPicker: stubComponent,
          MonthsPicker: stubComponent,
          TemperaturesPicker: stubComponent,
          BudgetFilter: stubComponent,
          RegionsPicker: stubComponent,
          SinglePicker: stubComponent,
          LucideX: stubComponent,
          LucideHeart: stubComponent,
          LucideCheck: stubComponent,
          LucideLock: stubComponent,
        },
      },
    })

  it('renders the "Show results" button', () => {
    const wrapper = mountDrawer()
    const buttons = wrapper.findAll('button')
    const showResultsBtn = buttons.find(b => b.text().includes('Show results'))
    expect(showResultsBtn).toBeTruthy()
  })

  it('renders the filters title', () => {
    const wrapper = mountDrawer()
    expect(wrapper.text()).toContain('filters.title')
  })

  it('initializes draftQuery from route.query on open', () => {
    mockRoute.query = { weathers: ['SUN', 'CLOUD'], months: '06' }
    const wrapper = mountDrawer()
    const badge = wrapper.find('.bg-accent-500')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('2')
  })

  it('applyAndClose pushes draftQuery to router and closes', async () => {
    mockRoute.query = { weathers: 'SUN' }
    const wrapper = mountDrawer()
    const buttons = wrapper.findAll('button')
    const showResultsBtn = buttons.find(b => b.text().includes('Show results'))
    await showResultsBtn!.trigger('click')

    expect(mockPush).toHaveBeenCalledWith({
      query: { weathers: 'SUN', page: undefined },
    })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('clearAndClose resets draft, emits clearFilters, and closes', async () => {
    mockRoute.query = { weathers: 'SUN' }
    const wrapper = mountDrawer({ activeFilterCount: 1 })
    const buttons = wrapper.findAll('button')
    const clearBtn = buttons.find(b => b.text().includes('filters.clear'))
    await clearBtn!.trigger('click')

    expect(wrapper.emitted('clearFilters')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('does not push to router until "Show results" is clicked', () => {
    mockRoute.query = {}
    mountDrawer()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows draftFilterCount in badge based on draftQuery, not activeFilterCount prop', () => {
    mockRoute.query = { weathers: 'SUN', months: '06' }
    const wrapper = mountDrawer({ activeFilterCount: 0 })
    const badge = wrapper.find('.bg-accent-500')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('2')
  })

  it('disables clear button when draftFilterCount is 0', () => {
    mockRoute.query = {}
    const wrapper = mountDrawer()
    const buttons = wrapper.findAll('button')
    const clearBtn = buttons.find(b => b.text().includes('filters.clear'))
    expect(clearBtn!.attributes('disabled')).toBeDefined()
  })
})
