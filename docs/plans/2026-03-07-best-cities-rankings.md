# Best Cities Rankings Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a "Best Digital Nomad Cities" hub page (`/best-cities`) listing all 12 months, and 12 per-month ranking pages (`/best-cities/january` etc.) each showing the top 50 cities by `totalScore` for that month.

**Architecture:** New API endpoint returns the #1 city per month (for the hub). Month detail pages reuse the existing `/api/cities` endpoint with `?orderBy=totalScore&sort=desc&months=XX&limit=50`. Month slugs (january–december) map to DB values ('01'–'12') via a shared constant.

**Tech Stack:** Nuxt 3, Vue 3, Prisma (PostgreSQL/Neon), TanStack Query via `useCustomQuery`, `@nuxtjs/i18n`, `@nuxtjs/seo` (useSchemaOrg, useSeoMeta)

---

## Reference Files

- Server route pattern: `apps/nomad/src/server/api/blog/[slug].get.ts`
- Server route test pattern: `apps/nomad/src/server/api/blog/__tests__/[slug].get.test.ts`
- Sitemap pattern: `apps/nomad/src/server/api/__sitemap__/cities.ts`
- Sitemap test pattern: `apps/nomad/src/server/api/__sitemap__/__tests__/cities.test.ts`
- Composable pattern: `apps/nomad/src/composables/useCountry.ts`
- Component test pattern: `apps/nomad/src/components/__tests__/CustomNuxtImg.test.ts`
- Page pattern: `apps/nomad/src/pages/countries/index.vue`
- Mock helper: `apps/nomad/test/mocks/h3-event.ts`
- Locale files: `apps/nomad/src/locales/*.json` (11 files: en, pl, es, de, pt, fr, ko, ar, tr, ja, it)
- nuxt.config: `apps/nomad/nuxt.config.ts`

## Score Color Thresholds

`MonthSummary.totalScore` is an integer. `OPTIONS_RANKS` in `global.utils.ts` uses thresholds 2, 3, 4 (stars). Color badge: `score >= 4` → green, `score === 3` → yellow, `score <= 2` → red.

---

### Task 1: Month constants (shared)

**Files:**
- Create: `apps/nomad/src/shared/months.constant.ts`

**Step 1: Write the constant file**

```ts
export const MONTH_SLUG_MAP = {
  january:   '01',
  february:  '02',
  march:     '03',
  april:     '04',
  may:       '05',
  june:      '06',
  july:      '07',
  august:    '08',
  september: '09',
  october:   '10',
  november:  '11',
  december:  '12',
} as const

export type MonthSlug = keyof typeof MONTH_SLUG_MAP
export type MonthValue = (typeof MONTH_SLUG_MAP)[MonthSlug]

export const MONTH_SLUGS = Object.keys(MONTH_SLUG_MAP) as MonthSlug[]

export const MONTH_DISPLAY_NAMES: Record<MonthSlug, string> = {
  january:   'January',
  february:  'February',
  march:     'March',
  april:     'April',
  may:       'May',
  june:      'June',
  july:      'July',
  august:    'August',
  september: 'September',
  october:   'October',
  november:  'November',
  december:  'December',
}
```

**Step 2: Commit**

```bash
git add apps/nomad/src/shared/months.constant.ts
git commit -m "feat(best-cities): add month slug constants"
```

---

### Task 2: API endpoint — best-cities hub

**Files:**
- Create: `apps/nomad/src/server/api/rankings/best-cities.get.ts`
- Create: `apps/nomad/src/server/api/rankings/__tests__/best-cities.get.test.ts`

**Step 1: Write the failing test**

```ts
// apps/nomad/src/server/api/rankings/__tests__/best-cities.get.test.ts
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    monthSummary: { findMany: vi.fn() },
  },
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
}))

describe('GET /api/rankings/best-cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/rankings/best-cities.get')
  })

  it('returns one entry per month with topCity fields', async () => {
    prismaMock.monthSummary.findMany.mockResolvedValue([
      {
        month: '01',
        totalScore: 4,
        city: { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', image: null },
      },
      {
        month: '02',
        totalScore: 3,
        city: { slug: 'lisbon', name: 'Lisbon', country: 'Portugal', image: null },
      },
    ])

    const result = await handler.default(createMockH3Event())

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      month: '01',
      topCity: { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', totalScore: 4, image: null },
    })
  })

  it('queries with distinct month, ordered by totalScore desc', async () => {
    prismaMock.monthSummary.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.monthSummary.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        distinct: ['month'],
        orderBy: [{ month: 'asc' }, { totalScore: 'desc' }],
      }),
    )
  })

  it('filters to only the 12 calendar months', async () => {
    prismaMock.monthSummary.findMany.mockResolvedValue([])

    await handler.default(createMockH3Event())

    expect(prismaMock.monthSummary.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { month: { in: ['01','02','03','04','05','06','07','08','09','10','11','12'] } },
      }),
    )
  })
})
```

**Step 2: Run test — expect FAIL**

```bash
cd apps/nomad && npm run test:run -- --reporter=verbose src/server/api/rankings/__tests__/best-cities.get.test.ts
```

Expected: FAIL — module not found.

**Step 3: Write the implementation**

```ts
// apps/nomad/src/server/api/rankings/best-cities.get.ts
import { MONTH_SLUGS, MONTH_SLUG_MAP } from '~/shared/months.constant'

const ALL_MONTHS = Object.values(MONTH_SLUG_MAP)

export default defineEventHandler(async () => {
  const summaries = await prisma.monthSummary.findMany({
    where: { month: { in: ALL_MONTHS } },
    orderBy: [{ month: 'asc' }, { totalScore: 'desc' }],
    distinct: ['month'],
    select: {
      month: true,
      totalScore: true,
      city: {
        select: {
          slug: true,
          name: true,
          country: true,
          image: {
            select: {
              url: true,
              width: true,
              height: true,
              blurHash: true,
              ownerName: true,
              ownerUsername: true,
            },
          },
        },
      },
    },
  })

  return summaries.map((s) => ({
    month: s.month,
    topCity: {
      slug: s.city.slug,
      name: s.city.name,
      country: s.city.country,
      totalScore: s.totalScore,
      image: s.city.image,
    },
  }))
})
```

**Step 4: Run test — expect PASS**

```bash
cd apps/nomad && npm run test:run -- src/server/api/rankings/__tests__/best-cities.get.test.ts
```

**Step 5: Commit**

```bash
git add apps/nomad/src/server/api/rankings/best-cities.get.ts apps/nomad/src/server/api/rankings/__tests__/best-cities.get.test.ts
git commit -m "feat(best-cities): add rankings hub API endpoint"
```

---

### Task 3: useBestCities composable

**Files:**
- Create: `apps/nomad/src/composables/useBestCities.ts`

No test needed — it's a thin wrapper over `useCustomQuery` (same pattern as `useCountries`).

**Step 1: Write the composable**

```ts
// apps/nomad/src/composables/useBestCities.ts
import type { InternalApi } from 'nitropack'

export const useBestCities = (
  queryOptions?: QueryOptions<InternalApi['/api/rankings/best-cities']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/rankings/best-cities']['get']>(
    '/api/rankings/best-cities',
    undefined,
    queryOptions,
    undefined,
  )
}
```

**Step 2: Commit**

```bash
git add apps/nomad/src/composables/useBestCities.ts
git commit -m "feat(best-cities): add useBestCities composable"
```

---

### Task 4: NomadScoreBadge component

**Files:**
- Create: `apps/nomad/src/components/NomadScoreBadge.vue`
- Create: `apps/nomad/src/components/__tests__/NomadScoreBadge.test.ts`

**Step 1: Write the failing test**

```ts
// apps/nomad/src/components/__tests__/NomadScoreBadge.test.ts
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NomadScoreBadge from '~/components/NomadScoreBadge.vue'

describe('NomadScoreBadge', () => {
  it('renders the score', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 4 } })
    expect(wrapper.text()).toContain('4')
  })

  it('applies green class for score >= 4', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 4 } })
    expect(wrapper.html()).toContain('green')
  })

  it('applies yellow class for score === 3', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 3 } })
    expect(wrapper.html()).toContain('yellow')
  })

  it('applies red class for score <= 2', () => {
    const wrapper = mount(NomadScoreBadge, { props: { score: 2 } })
    expect(wrapper.html()).toContain('red')
  })
})
```

**Step 2: Run test — expect FAIL**

```bash
cd apps/nomad && npm run test:run -- src/components/__tests__/NomadScoreBadge.test.ts
```

**Step 3: Write the implementation**

```vue
<!-- apps/nomad/src/components/NomadScoreBadge.vue -->
<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums"
    :class="colorClass"
  >
    {{ score }} ★
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ score: number }>()

const colorClass = computed(() => {
  if (props.score >= 4) return 'bg-green-500/20 text-green-400'
  if (props.score === 3) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
})
</script>
```

**Step 4: Run test — expect PASS**

```bash
cd apps/nomad && npm run test:run -- src/components/__tests__/NomadScoreBadge.test.ts
```

**Step 5: Commit**

```bash
git add apps/nomad/src/components/NomadScoreBadge.vue apps/nomad/src/components/__tests__/NomadScoreBadge.test.ts
git commit -m "feat(best-cities): add NomadScoreBadge component"
```

---

### Task 5: i18n keys

**Files:**
- Modify: all 11 locale files in `apps/nomad/src/locales/`

Add the `bestCities` key to each file. EN and PL get full translations; the remaining 9 get English strings as fallback (they can be translated later).

**Step 1: Add to `en.json`**

Add before the closing `}`:
```json
  "bestCities": {
    "title": "Best Cities for Digital Nomads {year}",
    "description": "Top 50 cities ranked by Nomad Score each month — covering cost, internet, safety, and climate.",
    "monthTitle": "Best Digital Nomad Cities in {month} {year}",
    "monthDescription": "Top 50 cities for digital nomads in {month} {year}, ranked by composite Nomad Score.",
    "browseByMonth": "Browse by Month",
    "rank": "Rank",
    "nomadScore": "Nomad Score",
    "cost": "Cost/mo",
    "internet": "Internet",
    "topCity": "Top City"
  }
```

**Step 2: Add to `pl.json`**

```json
  "bestCities": {
    "title": "Najlepsze Miasta dla Cyfrowych Nomadów {year}",
    "description": "Top 50 miast ocenianych co miesiąc według Nomad Score — koszt życia, internet, bezpieczeństwo i klimat.",
    "monthTitle": "Najlepsze Miasta dla Nomadów w {month} {year}",
    "monthDescription": "Top 50 miast dla cyfrowych nomadów w {month} {year}, ranking według Nomad Score.",
    "browseByMonth": "Przeglądaj według miesiąca",
    "rank": "Miejsce",
    "nomadScore": "Nomad Score",
    "cost": "Koszt/mies.",
    "internet": "Internet",
    "topCity": "Najlepsze miasto"
  }
```

**Step 3: Add English fallback to remaining 9 locale files** (es, de, pt, fr, ko, ar, tr, ja, it)

Same content as EN for each file.

**Step 4: Run typecheck to verify JSON is valid**

```bash
cd apps/nomad && npx tsc --noEmit 2>&1 | head -30
```

**Step 5: Commit**

```bash
git add apps/nomad/src/locales/
git commit -m "feat(best-cities): add i18n keys for best-cities pages"
```

---

### Task 6: Hub page — /best-cities

**Files:**
- Create: `apps/nomad/src/pages/best-cities/index.vue`

No dedicated test — the hub page is UI-only (data from composable, no business logic).

**Step 1: Write the page**

```vue
<!-- apps/nomad/src/pages/best-cities/index.vue -->
<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- Hero -->
    <section class="relative pt-24 pb-14 px-6 overflow-hidden">
      <div
        class="absolute inset-0 opacity-40"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);"
      />
      <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />
      <div class="absolute -bottom-[10%] -left-[15%] w-[30%] h-[30%] rounded-full bg-accent-500/[0.04] blur-[80px]" />

      <div class="relative max-w-screen-xl mx-auto">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-3 mb-6">
          <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-sm text-primary-400">{{ $t('bestCities.browseByMonth') }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('bestCities.title', { year: currentYear }) }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('bestCities.description') }}
        </p>
      </div>
    </section>

    <!-- Month grid -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <template v-if="status === 'pending' || !data">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="i in 12" :key="i" class="h-56 skeleton rounded-2xl" />
          </div>
        </template>

        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <NuxtLink
              v-for="entry in data"
              :key="entry.month"
              :to="localePath({ name: 'best-cities-month', params: { month: monthValueToSlug(entry.month) } })"
              class="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-primary-400/30 transition-all duration-200"
            >
              <!-- City image -->
              <div class="relative h-36 overflow-hidden">
                <CustomNuxtImg
                  v-if="entry.topCity.image"
                  :src="entry.topCity.image.url"
                  :alt="entry.topCity.name"
                  :width="entry.topCity.image.width"
                  :height="entry.topCity.image.height"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full bg-white/[0.04]" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <!-- Month label -->
                <span class="absolute top-2 left-3 text-xs font-semibold text-white/80 uppercase tracking-wider">
                  {{ monthValueToDisplayName(entry.month) }}
                </span>
              </div>

              <!-- City info -->
              <div class="p-3 flex flex-col gap-1">
                <p class="text-white font-semibold text-sm leading-tight group-hover:text-primary-300 transition-colors">
                  {{ entry.topCity.name }}
                </p>
                <p class="text-white/40 text-xs">{{ entry.topCity.country }}</p>
                <div class="mt-1">
                  <NomadScoreBadge :score="entry.topCity.totalScore" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { MONTH_SLUG_MAP, MONTH_DISPLAY_NAMES, type MonthValue, type MonthSlug } from '~/shared/months.constant'

defineI18nRoute({
  paths: {
    en: '/best-cities',
    pl: '/najlepsze-miasta',
    es: '/mejores-ciudades',
    de: '/beste-staedte',
    pt: '/melhores-cidades',
    fr: '/meilleures-villes',
    ko: '/best-cities',
    ar: '/best-cities',
    tr: '/en-iyi-sehirler',
    ja: '/best-cities',
    it: '/migliori-citta',
  },
})

const { t } = useCustomI18n()
const localePath = useLocalePath()
const { data, status } = await useBestCities()
const currentYear = new Date().getFullYear()

const VALUE_TO_SLUG = Object.fromEntries(
  Object.entries(MONTH_SLUG_MAP).map(([slug, val]) => [val, slug]),
) as Record<MonthValue, MonthSlug>

const monthValueToSlug = (monthValue: string) => VALUE_TO_SLUG[monthValue as MonthValue] ?? 'january'
const monthValueToDisplayName = (monthValue: string) => MONTH_DISPLAY_NAMES[monthValueToSlug(monthValue)]

useSeoMeta({
  title: () => t('bestCities.title', { year: currentYear }),
  description: () => t('bestCities.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('bestCities.browseByMonth') },
    ],
  }),
  defineItemList({
    itemListElement: (data.value ?? []).map((entry, i) => ({
      position: i + 1,
      name: monthValueToDisplayName(entry.month),
      url: `/best-cities/${monthValueToSlug(entry.month)}`,
    })),
  }),
])
</script>
```

**Step 2: Run typecheck**

```bash
cd apps/nomad && npx tsc --noEmit 2>&1 | head -30
```

Fix any type errors before proceeding.

**Step 3: Commit**

```bash
git add apps/nomad/src/pages/best-cities/index.vue
git commit -m "feat(best-cities): add hub page with 12 month cards"
```

---

### Task 7: Month detail page — /best-cities/[month]

**Files:**
- Create: `apps/nomad/src/pages/best-cities/[month].vue`

**Step 1: Write the page**

```vue
<!-- apps/nomad/src/pages/best-cities/[month].vue -->
<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- Hero -->
    <section class="relative pt-24 pb-14 px-6 overflow-hidden">
      <div
        class="absolute inset-0 opacity-40"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);"
      />
      <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />

      <div class="relative max-w-screen-xl mx-auto">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-3 mb-6">
          <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <NuxtLink :to="localePath('best-cities')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('bestCities.browseByMonth') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-sm text-primary-400">{{ displayName }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('bestCities.monthTitle', { month: displayName, year: currentYear }) }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('bestCities.monthDescription', { month: displayName, year: currentYear }) }}
        </p>
      </div>
    </section>

    <!-- Rankings table -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <template v-if="status === 'pending' || !data">
          <div class="space-y-2">
            <div v-for="i in 20" :key="i" class="h-16 skeleton rounded-xl" />
          </div>
        </template>

        <template v-else-if="!data.data.length">
          <p class="text-white/40 text-center py-20">No data available for this month.</p>
        </template>

        <template v-else>
          <!-- Table header -->
          <div class="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-white/30 uppercase tracking-wider border-b border-white/[0.06] mb-2">
            <span>{{ $t('bestCities.rank') }}</span>
            <span>City</span>
            <span class="text-right">{{ $t('bestCities.nomadScore') }}</span>
            <span class="text-right">{{ $t('bestCities.cost') }}</span>
            <span class="text-right">{{ $t('bestCities.internet') }}</span>
          </div>

          <!-- Rows -->
          <NuxtLink
            v-for="(city, index) in data.data"
            :key="city.slug"
            :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
            class="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
          >
            <span class="text-white/30 font-mono text-sm font-semibold">{{ index + 1 }}</span>

            <div class="min-w-0">
              <p class="text-white font-semibold text-sm group-hover:text-primary-300 transition-colors truncate">
                {{ city.name }}
              </p>
              <p class="text-white/40 text-xs">{{ city.country }}</p>
            </div>

            <div class="flex justify-end">
              <NomadScoreBadge v-if="city.totalScore != null" :score="city.totalScore" />
              <span v-else class="text-white/20 text-xs">—</span>
            </div>

            <span class="text-emerald-400 text-sm font-medium tabular-nums text-right">
              ${{ Math.round(Number(city.costForNomadInUsd)) }}<span class="text-white/30 font-normal text-xs">/mo</span>
            </span>

            <span class="text-white/60 text-sm tabular-nums text-right">
              {{ city.internetSpeedCity }}<span class="text-white/30 text-xs"> Mbps</span>
            </span>
          </NuxtLink>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { MONTH_SLUG_MAP, MONTH_DISPLAY_NAMES, type MonthSlug } from '~/shared/months.constant'

const route = useRoute()
const { t } = useCustomI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()

const monthSlug = route.params.month as string

// 404 on invalid month slug
if (!Object.keys(MONTH_SLUG_MAP).includes(monthSlug)) {
  throw createError({ statusCode: 404, statusMessage: 'Month not found' })
}

const slug = monthSlug as MonthSlug
const monthValue = MONTH_SLUG_MAP[slug]
const displayName = MONTH_DISPLAY_NAMES[slug]

const { data, status } = await useCities(
  ref({ months: monthValue, orderBy: 'totalScore', sort: 'desc', limit: 50 }),
)

useSeoMeta({
  title: () => t('bestCities.monthTitle', { month: displayName, year: currentYear }),
  description: () => t('bestCities.monthDescription', { month: displayName, year: currentYear }),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('bestCities.browseByMonth'), item: '/best-cities' },
      { name: displayName },
    ],
  }),
  defineItemList({
    itemListElement: (data.value?.data ?? []).map((city, i) => ({
      position: i + 1,
      name: city.name,
      url: `/cities/${city.slug}`,
    })),
  }),
])
</script>
```

**Step 2: Run typecheck**

```bash
cd apps/nomad && npx tsc --noEmit 2>&1 | head -30
```

Fix any type errors. The `useCities` query takes `Partial<GetCitiesSchema>` so fields like `orderBy`, `sort`, `limit`, `months` must match their expected types.

**Step 3: Commit**

```bash
git add apps/nomad/src/pages/best-cities/[month].vue
git commit -m "feat(best-cities): add per-month rankings page"
```

---

### Task 8: Sitemap for month pages

The hub page (`/best-cities`) is automatically included in the `pages` sitemap (`includeAppSources: true`). We only need a custom sitemap for the 12 dynamic month pages.

**Files:**
- Create: `apps/nomad/src/server/api/__sitemap__/best-cities.ts`
- Create: `apps/nomad/src/server/api/__sitemap__/__tests__/best-cities.test.ts`

**Step 1: Write the failing test**

```ts
// apps/nomad/src/server/api/__sitemap__/__tests__/best-cities.test.ts
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

vi.mock('#imports', () => ({
  defineSitemapEventHandler: (handler: Function) => handler,
  buildLocalizedEntries: (buildLoc: (lang: string) => string, extra?: object) => [
    { loc: buildLoc('en'), ...extra, alternatives: [] },
  ],
}))

describe('GET /api/__sitemap__/best-cities', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/__sitemap__/best-cities')
  })

  it('returns 12 entries — one per month', async () => {
    const result = await handler.default(createMockH3Event())
    expect(result).toHaveLength(12)
  })

  it('first entry points to /best-cities/january', async () => {
    const result = await handler.default(createMockH3Event())
    expect(result[0].loc).toBe('/best-cities/january')
  })

  it('last entry points to /best-cities/december', async () => {
    const result = await handler.default(createMockH3Event())
    expect(result[result.length - 1].loc).toBe('/best-cities/december')
  })
})
```

**Step 2: Run test — expect FAIL**

```bash
cd apps/nomad && npm run test:run -- src/server/api/__sitemap__/__tests__/best-cities.test.ts
```

**Step 3: Write the implementation**

```ts
// apps/nomad/src/server/api/__sitemap__/best-cities.ts
import { MONTH_SLUGS } from '~/shared/months.constant'

export default defineSitemapEventHandler(() => {
  return MONTH_SLUGS.flatMap((monthSlug) =>
    buildLocalizedEntries(
      (lang) => `${lang !== 'en' ? `/${lang}` : ''}/best-cities/${monthSlug}`,
    ),
  )
})
```

**Step 4: Run test — expect PASS**

```bash
cd apps/nomad && npm run test:run -- src/server/api/__sitemap__/__tests__/best-cities.test.ts
```

**Step 5: Commit**

```bash
git add apps/nomad/src/server/api/__sitemap__/best-cities.ts apps/nomad/src/server/api/__sitemap__/__tests__/best-cities.test.ts
git commit -m "feat(best-cities): add sitemap for month ranking pages"
```

---

### Task 9: Register sitemap in nuxt.config

**Files:**
- Modify: `apps/nomad/nuxt.config.ts`

**Step 1: Add the `best-cities` sitemap source**

In the `sitemaps` object inside `sitemap:`, add:

```ts
'best-cities': {
  sources: ['/api/__sitemap__/best-cities'],
  includeAppSources: false,
},
```

Place it after the `countries` entry.

**Step 2: Run typecheck**

```bash
cd apps/nomad && npx tsc --noEmit 2>&1 | head -30
```

**Step 3: Run full test suite**

```bash
cd apps/nomad && npm run test:run
```

All tests must pass. Fix any failures before committing.

**Step 4: Commit**

```bash
git add apps/nomad/nuxt.config.ts
git commit -m "feat(best-cities): register best-cities sitemap source"
```

---

## Done

At this point:
- `/best-cities` hub page shows 12 month cards, each with the #1 city's image, name, and score
- `/best-cities/january` through `/best-cities/december` each show the top 50 cities for that month, ranked by `totalScore`
- `NomadScoreBadge` component shows color-coded score pill
- Full SEO: useSeoMeta + JSON-LD ItemList + BreadcrumbList on both pages
- Sitemap registered and generating 12 localized entries
- i18n keys present for all 11 locales
- All tests passing
