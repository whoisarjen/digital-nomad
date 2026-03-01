import { useQueryClient } from '@tanstack/vue-query'

export function useFavoriteSlugs() {
  const queryClient = useQueryClient()
  const { data, status } = useAuth()

  const isLoggedIn = computed(() => status.value === 'authenticated')
  const slugs = ref<string[]>([])

  // Sync session → local ref
  watchEffect(() => {
    const sessionSlugs = (data.value as any)?.user?.favoriteSlugs
    if (sessionSlugs) {
      slugs.value = sessionSlugs
    }
  })

  function isFavorited(citySlug: string): boolean {
    return slugs.value.includes(citySlug)
  }

  async function toggleFavorite(citySlug: string): Promise<{ authenticated: boolean }> {
    if (!isLoggedIn.value) {
      return { authenticated: false }
    }

    // Optimistic update
    const previous = [...slugs.value]
    const isFav = previous.includes(citySlug)
    slugs.value = isFav
      ? previous.filter(s => s !== citySlug)
      : [citySlug, ...previous]

    try {
      await $fetch('/api/favorites/toggle', {
        method: 'POST',
        body: { citySlug },
      })
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] })
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === '/api/cities'
          && JSON.stringify(query.queryKey).includes('favoritesOnly'),
      })
    } catch {
      // Reload to resync from server (deante pattern)
      if (import.meta.client) window.location.reload()
    }

    return { authenticated: true }
  }

  return {
    isFavorited,
    toggleFavorite,
    isLoggedIn,
  }
}
