// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'

describe('useBudget', () => {
  beforeEach(async () => {
    localStorage.clear()
    // Reset module state between tests
    const { useBudget } = await import('~/composables/useBudget')
    const { setBudget } = useBudget()
    setBudget(null)
  })

  it('starts with null when localStorage is empty', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { budget } = useBudget()
    expect(budget.value).toBeNull()
  })

  it('setBudget updates the reactive budget ref', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { budget, setBudget } = useBudget()
    setBudget(2000)
    expect(budget.value).toBe(2000)
  })

  it('setBudget persists value to localStorage', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { setBudget } = useBudget()
    setBudget(1500)
    expect(localStorage.getItem('nomad:budget')).toBe('1500')
  })

  it('setBudget(null) sets budget ref to null', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { budget, setBudget } = useBudget()
    setBudget(2000)
    setBudget(null)
    expect(budget.value).toBeNull()
  })

  it('setBudget(null) removes value from localStorage', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { setBudget } = useBudget()
    setBudget(2000)
    setBudget(null)
    expect(localStorage.getItem('nomad:budget')).toBeNull()
  })
})
