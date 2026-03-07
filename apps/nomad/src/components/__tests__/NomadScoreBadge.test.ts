// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NomadScoreBadge from '~/components/NomadScoreBadge.vue'

describe('NomadScoreBadge', () => {
  it('renders the score', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 4 } })
    expect(wrapper.text()).toContain('4')
  })

  it('applies green class for score >= 4', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 4 } })
    expect(wrapper.html()).toContain('green')
  })

  it('applies yellow class for score === 3', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 3 } })
    expect(wrapper.html()).toContain('yellow')
  })

  it('applies red class for score <= 2', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 2 } })
    expect(wrapper.html()).toContain('red')
  })
})
