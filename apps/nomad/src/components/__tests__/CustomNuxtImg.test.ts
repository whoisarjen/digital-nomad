// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomNuxtImg from '~/components/CustomNuxtImg.vue'

const NuxtImgStub = { template: '<img v-bind="$attrs" />', inheritAttrs: false }
const mountOptions = { global: { stubs: { NuxtImg: NuxtImgStub } } }

const FULL_URL = 'https://images.unsplash.com/photo-123?ixid=abc'
const defaultProps = { src: FULL_URL, alt: 'Test image' }

describe('CustomNuxtImg', () => {
  it('renders an img element', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps, ...mountOptions })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('strips the Unsplash base URL from src', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps, ...mountOptions })
    expect(wrapper.find('img').attributes('src')).toBe('/photo-123?ixid=abc')
  })

  it('passes a path src through unchanged', () => {
    const wrapper = mount(CustomNuxtImg, { props: { src: '/photo-456', alt: 'x' }, ...mountOptions })
    expect(wrapper.find('img').attributes('src')).toBe('/photo-456')
  })

  it('sets loading="lazy" by default', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps, ...mountOptions })
    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })

  it('accepts loading="eager" override', () => {
    const wrapper = mount(CustomNuxtImg, { props: { ...defaultProps, loading: 'eager' }, ...mountOptions })
    expect(wrapper.find('img').attributes('loading')).toBe('eager')
  })

  it('forwards alt to the img element', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps, ...mountOptions })
    expect(wrapper.find('img').attributes('alt')).toBe('Test image')
  })

  it('does not set a preload attribute', () => {
    const wrapper = mount(CustomNuxtImg, { props: defaultProps, ...mountOptions })
    expect(wrapper.find('img').attributes('preload')).toBeUndefined()
  })

})
