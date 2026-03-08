// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'

describe('useBudget', () => {
  beforeEach(async () => {
    localStorage.clear()
    const { useBudget } = await import('~/composables/useBudget')
    const { setBudget } = useBudget()
    setBudget(null)
  })

  it('starts with default budget of 1500 when localStorage is empty', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { budget } = useBudget()
    expect(budget.value).toBe(1500)
  })

  it('setBudget updates the reactive budget ref', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { budget, setBudget } = useBudget()
    setBudget(3500)
    expect(budget.value).toBe(3500)
  })

  it('setBudget persists value to localStorage', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { setBudget } = useBudget()
    setBudget(1500)
    expect(localStorage.getItem('nomad:budget')).toBe('1500')
  })

  it('setBudget(null) resets budget to default 1500', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { budget, setBudget } = useBudget()
    setBudget(5000)
    setBudget(null)
    expect(budget.value).toBe(1500)
  })

  it('setBudget(null) removes custom value from localStorage', async () => {
    const { useBudget } = await import('~/composables/useBudget')
    const { setBudget } = useBudget()
    setBudget(5000)
    setBudget(null)
    expect(localStorage.getItem('nomad:budget')).toBeNull()
  })
})
