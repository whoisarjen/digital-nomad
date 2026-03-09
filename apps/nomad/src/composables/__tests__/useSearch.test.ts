import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'

type SearchResult = { slug: string; name: string; country: string; costForNomadInUsd: number | null }

const fetchMock = vi.fn<(url: string, opts?: unknown) => Promise<SearchResult[]>>()

vi.stubGlobal('$fetch', fetchMock)

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    fetchMock.mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('starts with empty results and isLoading false', async () => {
    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('')
    const { results, isLoading } = useSearch(query)

    expect(results.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('does not fetch when query is empty', async () => {
    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('')
    useSearch(query)

    await vi.runAllTimersAsync()
    await nextTick()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not fetch when query contains only whitespace', async () => {
    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('   ')
    useSearch(query)

    await vi.runAllTimersAsync()
    await nextTick()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sets isLoading true immediately after non-empty query change', async () => {
    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('')
    const { isLoading } = useSearch(query)

    query.value = 'bangkok'
    await nextTick()

    expect(isLoading.value).toBe(true)
  })

  it('fetches with query after 300ms debounce', async () => {
    const mockResults: SearchResult[] = [
      { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', costForNomadInUsd: 1200 },
    ]
    fetchMock.mockResolvedValue(mockResults)

    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('')
    const { results, isLoading } = useSearch(query)

    query.value = 'bangkok'
    await nextTick()

    // Before 300ms — fetch not yet called
    vi.advanceTimersByTime(299)
    expect(fetchMock).not.toHaveBeenCalled()

    // After 300ms — fetch fires
    vi.advanceTimersByTime(1)
    await vi.runAllTimersAsync()
    await nextTick()

    expect(fetchMock).toHaveBeenCalledWith('/api/search/cities', { query: { q: 'bangkok' } })
    expect(results.value).toEqual(mockResults)
    expect(isLoading.value).toBe(false)
  })

  it('debounces rapid query changes — only last value triggers fetch', async () => {
    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('')
    useSearch(query)

    query.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(100)

    query.value = 'ba'
    await nextTick()
    vi.advanceTimersByTime(100)

    query.value = 'bangkok'
    await nextTick()

    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()
    await nextTick()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/search/cities', { query: { q: 'bangkok' } })
  })

  it('resets results and isLoading when query is cleared', async () => {
    const mockResults: SearchResult[] = [
      { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', costForNomadInUsd: 1200 },
    ]
    fetchMock.mockResolvedValue(mockResults)

    const { useSearch } = await import('~/composables/useSearch')
    const query = ref('')
    const { results, isLoading } = useSearch(query)

    query.value = 'bangkok'
    await nextTick()
    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()
    await nextTick()

    expect(results.value).toEqual(mockResults)

    query.value = ''
    await nextTick()

    expect(results.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })
})
