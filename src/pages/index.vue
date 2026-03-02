<template>
  <div class="bg-gray-100">
    <!-- ══════════════════════════════════════════ -->
    <!-- PART 1 — LANDING / MARKETING              -->
    <!-- ══════════════════════════════════════════ -->

    <!-- Hero + Features (continuous dark zone) -->
    <div class="bg-[#060E1B] text-white">

      <!-- Hero -->
      <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6">
        <!-- Animated gradient orbs -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-1/4 -left-[10%] w-[55%] h-[55%] rounded-full bg-primary-500/[0.07] blur-[120px] animate-float" />
          <div class="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full bg-accent-500/[0.05] blur-[100px] animate-float-reverse" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-cyan-400/[0.04] blur-[80px] animate-float-slow" />
        </div>

        <!-- Dot grid -->
        <div
          class="absolute inset-0 opacity-30"
          style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.035)'/%3E%3C/svg%3E&quot;);"
        />

        <!-- Content -->
        <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-7 py-12">
          <!-- Tagline pill -->
          <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400">
            <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {{ $t('landing.tagline') }}
          </div>

          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.08]">
            {{ $t('hero.titleLine1') }}<br />
            <span class="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
              {{ $t('hero.titleLine2') }}
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            {{ $t('hero.subtitle') }}
          </p>

          <!-- Feature badges -->
          <div class="flex flex-wrap justify-center gap-3">
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideWallet :size="15" class="text-emerald-400" />
              {{ $t('hero.badgeCost') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideThermometer :size="15" class="text-amber-400" />
              {{ $t('hero.badgeWeather') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideWifi :size="15" class="text-cyan-400" />
              {{ $t('hero.badgeInternet') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideShieldCheck :size="15" class="text-emerald-400" />
              {{ $t('hero.badgeSafety') }}
            </span>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap justify-center gap-4">
            <a
              href="#explore"
              class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-accent-500/25"
            >
              {{ $t('hero.cta') }}
              <LucideChevronDown :size="18" />
            </a>
            <NuxtLink
              :to="localePath(isLoggedIn ? 'dashboard' : 'join')"
              class="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all"
            >
              {{ isLoggedIn ? $t('dashboard.title') : $t('landing.ctaJoin') }}
              <LucideArrowRight :size="18" />
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap justify-center gap-6 sm:gap-10 mt-2">
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold">500+</span>
              <span class="text-xs text-gray-500">{{ $t('landing.statCitiesLabel') }}</span>
            </div>
            <div class="hidden sm:block w-px h-12 bg-white/10" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold">12+</span>
              <span class="text-xs text-gray-500">{{ $t('landing.statDataLabel') }}</span>
            </div>
            <div class="hidden sm:block w-px h-12 bg-white/10" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold text-emerald-400">{{ $t('landing.free') }}</span>
              <span class="text-xs text-gray-500">{{ $t('landing.statAccessLabel') }}</span>
            </div>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce">
          <LucideChevronDown :size="22" />
        </div>
      </section>

      <!-- Features + Roadmap (combined) -->
      <section class="py-20 sm:py-28 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-14">
            <h2 class="text-3xl md:text-4xl font-bold mb-3">{{ $t('landing.featuresTitle') }}</h2>
            <p class="text-gray-400 max-w-xl mx-auto text-base">{{ $t('landing.featuresSubtitle') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Cost -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <LucideWallet :size="20" class="text-emerald-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureCostTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureCostDesc') }}</p>
            </div>
            <!-- 12+ Data Points -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <LucideBarChart3 :size="20" class="text-primary-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureDataTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureDataDesc') }}</p>
            </div>
            <!-- Internet -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <LucideWifi :size="20" class="text-cyan-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureInternetTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureInternetDesc') }}</p>
            </div>
            <!-- City comparison -->
            <NuxtLink
              :to="localePath('compare')"
              class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative block"
            >
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400">{{ $t('landing.new') }}</span>
              <div class="size-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <LucideSparkles :size="20" class="text-primary-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureCompareTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureCompareDesc') }}</p>
            </NuxtLink>
            <!-- Updated Monthly (soon) -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative">
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-accent-500/15 text-accent-400">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <LucideCalendar :size="20" class="text-gray-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureUpdatedTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureUpdatedDesc') }}</p>
            </div>
            <!-- Monthly cost alerts (soon) -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative">
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-accent-500/15 text-accent-400">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <LucideBell :size="20" class="text-gray-400" />
              </div>
              <h3 class="font-semibold mb-1.5">Monthly cost alerts</h3>
              <p class="text-sm text-gray-400 leading-relaxed">Get notified when cost of living changes in your saved cities</p>
            </div>
          </div>

          <!-- Join to vote -->
          <div v-if="!isLoggedIn" class="mt-8 text-center">
            <NuxtLink
              :to="localePath('join')"
              class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {{ $t('roadmap.joinToVote') }}
              <LucideArrowRight :size="14" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- PART 2 — APP FUNCTIONALITY                -->
    <!-- ══════════════════════════════════════════ -->

    <section class="bg-gray-100 px-6 pt-16 pb-10" id="explore">
      <!-- Section header -->
      <div class="text-center mb-10 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('landing.exploreAllTitle') }}</h2>
        <p class="text-gray-500">{{ $t('landing.exploreAllSubtitle') }}</p>
      </div>

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
                  class="h-full px-4 py-2 flex items-center justify-center rounded-lg border transition-all duration-200"
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

        <!-- Cards + Pagination -->
            <!-- Cards Grid -->
            <div class="gap-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <!-- Skeleton Loading -->
              <template v-if="status === 'pending'">
                <div v-for="city in 12" :key="city" class="aspect-[3/4] rounded-2xl skeleton" />
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
                      <span class="text-white/50 text-xs mt-0.5 block">
                        {{ city.region?.replace(/([A-Z])/g, ' $1').trim() }}
                      </span>
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

    <!-- Filters Drawer -->
    <FiltersDrawer
      v-model="filtersOpen"
      :cost-min="filters?.data.costs.costMin ?? 0"
      :cost-max="filters?.data.costs.costMax ?? 0"
      :pickers="filters?.pickers"
      :active-filter-count="activeFilterCount"
      :is-favorites-active="isFavoritesFilterActive"
      @toggle-favorites="toggleFavoritesFilter"
      @clear-filters="clearAllFilters"
    />

    <!-- Floating filter pill (appears when toolbar scrolls out of view) -->
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
import type { Level } from '@prisma/client';
import type { GetCitiesSchema } from '~/shared/global.schema';
import { getUserCurrentMonthString, OPTIONS_ORDER_BY } from '~/shared/global.utils';

defineI18nRoute({
  paths: {
    en: '/',
    pl: '/',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()

const route = useRoute()
const router = useRouter()

const { status: authStatus } = useAuth()
const isLoggedIn = computed(() => authStatus.value === 'authenticated')

const unsplashUrl = (raw: string, w: number, h: number) => {
  if (!raw) return ''
  const sep = raw.includes('?') ? '&' : '?'
  return `${raw}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`
}

const hasFilters = computed(() => Object.keys(route.query).length > 0)

useHead({
  meta: computed(() => hasFilters.value ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
  script: [
    { src: 'https://beamback.whoisarjen.com/widget.js', 'data-api-key': 'ak_ED-ioa4wqla6_w1VdE6Hs', defer: true },
  ],
})

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
const queryParams = computed(() => ({
  ...route.query,
  months: route.query.months ?? getUserCurrentMonthString(),
})) as Ref<Partial<GetCitiesSchema>>

const { data: cities, status } = await useCities(queryParams)
const { data: filters } = await useCitiesFilters()

watch(() => queryParams.value.page, () => {
  window?.scrollTo({ top: 0 });
}, { immediate: true })

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

// Filters drawer
const filtersOpen = ref(false)

const FILTER_EXCLUDE_PARAMS = ['page', 'q', 'orderBy', 'sort']
const activeFilterCount = computed(() =>
  Object.keys(route.query).filter(k => !FILTER_EXCLUDE_PARAMS.includes(k)).length
)

function clearAllFilters() {
  router.push({ query: {} })
}

// Floating filter pill — appears when toolbar scrolls out of view
const toolbarRef = ref<HTMLElement | null>(null)
const hasReachedExplore = ref(false)
const isToolbarInView = ref(true)

useIntersectionObserver(toolbarRef, ([{ isIntersecting }]) => {
  if (isIntersecting) hasReachedExplore.value = true
  isToolbarInView.value = isIntersecting
})

const showFloatingFilter = computed(() =>
  hasReachedExplore.value && !isToolbarInView.value && !filtersOpen.value
)
</script>
