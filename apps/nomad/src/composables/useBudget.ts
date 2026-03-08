import { ref } from 'vue'

const STORAGE_KEY = 'nomad:budget'
const DEFAULT_BUDGET = 1500

const budget = ref<number>(DEFAULT_BUDGET)
const budgetActive = ref(false)

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) budget.value = Number(stored)
}

export function useBudget() {
  function setBudget(v: number | null) {
    if (v === null) {
      budget.value = DEFAULT_BUDGET
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    } else {
      budget.value = v
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(v))
      }
    }
  }

  function toggleBudget() {
    budgetActive.value = !budgetActive.value
  }

  return { budget, budgetActive, setBudget, toggleBudget }
}
