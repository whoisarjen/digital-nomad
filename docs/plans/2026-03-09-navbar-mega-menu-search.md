# Navbar Mega Menu + Search Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flat 8-link navbar with a grouped mega menu and add a triggered slide-down search panel that navigates to city pages.

**Architecture:** New lightweight `GET /api/search/cities` endpoint (queries City directly, not MonthSummary). New `useSearch` composable (debounced $fetch). New `AppSearchPanel.vue` slide-down component. `AppHeader.vue` refactored to mega groups + search icon toggle.

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Vitest, @nuxt/test-utils, Zod

---

### Task 1: Search server endpoint

**Files:**
- Create: `apps/nomad/src/server/api/search/cities.get.ts`
- Create: `apps/nomad/src/server/api/search/__tests__/cities.get.test.ts`

**Step 1: Write the failing test**

```ts
// apps/nomad/src/server/api/search/__tests__/cities.get.test.ts
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedQueryMock } = vi.hoisted(() => ({
  prismaMock: {
    city: { findMany: vi.fn() },
  },
  getValidatedQueryMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getValidatedQuery: getValidatedQueryMock,
}))

describe('GET /api/search/cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/search/cities.get')
  })

  beforeEach(() => {
    prismaMock.city.findMany.mockResolvedValue([])
  })

  it('returns empty array when q is empty string', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: '' })

    const result = await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('queries city by name (case-insensitive) when q is provided', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'bar' })
    prismaMock.city.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { name: { contains: 'bar', mode: 'insensitive' } },
          ]),
        }),
      }),
    )
  })

  it('returns slug, name, country and costForNomadInUsd per city', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'bar' })
    prismaMock.city.findMany.mockResolvedValue([
      {
        slug: 'barcelona',
        name: 'Barcelona',
        costForNomadInUsd: 2100,
        country: { name: 'Spain' },
      },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toEqual([
      { slug: 'barcelona', name: 'Barcelona', country: 'Spain', costForNomadInUsd: 2100 },
    ])
  })

  it('limits results to 6', async () => {
    getValidatedQueryMock.mockResolvedValue({ q: 'a' })
    prismaMock.city.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.city.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 6 }),
    )
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
cd apps/nomad && npm run test:run -- src/server/api/search/__tests__/cities.get.test.ts
```

Expected: FAIL — module not found.

**Step 3: Implement the endpoint**

```ts
// apps/nomad/src/server/api/search/cities.get.ts
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().default(''),
})

export default defineEventHandler(async (event) => {
  const { q } = await getValidatedQuery(event, searchSchema.parse)

  if (!q.trim()) return []

  const cities = await prisma.city.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { country: { name: { contains: q, mode: 'insensitive' } } },
      ],
    },
    select: {
      slug: true,
      name: true,
      costForNomadInUsd: true,
      country: { select: { name: true } },
    },
    take: 6,
  })

  return cities.map(({ country, ...city }) => ({
    ...city,
    country: country.name,
  }))
})
```

**Step 4: Run test to confirm it passes**

```bash
cd apps/nomad && npm run test:run -- src/server/api/search/__tests__/cities.get.test.ts
```

Expected: PASS (4 tests).

**Step 5: Commit**

```bash
git add apps/nomad/src/server/api/search/
git commit -m "feat(search): add lightweight city search endpoint"
```

---

### Task 2: useSearch composable

**Files:**
- Create: `apps/nomad/src/composables/useSearch.ts`
- Create: `apps/nomad/src/composables/__tests__/useSearch.test.ts`

**Step 1: Write the failing test**

```ts
// apps/nomad/src/composables/__tests__/useSearch.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { server } from '~/test/setup'
import { http, HttpResponse } from 'msw'

// Import after MSW is set up (composable uses $fetch internally)
describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns empty results when query is empty', async () => {
    const { mountSuspended } = await import('@nuxt/test-utils/runtime')
    const { useSearch } = await import('~/composables/useSearch')

    // Test via a wrapper component to get Nuxt context
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const q = ref('')
          const { results, isLoading } = useSearch(q)
          return { results, isLoading }
        },
        template: '<div/>',
      }),
    )

    expect(wrapper.vm.results).toEqual([])
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('fetches /api/search/cities with query after debounce', async () => {
    server.use(
      http.get('/api/search/cities', ({ request }) => {
        const url = new URL(request.url)
        if (url.searchParams.get('q') === 'bar') {
          return HttpResponse.json([
            { slug: 'barcelona', name: 'Barcelona', country: 'Spain', costForNomadInUsd: 2100 },
          ])
        }
        return HttpResponse.json([])
      }),
    )

    const { mountSuspended } = await import('@nuxt/test-utils/runtime')
    const { useSearch } = await import('~/composables/useSearch')

    const q = ref('')
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const { results, isLoading } = useSearch(q)
          return { results, isLoading }
        },
        template: '<div/>',
      }),
    )

    q.value = 'bar'
    await vi.advanceTimersByTimeAsync(300)
    await flushPromises()

    expect(wrapper.vm.results[0]?.name).toBe('Barcelona')
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
cd apps/nomad && npm run test:run -- src/composables/__tests__/useSearch.test.ts
```

Expected: FAIL — module not found.

**Step 3: Implement the composable**

```ts
// apps/nomad/src/composables/useSearch.ts
export const useSearch = (query: Ref<string>) => {
  const results = ref<Array<{ slug: string; name: string; country: string; costForNomadInUsd: number | null }>>([])
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
        results.value = await $fetch('/api/search/cities', { query: { q } })
      } finally {
        isLoading.value = false
      }
    }, 300)
  })

  return { results, isLoading }
}
```

**Step 4: Run test to confirm it passes**

```bash
cd apps/nomad && npm run test:run -- src/composables/__tests__/useSearch.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/nomad/src/composables/useSearch.ts apps/nomad/src/composables/__tests__/useSearch.test.ts
git commit -m "feat(search): add useSearch composable with 300ms debounce"
```

---

### Task 3: AppSearchPanel component

**Files:**
- Create: `apps/nomad/src/components/AppSearchPanel.vue`
- Create: `apps/nomad/src/components/__tests__/AppSearchPanel.test.ts`

**Step 1: Write the failing test**

```ts
// apps/nomad/src/components/__tests__/AppSearchPanel.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppSearchPanel from '~/components/AppSearchPanel.vue'

vi.mock('~/composables/useSearch', () => ({
  useSearch: () => ({
    results: ref([
      { slug: 'barcelona', name: 'Barcelona', country: 'Spain', costForNomadInUsd: 2100 },
    ]),
    isLoading: ref(false),
  }),
}))

describe('AppSearchPanel', () => {
  it('renders the search input', async () => {
    const wrapper = await mountSuspended(AppSearchPanel, {
      props: { open: true },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders city results from useSearch', async () => {
    const wrapper = await mountSuspended(AppSearchPanel, {
      props: { open: true },
    })
    expect(wrapper.text()).toContain('Barcelona')
    expect(wrapper.text()).toContain('Spain')
  })

  it('emits close when Escape is pressed', async () => {
    const wrapper = await mountSuspended(AppSearchPanel, {
      props: { open: true },
    })
    await wrapper.find('input[type="text"]').trigger('keydown.esc')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not render when open is false', async () => {
    const wrapper = await mountSuspended(AppSearchPanel, {
      props: { open: false },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(false)
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
cd apps/nomad && npm run test:run -- src/components/__tests__/AppSearchPanel.test.ts
```

Expected: FAIL — component not found.

**Step 3: Implement the component**

```vue
<!-- apps/nomad/src/components/AppSearchPanel.vue -->
<template>
  <Transition name="search-panel">
    <div
      v-if="open"
      class="absolute top-full left-0 right-0 z-40 bg-[#0d1b2e] border-b border-white/10 shadow-2xl"
    >
      <div class="max-w-screen-2xl mx-auto px-4 py-4">
        <!-- Search input -->
        <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 h-12 mb-4 focus-within:border-white/25 transition-colors">
          <svg class="w-4 h-4 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="$t('search.placeholder')"
            class="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
            @keydown.esc="$emit('close')"
          />
          <span class="text-xs text-white/25 flex-shrink-0 hidden sm:block">Esc to close</span>
        </div>

        <!-- Quick chips -->
        <div class="flex items-center gap-2 flex-wrap mb-4">
          <NuxtLink
            v-for="chip in quickChips"
            :key="chip.label"
            :to="chip.to"
            class="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/50 hover:border-white/25 hover:text-white/80 transition-colors"
            @click="$emit('close')"
          >
            {{ chip.label }}
          </NuxtLink>
        </div>

        <!-- Results -->
        <div v-if="query.trim()" class="flex flex-col gap-0.5">
          <template v-if="isLoading">
            <div v-for="n in 3" :key="n" class="h-12 rounded-xl bg-white/5 animate-pulse" />
          </template>
          <template v-else-if="results.length">
            <NuxtLink
              v-for="city in results"
              :key="city.slug"
              :to="localePath(`/cities/${city.slug}`)"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
              @click="$emit('close')"
            >
              <span class="text-lg flex-shrink-0">🏙️</span>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-white group-hover:text-white/90">{{ city.name }}</div>
                <div class="text-xs text-white/40">{{ city.country }}</div>
              </div>
              <div v-if="city.costForNomadInUsd" class="text-xs font-semibold text-blue-400 flex-shrink-0">
                ${{ city.costForNomadInUsd.toLocaleString() }}/mo
              </div>
            </NuxtLink>
          </template>
          <p v-else class="text-sm text-white/40 px-3 py-4">
            {{ $t('search.noResults') }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useSearch } from '~/composables/useSearch'

const props = defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const localePath = useLocalePath()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const { results, isLoading } = useSearch(query)

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    nextTick(() => inputRef.value?.focus())
  }
})

const quickChips = [
  { label: '🔥 Popular', to: '/' },
  { label: '💰 Under $1,500', to: '/?costs=1500' },
  { label: '🌏 Southeast Asia', to: '/?regions=Southeast+Asia' },
  { label: '🇪🇺 Europe', to: '/?regions=Europe' },
  { label: '☀️ Warm weather', to: '/?weathers=SUNNY' },
]
</script>

<style scoped>
.search-panel-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.search-panel-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.search-panel-enter-from, .search-panel-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
```

**Step 4: Add i18n keys**

Add to `apps/nomad/src/locales/en.json`:
```json
"search": {
  "placeholder": "Search cities or countries…",
  "noResults": "No cities found"
}
```

Add the same keys to all other locale files (`pl.json`, `de.json`, `es.json`, `fr.json`, `it.json`, `ja.json`, `ko.json`, `ar.json`, `tr.json`, `pt.json`) — you can use the English strings as a placeholder for now.

**Step 5: Run test to confirm it passes**

```bash
cd apps/nomad && npm run test:run -- src/components/__tests__/AppSearchPanel.test.ts
```

Expected: PASS.

**Step 6: Commit**

```bash
git add apps/nomad/src/components/AppSearchPanel.vue apps/nomad/src/components/__tests__/AppSearchPanel.test.ts apps/nomad/src/locales/
git commit -m "feat(search): add AppSearchPanel slide-down component"
```

---

### Task 4: Refactor AppHeader to mega menu

**Files:**
- Modify: `apps/nomad/src/components/AppHeader.vue`

No new tests needed — AppHeader has no existing tests and the refactor is purely presentational (logic moves to AppSearchPanel). The visual output is verified manually.

**Step 1: Replace AppHeader.vue**

Full replacement — keep the existing mobile hamburger logic intact, replace the desktop nav:

```vue
<!-- apps/nomad/src/components/AppHeader.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#060E1B]">
    <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5 flex-shrink-0">
        <img src="/digital-nomad-logo.png" alt="Digital Nomad" class="h-8 w-8" />
        <span class="hidden sm:inline text-lg font-bold text-white">
          Digital<span class="text-primary-400">Nomad</span>
        </span>
      </NuxtLink>

      <!-- Desktop nav — mega groups -->
      <nav class="hidden lg:flex items-center gap-1 flex-1">
        <!-- Discover group -->
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
            {{ $t('nav.discover') }}
            <svg class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-64 bg-[#0d1b2e] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 -translate-y-1 group-hover:translate-y-0">
            <NuxtLink v-for="link in discoverLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm flex-shrink-0">{{ link.icon }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ link.label }}</div>
                <div class="text-xs text-white/40">{{ link.desc }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Rankings group -->
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
            {{ $t('nav.rankings') }}
            <svg class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-56 bg-[#0d1b2e] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 -translate-y-1 group-hover:translate-y-0">
            <NuxtLink v-for="link in rankingsLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm flex-shrink-0">{{ link.icon }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ link.label }}</div>
                <div class="text-xs text-white/40">{{ link.desc }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Tools group -->
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
            {{ $t('nav.tools') }}
            <svg class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-60 bg-[#0d1b2e] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 -translate-y-1 group-hover:translate-y-0">
            <NuxtLink v-for="link in toolsLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-sm flex-shrink-0">{{ link.icon }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ link.label }}</div>
                <div class="text-xs text-white/40">{{ link.desc }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Blog — standalone -->
        <NuxtLink :to="localePath('blog')" class="px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
          {{ $t('nav.blog') }}
        </NuxtLink>
      </nav>

      <!-- Right actions -->
      <div class="hidden lg:flex items-center gap-2 flex-shrink-0">
        <!-- Search trigger -->
        <button
          class="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors"
          :class="searchOpen ? 'border-white/20 text-white bg-white/[0.04]' : ''"
          :aria-label="$t('search.placeholder')"
          @click="searchOpen = !searchOpen"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <!-- Currency + Language grouped pill -->
        <div class="flex items-center border border-white/10 rounded-lg overflow-hidden">
          <div class="border-r border-white/10">
            <CurrencyPicker />
          </div>
          <LanguagePicker />
        </div>

        <!-- Auth -->
        <NuxtLink
          v-if="isLoggedIn"
          :to="localePath('dashboard')"
          class="text-sm text-white/70 hover:text-white font-medium transition-colors px-3"
        >
          {{ $t('dashboard.title') }}
        </NuxtLink>
        <NuxtLink
          v-else
          :to="localePath('join')"
          class="text-sm bg-accent-500 hover:bg-accent-400 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          {{ $t('auth.signUp') }}
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        :aria-label="mobileOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="sr-only">{{ mobileOpen ? 'Close' : 'Menu' }}</span>
        <span class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300" :class="mobileOpen ? 'rotate-45' : '-translate-y-1.5'" />
        <span class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300" :class="mobileOpen ? 'opacity-0 scale-x-0' : ''" />
        <span class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300" :class="mobileOpen ? '-rotate-45' : 'translate-y-1.5'" />
      </button>
    </div>

    <!-- Search panel (desktop) -->
    <AppSearchPanel :open="searchOpen" @close="searchOpen = false" />

    <!-- Mobile overlay -->
    <Transition name="mobile-menu">
      <nav
        v-if="mobileOpen"
        class="lg:hidden fixed inset-0 top-14 bg-[#060E1B]/[0.98] backdrop-blur-sm overflow-y-auto"
      >
        <div class="max-w-screen-sm mx-auto px-6 py-6 flex flex-col gap-1">
          <!-- Mobile search -->
          <button
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200 mb-2"
            @click="mobileOpen = false; searchOpen = true"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span class="text-base font-medium">{{ $t('search.placeholder') }}</span>
          </button>

          <NuxtLink
            v-for="(link, i) in allMobileLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-nav-link group flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            :style="{ animationDelay: `${i * 50}ms` }"
            @click="mobileOpen = false"
          >
            <span class="w-1 h-1 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span class="text-base font-medium">{{ link.label }}</span>
          </NuxtLink>

          <div class="my-3 h-px bg-white/10" />

          <NuxtLink
            v-if="!isLoggedIn"
            :to="localePath('join')"
            class="mobile-nav-link flex items-center justify-center px-4 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold text-base transition-colors"
            @click="mobileOpen = false"
          >
            {{ $t('auth.signUp') }}
          </NuxtLink>

          <div class="mobile-nav-link flex items-center gap-3 px-4 py-3">
            <CurrencyPicker />
            <LanguagePicker />
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { status } = useAuth()
const isLoggedIn = computed(() => status.value === 'authenticated')
const mobileOpen = ref(false)
const searchOpen = ref(false)

const discoverLinks = computed(() => [
  { to: localePath('index'), icon: '🗺️', label: t('nav.exploreCities'), desc: t('nav.exploreCitiesDesc') },
  { to: localePath('regions'), icon: '🌐', label: t('nav.regions'), desc: t('nav.regionsDesc') },
  { to: localePath('countries'), icon: '🏳️', label: t('nav.countries'), desc: t('nav.countriesDesc') },
])

const rankingsLinks = computed(() => [
  { to: localePath('best-cities'), icon: '🏆', label: t('nav.bestCities'), desc: t('nav.bestCitiesDesc') },
  { to: '/safe-cities', icon: '🛡️', label: t('nav.safeCities'), desc: t('nav.safeCitiesDesc') },
])

const toolsLinks = computed(() => [
  { to: localePath('compare'), icon: '⚖️', label: t('nav.compare'), desc: t('nav.compareDesc') },
  { to: localePath('tools'), icon: '🛠️', label: t('schengen.toolsNav'), desc: t('nav.toolsDesc') },
])

const allMobileLinks = computed(() => [
  ...discoverLinks.value,
  ...rankingsLinks.value,
  ...toolsLinks.value,
  { to: localePath('blog'), icon: '📝', label: t('nav.blog'), desc: '' },
])

watch(() => route.fullPath, () => {
  mobileOpen.value = false
  searchOpen.value = false
})
</script>

<style scoped>
.mobile-menu-enter-active { transition: opacity 0.2s ease; }
.mobile-menu-leave-active { transition: opacity 0.15s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}
.mobile-nav-link { animation: slideIn 0.25s ease both; }
</style>
```

**Step 2: Add missing i18n keys to en.json**

Add these under the `"nav"` key in `apps/nomad/src/locales/en.json`:
```json
"discover": "Discover",
"rankings": "Rankings",
"tools": "Tools",
"exploreCitiesDesc": "Browse 300+ cities with cost data",
"regionsDesc": "Southeast Asia, Latam, Europe…",
"countriesDesc": "Country-level comparisons",
"bestCitiesDesc": "Top rated for nomads overall",
"safeCitiesDesc": "Low crime, stable infrastructure",
"compareDesc": "Side-by-side cost breakdown",
"toolsDesc": "Schengen calculator, budget builder…"
```

Add the same keys to all other locale files with the same English values as placeholders.

**Step 3: Close search panel on click outside**

In `AppHeader.vue`, add a `v-click-outside` directive or use a `mousedown` listener on the document. The simplest approach: add `@mousedown.stop` on the header and a global listener in `AppSearchPanel`:

In `AppSearchPanel.vue` `<script setup>`, add:
```ts
onMounted(() => {
  const handler = (e: MouseEvent) => {
    const el = document.querySelector('header')
    if (!el?.contains(e.target as Node)) emit('close')
  }
  document.addEventListener('mousedown', handler)
  onUnmounted(() => document.removeEventListener('mousedown', handler))
})
```

**Step 4: Typecheck**

```bash
cd apps/nomad && npx vue-tsc --noEmit
```

Fix any type errors before committing.

**Step 5: Commit**

```bash
git add apps/nomad/src/components/AppHeader.vue apps/nomad/src/locales/
git commit -m "feat(nav): replace flat links with mega menu + search icon trigger"
```

---

### Task 5: Run full test suite and verify

**Step 1: Run all tests**

```bash
cd apps/nomad && npm run test:run
```

Expected: all pass.

**Step 2: Run typecheck**

```bash
cd apps/nomad && npx vue-tsc --noEmit
```

Expected: no errors.

**Step 3: Final commit if anything was fixed**

```bash
git add -p
git commit -m "fix(nav): address typecheck and test issues"
```
