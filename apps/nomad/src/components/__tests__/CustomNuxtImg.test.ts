// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomNuxtImg from '~/components/CustomNuxtImg.vue'

const defaultProps = { src: '/test.jpg', alt: 'Test image' }

describe('CustomNuxtImg', () => {
  it('renders an img element', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('sets loading="lazy" by default', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps })
    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })

  it('accepts loading="eager" override', () => {
    const wrapper = mount(CustomNuxtImg, { props: { ...defaultProps, loading: 'eager' } })
    expect(wrapper.find('img').attributes('loading')).toBe('eager')
  })

  it('forwards src and alt to the img element', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/test.jpg')
    expect(img.attributes('alt')).toBe('Test image')
  })

  it('does not set a preload attribute', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps })
    expect(wrapper.find('img').attributes('preload')).toBeUndefined()
  })

  it('starts without is-loaded class (placeholder visible)', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps })
    expect(wrapper.find('img').classes()).not.toContain('is-loaded')
  })

  it('adds is-loaded class after load event fires', async () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps })
    await wrapper.find('img').trigger('load')
    expect(wrapper.find('img').classes()).toContain('is-loaded')
  })
})
