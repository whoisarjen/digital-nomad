import { ref, watch, type Ref } from 'vue'

export interface SearchResult {
  slug: string
  name: string
  country: string
  costForNomadInUsd: number | null
}

export const useSearch = (query: Ref<string>) => {
  const results = ref<SearchResult[]>([])
  const isLoading = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  watch(query, (q) => {
    if (timer) clearTimeout(timer)

    if (!q.trim()) {
      results.value = []
      isLoading.value = false
      return
    }

    isLoading.value = true
    timer = setTimeout(async () => {
      try {
        results.value = await $fetch<SearchResult[]>('/api/search/cities', { query: { q } })
      } finally {
        isLoading.value = false
      }
    }, 300)
  })

  return { results, isLoading }
}
