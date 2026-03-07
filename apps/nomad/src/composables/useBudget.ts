import { ref } from 'vue'

const STORAGE_KEY = 'nomad:budget'

const budget = ref<number | null>(null)

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  budget.value = stored !== null ? Number(stored) : null
}

export function useBudget() {
  function setBudget(v: number | null) {
    budget.value = v
    if (typeof window !== 'undefined') {
      if (v === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, String(v))
      }
    }
  }

  return { budget, setBudget }
}
