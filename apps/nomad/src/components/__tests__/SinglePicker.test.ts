// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed, reactive, watch } from 'vue'
import { mount } from '@vue/test-utils'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('watch', watch)

const mockRoute = reactive({ query: {} as Record<string, string | undefined> })
const mockPush = vi.fn()
vi.stubGlobal('useRoute', () => mockRoute)
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

vi.stubGlobal('lucideChevronDown', {
  template: '<span />',
})

import SinglePicker from '~/components/SinglePicker.vue'

const testOptions = [
  { label: 'Low', value: '1' },
  { label: 'Medium', value: '2' },
  { label: 'High', value: '3' },
]

describe('SinglePicker', () => {
  beforeEach(() => {
    mockRoute.query = {}
    mockPush.mockClear()
  })

  describe('standalone mode (no modelValue)', () => {
    it('reads initial value from route query', () => {
      mockRoute.query = { safety: '2' }
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions },
      })
      const select = wrapper.find('select').element as HTMLSelectElement
      expect(select.value).toBe('2')
    })

    it('calls router.push on change', async () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions },
      })
      await wrapper.find('select').setValue('3')
      expect(mockPush).toHaveBeenCalledWith({
        query: expect.objectContaining({ safety: '3' }),
      })
    })

    it('does not emit update:modelValue on change', async () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions },
      })
      await wrapper.find('select').setValue('3')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('controlled mode (with modelValue)', () => {
    it('uses modelValue as initial selected value', () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions, modelValue: '2' },
      })
      const select = wrapper.find('select').element as HTMLSelectElement
      expect(select.value).toBe('2')
    })

    it('uses default value when modelValue is -1', () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions, modelValue: '-1' },
      })
      const select = wrapper.find('select').element as HTMLSelectElement
      expect(select.value).toBe('-1')
    })

    it('emits update:modelValue on change', async () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions, modelValue: '-1' },
      })
      await wrapper.find('select').setValue('2')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2'])
    })

    it('does not call router.push on change', async () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions, modelValue: '-1' },
      })
      await wrapper.find('select').setValue('2')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('syncs selectedOption when modelValue prop changes', async () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions, modelValue: '-1' },
      })
      await wrapper.setProps({ modelValue: '3' })
      const select = wrapper.find('select').element as HTMLSelectElement
      expect(select.value).toBe('3')
    })

    it('ignores route query changes in controlled mode', async () => {
      const wrapper = mount(SinglePicker, {
        props: { name: 'safety', operation: 'gte', options: testOptions, modelValue: '2' },
      })
      mockRoute.query = { safety: '3' }
      await wrapper.vm.$nextTick()
      const select = wrapper.find('select').element as HTMLSelectElement
      expect(select.value).toBe('2')
    })
  })
})
