import { ref, watch, onUnmounted, type Ref } from 'vue'

export interface CityResult {
  slug: string
  name: string
  country: string
  costForNomadInUsd: number | null
}

export interface ArticleResult {
  slug: string
  title: string | null
  readingTimeMinutes: number | null
}

export interface SearchResults {
  cities: CityResult[]
  articles: ArticleResult[]
}

export const useSearch = (query: Ref<string>) => {
  const results = ref<SearchResults>({ cities: [], articles: [] })
  const isLoading = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  const stopWatch = watch(query, (q) => {
    if (timer) clearTimeout(timer)

    if (!q.trim()) {
      results.value = { cities: [], articles: [] }
      isLoading.value = false
      return
    }

    isLoading.value = true
    timer = setTimeout(async () => {
      try {
        results.value = await $fetch<SearchResults>('/api/search', { query: { q } })
      } finally {
        isLoading.value = false
      }
    }, 300)
  })

  onUnmounted(() => {
    stopWatch()
    if (timer) clearTimeout(timer)
  })

  return { results, isLoading }
}
