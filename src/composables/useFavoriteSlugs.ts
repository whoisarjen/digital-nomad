import { useQuery, useQueryClient } from '@tanstack/vue-query'

export function useFavoriteSlugs() {
  const queryClient = useQueryClient()

  const isLoggedIn = computed(() => {
    if (import.meta.server) return false
    return useCookie('nomad_logged_in').value === 'true'
  })

  const { data: slugsData } = useQuery({
    queryKey: ['/api/favorites/slugs'],
    queryFn: () => $fetch<{ data: string[] }>('/api/favorites/slugs', {
      credentials: 'include',
    }),
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  })

  const favoriteSlugs = computed(() => new Set(slugsData.value?.data ?? []))

  function isFavorited(citySlug: string): boolean {
    return favoriteSlugs.value.has(citySlug)
  }

  async function toggleFavorite(citySlug: string): Promise<{ authenticated: boolean }> {
    if (!isLoggedIn.value) {
      return { authenticated: false }
    }

    const previous = slugsData.value?.data ?? []
    const isCurrentlyFavorited = previous.includes(citySlug)
    const optimistic = isCurrentlyFavorited
      ? previous.filter(s => s !== citySlug)
      : [citySlug, ...previous]

    queryClient.setQueryData(['/api/favorites/slugs'], { data: optimistic })

    try {
      await $fetch('/api/favorites/toggle', {
        method: 'POST',
        credentials: 'include',
        body: { citySlug },
      })
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/slugs'] })
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] })
    } catch {
      queryClient.setQueryData(['/api/favorites/slugs'], { data: previous })
    }

    return { authenticated: true }
  }

  return {
    favoriteSlugs,
    isFavorited,
    toggleFavorite,
    isLoggedIn,
  }
}
