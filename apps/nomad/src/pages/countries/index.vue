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
          <span class="text-sm text-primary-400">{{ $t('countryPage.allCountries') }}</span>
        </div>

        <!-- H1 -->
        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('countryPage.allCountriesTitle') }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('countryPage.allCountriesDesc', { count: data?.length ?? 0 }) }}
        </p>

        <!-- Search + Sort controls -->
        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <!-- Search input -->
          <div class="relative flex-1 max-w-md">
            <LucideSearch :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              v-model="searchQ"
              type="text"
              placeholder="Search countries..."
              class="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/50 transition-colors text-sm"
            />
          </div>

          <!-- Sort pills -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="option in sortOptions"
              :key="option.key"
              @click="sortKey = option.key"
              class="px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
              :class="sortKey === option.key
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white/[0.05] text-white/50 hover:text-white/80 hover:bg-white/[0.08]'"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Count indicator -->
        <p v-if="data" class="mt-4 text-sm text-white/30">
          Showing {{ filtered.length }} of {{ data.length }} countries
        </p>
      </div>
    </section>

    <!-- Country grid -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <!-- Skeleton -->
        <template v-if="status === 'pending' || !data">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div v-for="i in 20" :key="i" class="h-40 skeleton rounded-2xl" />
          </div>
        </template>

        <!-- Empty state -->
        <template v-else-if="filtered.length === 0">
          <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="flex items-center justify-center size-16 rounded-full bg-white/[0.05] mb-4">
              <LucideSearchX :size="28" class="text-white/20" />
            </div>
            <p class="text-white/50 text-lg font-medium">No countries found</p>
            <p class="text-white/30 text-sm mt-1">Try a different search term</p>
            <button
              @click="searchQ = ''"
              class="mt-4 px-4 py-2 rounded-lg bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.1] hover:text-white/80 transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        </template>

        <!-- Grid -->
        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <NuxtLink
              v-for="country in filtered"
              :key="country.countrySlug"
              :to="localePath({ name: 'countries-countrySlug', params: { countrySlug: country.countrySlug } })"
              class="group flex flex-col gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-primary-400/30 rounded-2xl px-4 py-5 transition-all duration-200"
            >
              <span class="text-[3rem] leading-none">{{ countryFlag(country.countryCode) }}</span>
              <div class="mt-1">
                <p class="text-white font-semibold text-sm leading-tight group-hover:text-primary-300 transition-colors">
                  {{ country.country }}
                </p>
                <p class="text-white/40 text-xs mt-0.5">
                  {{ $t('countryPage.cityCount', { count: country.cityCount }) }}
                </p>
              </div>
              <p v-if="country.avgCost" class="text-emerald-400 text-xs font-medium tabular-nums">
                ~${{ Math.round(country.avgCost) }}<span class="text-white/30 font-normal">/mo</span>
              </p>
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/countries',
    pl: '/kraje',
    es: '/paises',
    de: '/laender',
    pt: '/paises',
    fr: '/pays',
    ko: '/countries',
    ar: '/countries',
    tr: '/ulkeler',
    ja: '/countries',
    it: '/paesi',
  },
})

const { t } = useCustomI18n()
const localePath = useLocalePath()

const { data, status } = await useCountries()

const countryFlag = (code: string | null) => {
  if (!code) return '\u{1F30D}'
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + 127397))
}

// Search + sort
type SortKey = 'cityCount' | 'avgCost' | 'alpha'
const sortKey = ref<SortKey>('cityCount')
const searchQ = ref('')
const debouncedQ = ref('')

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchQ, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedQ.value = val }, 300)
})

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'cityCount', label: 'Most Cities' },
  { key: 'avgCost', label: 'Cheapest' },
  { key: 'alpha', label: 'A \u2192 Z' },
]

const filtered = computed(() => {
  let list = data.value ?? []
  if (debouncedQ.value.trim()) {
    const q = debouncedQ.value.toLowerCase()
    list = list.filter(c => c.country.toLowerCase().includes(q) || c.countrySlug.includes(q))
  }
  return [...list].sort((a, b) => {
    if (sortKey.value === 'cityCount') return b.cityCount - a.cityCount
    if (sortKey.value === 'avgCost') return (a.avgCost ?? 9999) - (b.avgCost ?? 9999)
    return a.country.localeCompare(b.country)
  })
})

useSeoMeta({
  title: () => t('countryPage.allCountriesTitle'),
  description: () => t('countryPage.allCountriesDesc', { count: '' }),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('countryPage.allCountries') },
    ],
  }),
])
</script>
