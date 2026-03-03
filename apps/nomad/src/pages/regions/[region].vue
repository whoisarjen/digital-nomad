<template>
  <div class="bg-gray-100">
    <!-- Dark hero zone -->
    <div class="bg-[#060E1B] text-white">
      <!-- Loading skeleton -->
      <template v-if="!regionData || regionStatus !== 'success'">
        <section class="pt-24 pb-20 px-6">
          <div class="max-w-screen-xl mx-auto flex flex-col gap-4">
            <div class="h-3 skeleton w-32" />
            <div class="h-12 skeleton w-2/3" />
            <div class="h-5 skeleton w-48" />
            <div class="flex gap-3 mt-4">
              <div v-for="i in 4" :key="i" class="h-20 skeleton w-40 rounded-2xl" />
            </div>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="relative pt-24 pb-20 px-6 overflow-hidden">
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
              <NuxtLink :to="localePath('regions')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
                {{ $t('regionPage.breadcrumb') }}
              </NuxtLink>
              <span class="text-white/20">/</span>
              <span class="text-sm text-primary-400">{{ regionLabel }}</span>
            </div>

            <!-- H1 -->
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight">
              {{ $t('regionPage.h1', { region: regionLabel }) }}
            </h1>

            <!-- Subtitle -->
            <p class="mt-3 text-lg text-white/50">
              {{ $t('regionPage.subtitle', { count: regionData.stats.cityCount, month: currentMonthName }) }}
            </p>

            <!-- Stats chips -->
            <div class="flex flex-wrap gap-4 mt-8">
              <div class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[120px]">
                <span class="text-2xl font-bold text-white tabular-nums">{{ regionData.stats.cityCount }}</span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statCities') }}</span>
              </div>
              <div v-if="regionData.stats.costMin && regionData.stats.costMax" class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[140px]">
                <span class="text-2xl font-bold text-emerald-400 tabular-nums">${{ regionData.stats.costMin }} – ${{ regionData.stats.costMax }}</span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statCostRange') }}</span>
              </div>
              <div v-if="regionData.stats.avgSpeed" class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[120px]">
                <span class="text-2xl font-bold text-cyan-400 tabular-nums">{{ regionData.stats.avgSpeed }} <span class="text-sm font-normal">Mbps</span></span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statAvgInternet') }}</span>
              </div>
              <div class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[120px]">
                <span class="text-2xl font-bold text-white tabular-nums">{{ regionData.stats.safetyHighCount }}</span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statSafeCities') }}</span>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- Light content zone — filterable city grid -->
    <section class="bg-gray-100 px-6 pt-16 pb-10">
      <div class="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        <!-- Search + Sort + Filter trigger -->
        <section ref="toolbarRef" class="flex gap-1.5 flex-col md:flex-row items-center">
          <div class="flex-1 max-md:w-full">
            <SearchBar />
          </div>
          <div class="flex gap-2 max-md:w-full">
            <Tooltip :message="$t('tooltip.orderBy')">
              <SinglePicker
                name="orderBy"
                operation="equals"
                :options="translatedOrderByOptions"
                :customDefaultOption="translatedOrderByOptions[0]"
              />
            </Tooltip>
            <Tooltip :message="$t('tooltip.sort')">
              <SortPicker />
            </Tooltip>
            <Tooltip :message="$t('tooltip.favorites')" :disabled="!isLoggedIn">
              <AuthGate :message="$t('favorites.signInRequired')" position="bottom" align="center" v-slot="{ isLocked }">
                <button
                  @click="toggleFavoritesFilter"
                  :disabled="isLocked"
                  class="px-4 py-2.5 flex items-center justify-center rounded-lg border transition-all duration-200"
                  :class="isLocked
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : isFavoritesFilterActive
                      ? 'bg-rose-50 border-rose-300 text-rose-500 hover:bg-rose-100 cursor-pointer shadow-sm shadow-rose-200/50'
                      : 'bg-white border-gray-300 text-gray-400 hover:text-rose-400 hover:border-rose-200 hover:bg-rose-50/50 cursor-pointer'"
                  :aria-label="$t('favorites.onlyFavorites')"
                >
                  <LucideHeart
                    :size="16"
                    :class="[
                      'transition-all duration-200',
                      isFavoritesFilterActive && !isLocked && 'fill-rose-500 scale-110',
                    ]"
                  />
                </button>
              </AuthGate>
            </Tooltip>
            <Tooltip :message="$t('tooltip.filters')" align="right">
              <button
                @click="filtersOpen = true"
                class="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer max-md:flex-1"
                :class="activeFilterCount
                  ? 'bg-primary-50 text-primary-800 border-primary-300 hover:bg-primary-100'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
              >
                <LucideSlidersHorizontal :size="15" />
                <span>{{ $t('filters.title') }}</span>
                <span
                  class="min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 tabular-nums"
                  :class="activeFilterCount
                    ? 'bg-accent-500 text-white'
                    : 'invisible'"
                >
                  {{ activeFilterCount || '0' }}
                </span>
              </button>
            </Tooltip>
          </div>
        </section>

        <!-- Cards Grid -->
        <div class="gap-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <!-- Skeleton Loading -->
          <template v-if="status === 'pending'">
            <div v-for="city in skeletonCount" :key="city" class="aspect-[3/4] rounded-2xl skeleton" />
          </template>

          <!-- City Cards -->
          <template v-else>
            <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group" v-for="city in cities?.data" :key="city.slug">
              <NuxtLink
                :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
                class="absolute inset-0 z-10"
              >
                <img
                  v-if="city.image?.url"
                  :src="unsplashUrl(city.image.url, 400, 530)"
                  :alt="city.name"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <!-- Weather pill (top left) -->
                <div class="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1 text-sm font-medium text-white">
                  <WeatherIcon :weather-icon="city.weatherIcon" />
                  <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
                </div>

                <!-- Bottom info -->
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-base leading-tight truncate">
                    {{ city.name }}, {{ city.country }}
                  </h3>
                  <div class="flex items-center gap-3 mt-2.5 text-xs text-white/70">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="size-2 rounded-full flex-shrink-0"
                        :class="getSafetyDotColor(city.safety)"
                      />
                      <span>{{ formatSafetyLabel(city.safety) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <LucideWifi :size="11" class="text-white/50" />
                      <span>{{ city.internetSpeedCity }} Mbps</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <LucideStar :size="11" class="text-amber-400 fill-amber-400" />
                      <span class="font-semibold text-white">{{ city.totalScore }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>

              <!-- Price + Favorite (top right, above link) -->
              <div class="absolute top-3 right-3 z-20 flex items-center gap-2">
                <div class="bg-black/50 rounded-full px-2.5 py-1 text-sm font-semibold text-emerald-400 tabular-nums pointer-events-none">
                  ${{ city.costForNomadInUsd }}<span class="text-[11px] font-normal text-white/60">/mo</span>
                </div>
                <AuthContainer>
                  <FavoriteButton :city-slug="city.slug" />
                  <template #fallback>
                    <div class="size-9 rounded-full bg-white/10 animate-pulse" />
                  </template>
                </AuthContainer>
              </div>

              <UnsplashCredit v-if="city.image" :owner-name="city.image.ownerName" :owner-username="city.image.ownerUsername" position="bottom-right" />
            </div>
          </template>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
          <section
            v-if="status === 'pending'"
            class="flex items-center justify-center mt-5 gap-1"
          >
            <div class="skeleton rounded-xl size-11"></div>
            <div v-for="n in 5" :key="n" class="skeleton rounded-xl size-11" />
            <div class="skeleton rounded-xl size-11"></div>
          </section>
          <Pagination v-else :pages-count="cities?.pagesCount ?? 0" />
        </div>
      </div>
    </section>

    <!-- Filters Drawer (no region picker — region is fixed by URL) -->
    <FiltersDrawer
      v-model="filtersOpen"
      :cost-min="filters?.data.costs.costMin ?? 0"
      :cost-max="filters?.data.costs.costMax ?? 0"
      :pickers="filters?.pickers"
      :active-filter-count="activeFilterCount"
      :is-favorites-active="isFavoritesFilterActive"
      :hide-regions="true"
      @toggle-favorites="toggleFavoritesFilter"
      @clear-filters="clearAllFilters"
    />

    <!-- Floating filter pill -->
    <Transition name="floating-pill">
      <div
        v-if="showFloatingFilter"
        class="fixed inset-x-0 z-50 flex justify-center pointer-events-none"
        style="bottom: max(1.5rem, calc(0.5rem + env(safe-area-inset-bottom, 0px)))"
      >
        <button
          @click="filtersOpen = true"
          class="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full bg-[#060E1B] text-white shadow-xl shadow-black/20 hover:bg-[#0d1c34] transition-colors cursor-pointer"
        >
          <LucideSlidersHorizontal :size="15" />
          <span class="text-sm font-medium">{{ $t('filters.title') }}</span>
          <span
            v-if="activeFilterCount"
            class="min-w-[18px] h-[18px] rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center px-1 tabular-nums"
          >
            {{ activeFilterCount }}
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@prisma/client'
import type { GetCitiesSchema } from '~/shared/global.schema'
import { LOCALES } from '~/constants/global.constant'
import { DEFAULT_CITIES_LIMIT } from '~/shared/global.schema'
import { getUserCurrentMonthString, OPTIONS_ORDER_BY, REGION_SLUG_MAP } from '~/shared/global.utils'

defineI18nRoute({
  paths: {
    en: '/regions/[region]',
    pl: '/regiony/[region]',
    es: '/regiones/[region]',
    de: '/regionen/[region]',
    pt: '/regioes/[region]',
    fr: '/regions/[region]',
    ko: '/regions/[region]',
    ar: '/regions/[region]',
    tr: '/bolgeler/[region]',
    ja: '/regions/[region]',
    it: '/regioni/[region]',
  },
})

const { t, locale } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const regionSlug = computed(() => route.params.region as string)

if (!(regionSlug.value in REGION_SLUG_MAP)) {
  throw createError({ statusCode: 404, statusMessage: 'Region not found' })
}

const regionEnum = computed(() => REGION_SLUG_MAP[regionSlug.value as keyof typeof REGION_SLUG_MAP])
const regionLabel = computed(() => t(`regions.${regionEnum.value}`))

const { status: authStatus } = useAuth()
const isLoggedIn = computed(() => authStatus.value === 'authenticated')

// Stats — uses the full region aggregate (unaffected by user filters)
const statsQuery = computed(() => ({ region: regionSlug.value }))
const { data: regionData, status: regionStatus } = await useRegion(statsQuery)

// Cities — filterable/paginated, region is always injected from URL
const queryParams = computed(() => ({
  ...route.query,
  months: route.query.months ?? getUserCurrentMonthString(),
  regions: regionEnum.value,
})) as Ref<Partial<GetCitiesSchema>>

const { data: cities, status } = await useCities(queryParams)
const { data: filters } = await useCitiesFilters()

watch(() => queryParams.value.page, () => {
  window?.scrollTo({ top: 0 })
}, { immediate: true })

// noindex when user applies any extra filters (search, price, internet, etc.)
const hasFilters = computed(() => Object.keys(route.query).length > 0)

const translatedOrderByOptions = computed(() =>
  OPTIONS_ORDER_BY.map(opt => ({ ...opt, label: t(`orderBy.${opt.value}`) }))
)

const isFavoritesFilterActive = computed(() => route.query.favoritesOnly === 'true')

function toggleFavoritesFilter() {
  if (!isLoggedIn.value) return
  const query = { ...route.query }
  if (isFavoritesFilterActive.value) {
    delete query.favoritesOnly
  } else {
    query.favoritesOnly = 'true'
  }
  router.push({ query })
}

// Filters drawer — 'regions' excluded since it's locked by the URL
const FILTER_EXCLUDE_PARAMS = ['page', 'q', 'orderBy', 'sort', 'regions']
const activeFilterCount = computed(() =>
  Object.keys(route.query).filter(k => !FILTER_EXCLUDE_PARAMS.includes(k)).length
)

const filtersOpen = ref(false)

function clearAllFilters() {
  router.push({ query: {} })
}

// Floating filter pill
const toolbarRef = ref<HTMLElement | null>(null)
const hasReachedGrid = ref(false)
const isToolbarInView = ref(true)

onMounted(() => {
  if (!toolbarRef.value) return
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) hasReachedGrid.value = true
    isToolbarInView.value = entry.isIntersecting
  })
  observer.observe(toolbarRef.value)
  onUnmounted(() => observer.disconnect())
})

const showFloatingFilter = computed(() =>
  hasReachedGrid.value && !isToolbarInView.value && !filtersOpen.value
)

const skeletonCount = computed(() => Number(route.query.limit) || DEFAULT_CITIES_LIMIT)

const currentMonthName = computed(() =>
  new Date().toLocaleString(locale.value, { month: 'long' })
)

const currentYear = new Date().getFullYear()

const unsplashUrl = (raw: string, w: number, h: number) => {
  if (!raw) return ''
  const sep = raw.includes('?') ? '&' : '?'
  return `${raw}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`
}

const getSafetyDotColor = (level: Level | undefined | null) => {
  if (!level) return 'bg-gray-300'
  if (level === 'HIGH') return 'bg-emerald-500'
  if (level === 'MIDDLE') return 'bg-amber-400'
  return 'bg-red-400'
}

const formatSafetyLabel = (level: Level | undefined | null) => {
  if (!level) return 'N/A'
  const labels: Record<string, string> = {
    HIGH: t('safety.safe'),
    MIDDLE: t('safety.moderate'),
    LOW: t('safety.caution'),
  }
  return labels[level] ?? level.toLowerCase()
}

// SEO
const BASE_URL = 'https://nomad.whoisarjen.com'

const REGION_SEGMENT: Partial<Record<string, string>> = {
  pl: 'regiony', es: 'regiones', de: 'regionen', pt: 'regioes', tr: 'bolgeler', it: 'regioni',
}

const regionHref = (code: string) => {
  const prefix = code === 'en' ? '' : `/${code}`
  const segment = REGION_SEGMENT[code] ?? 'regions'
  return `${BASE_URL}${prefix}/${segment}/${regionSlug.value}`
}

useHead(computed(() => {
  if (!regionData.value) return {}

  const title = t('regionPage.metaTitle', { region: regionLabel.value, year: currentYear })
  const description = t('regionPage.metaDesc', { region: regionLabel.value, count: regionData.value.stats.cityCount })

  const metaTags = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ]

  metaTags.push({ property: 'og:url', content: regionHref(locale.value) })

  const firstCityImageUrl = regionData.value.cities[0]?.image?.url
  if (firstCityImageUrl) {
    metaTags.push({ property: 'og:image', content: unsplashUrl(firstCityImageUrl, 1200, 630) })
  }

  if (hasFilters.value) {
    metaTags.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  const itemListElements = (regionData.value.cities ?? []).slice(0, 10).map((city, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'name': city.name,
    'url': `https://nomad.whoisarjen.com/cities/${city.slug}`,
  }))

  return {
    title,
    meta: metaTags,
    link: [
      { rel: 'canonical', href: regionHref(locale.value) },
      ...LOCALES.map(l => ({
        rel: 'alternate',
        hreflang: l.code as string,
        href: regionHref(l.code),
      })),
      { rel: 'alternate', hreflang: 'x-default', href: regionHref('en') },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': title,
          'description': description,
          'numberOfItems': regionData.value.stats.cityCount,
          'itemListElement': itemListElements,
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://nomad.whoisarjen.com' },
            { '@type': 'ListItem', 'position': 2, 'name': t('regionPage.breadcrumb'), 'item': 'https://nomad.whoisarjen.com/regions' },
            { '@type': 'ListItem', 'position': 3, 'name': regionLabel.value },
          ],
        }),
      },
    ],
  }
}))
</script>
