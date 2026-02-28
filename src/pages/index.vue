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
              :to="localePath('join')"
              class="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all"
            >
              {{ $t('landing.ctaJoin') }}
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
            <!-- Weather -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <LucideCloudSun :size="20" class="text-amber-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureWeatherTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureWeatherDesc') }}</p>
            </div>
            <!-- Internet -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <LucideWifi :size="20" class="text-cyan-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureInternetTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureInternetDesc') }}</p>
            </div>
            <!-- Safety -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <LucideShieldCheck :size="20" class="text-emerald-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureSafetyTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureSafetyDesc') }}</p>
            </div>
            <!-- 12+ Data Points -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <LucideBarChart3 :size="20" class="text-primary-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureDataTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureDataDesc') }}</p>
            </div>
            <!-- Updated Monthly (soon) -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative">
              <span class="absolute top-4 right-4 text-[10px] font-semibold bg-accent-500/15 text-accent-400 rounded-full px-2.5 py-0.5">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                <LucideCalendar :size="20" class="text-accent-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureUpdatedTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureUpdatedDesc') }}</p>
            </div>
            <!-- Roadmap features (soon) -->
            <div
              v-for="feature in roadmapFeatures"
              :key="feature.id"
              class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative"
            >
              <span class="absolute top-4 right-4 text-[10px] font-semibold bg-accent-500/15 text-accent-400 rounded-full px-2.5 py-0.5">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <LucideSparkles :size="20" class="text-gray-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ feature.name }}</h3>
              <p v-if="feature.description" class="text-sm text-gray-400 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>

          <!-- Join to vote -->
          <div class="mt-8 text-center">
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

    <!-- Top Cities Showcase -->
    <section v-if="highlights?.topCities?.length" class="bg-gray-50 py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('landing.topCitiesTitle') }}</h2>
          <p class="text-gray-500">{{ $t('landing.topCitiesSubtitle') }}</p>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          <NuxtLink
            v-for="city in highlights.topCities"
            :key="city.slug"
            :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
            class="relative flex-shrink-0 w-[220px] lg:w-auto aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <NuxtImg
              v-if="city.imageUrl"
              provider="unsplash"
              :src="city.imageUrl.replace('https://images.unsplash.com', '')"
              :alt="city.name"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              quality="70"
              width="300"
              height="400"
            />
            <div v-else class="absolute inset-0 bg-gray-200" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white font-semibold text-base leading-tight">{{ city.name }}</h3>
              <p class="text-white/60 text-sm">{{ city.country }}</p>
              <div class="flex items-center gap-3 mt-2 text-xs text-white/80">
                <span class="flex items-center gap-1">
                  <LucideStar :size="11" class="text-amber-400 fill-amber-400" />
                  {{ city.totalScore }}
                </span>
                <span v-if="city.cost">${{ city.cost }}</span>
                <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- PART 2 — APP FUNCTIONALITY                -->
    <!-- ══════════════════════════════════════════ -->

    <section class="bg-gray-100 px-6 pt-16 pb-10" id="explore">
      <!-- Section header -->
      <div class="text-center mb-10 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('landing.exploreAllTitle') }}</h2>
        <p class="text-gray-500">{{ $t('landing.exploreAllSubtitle') }}</p>
      </div>

      <div class="flex flex-col gap-6">
        <!-- Search + Sort -->
        <section class="flex gap-6 justify-end flex-col md:flex-row items-center">
          <div class="flex-1 bg-white">
            <SearchBar />
          </div>
          <div class="flex gap-1 max-md:w-full">
            <SinglePicker
              name="orderBy"
              operation="equals"
              :options="translatedOrderByOptions"
              :customDefaultOption="translatedOrderByOptions[0]"
            />
            <SortPicker />
          </div>
        </section>

        <!-- Filters + Cards -->
        <section class="flex max-md:flex-col gap-6 max-md:items-center">
          <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
            <h3 class="text-xl font-bold">{{ $t('filters.title') }}</h3>
            <div
              @click="() => isClearFilter && router.push({ query: {} })"
              class="px-4 py-2 rounded-xl border text-center text-sm text-white"
              :class="{
                'bg-red-600 hover:bg-red-700 cursor-pointer': isClearFilter,
                'cursor-not-allowed opacity-50 bg-gray-400 hover:bg-gray-400': !isClearFilter,
              }"
            >
              {{ $t('filters.clear') }}
            </div>
            <MonthsPicker />
            <TemperaturesPicker />
            <WeathersPicker />
            <RegionsPicker />
            <PricesPicker :min="filters?.data.costs.costMin ?? 0" :max="filters?.data.costs.costMax ?? 0" />
            <template v-if="filters?.pickers">
              <SinglePicker
                v-for="key of Object.keys(filters?.pickers)"
                :key="key"
                :name="key"
                :operation="filters['pickers'][key as keyof typeof filters['pickers']].operation"
                :options="filters['pickers'][key as keyof typeof filters['pickers']].options"
                isLabel
              />
            </template>
          </aside>

          <div class="flex flex-col gap-6 flex-1 w-full">
            <div
              v-if="isClearFilter"
              class="text-sm flex gap-1 items-center"
            >
              <b>{{ $t('filters.filtersLabel') }}</b>
              <span>{{ Object.entries(queryParams).map(([key, value]) =>
                `${key.split('_').map(upperFirst).join(' ')} (${key === 'months'
                  ? new Date(2025, Number(value) - 1).toLocaleString(locale === 'pl' ? 'pl-PL' : 'en-US', { month: 'long' }).toLowerCase()
                  : `${filters?.pickers[key as keyof typeof filters['pickers']]?.operation === 'lte' ? '≤' : ''}${value}`.toLowerCase().split(',').join(', ').replace('gte:', '').replace('lte:', '')}${filters?.pickers[key as keyof typeof filters['pickers']]?.operation === 'gte' ? '≤' : ''})`).join(', ') }}
                </span>
            </div>

            <!-- Cards Grid -->
            <div class="gap-5 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <!-- Skeleton Loading -->
              <template v-if="status === 'pending'">
                <div v-for="city in 12" :key="city" class="bg-white rounded-xl overflow-hidden">
                  <div class="aspect-[3/2] skeleton rounded-none" />
                  <div class="px-4 pt-3.5 pb-1 flex justify-between items-start gap-3">
                    <div class="flex-1">
                      <div class="h-4 skeleton w-3/4" />
                      <div class="h-3 skeleton w-1/3 mt-1.5" />
                    </div>
                    <div class="h-4 skeleton w-16" />
                  </div>
                  <div class="px-4 pb-3.5 pt-2 flex justify-between">
                    <div class="h-3 skeleton w-12" />
                    <div class="h-3 skeleton w-14" />
                    <div class="h-3 skeleton w-8" />
                  </div>
                </div>
              </template>

              <!-- City Cards -->
              <template v-else>
                <div class="relative w-full" v-for="city in cities?.data" :key="city.slug">
                  <NuxtLink
                    :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
                    class="bg-white cursor-pointer rounded-xl overflow-hidden border border-gray-200 w-full flex flex-col"
                  >
                    <!-- Photo -->
                    <div class="relative aspect-[3/2] overflow-hidden">
                      <NuxtImg
                        provider="unsplash"
                        :src="city.image?.url.replace('https://images.unsplash.com', '')"
                        :alt="city.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        quality="75"
                        width="480"
                        height="320"
                        sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                      />
                      <!-- Weather pill -->
                      <div class="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-full px-2.5 py-1 text-sm font-medium text-white">
                        <WeatherIcon :weather-icon="city.weatherIcon" />
                        <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
                      </div>
                    </div>

                    <!-- Identity + Price -->
                    <div class="flex items-start justify-between gap-3 px-4 pt-3.5 pb-1">
                      <div class="min-w-0">
                        <h3 class="text-base font-semibold text-gray-900 leading-tight truncate">
                          {{ city.name }}, {{ city.country }}
                        </h3>
                        <span class="text-xs text-gray-400 mt-0.5 block">
                          {{ city.region?.replace(/([A-Z])/g, ' $1').trim() }}
                        </span>
                      </div>
                      <span class="text-base font-bold text-emerald-600 tabular-nums whitespace-nowrap flex-shrink-0 leading-tight">
                        ${{ city.costForNomadInUsd }}<span class="text-[11px] font-normal text-gray-400">/mo</span>
                      </span>
                    </div>

                    <!-- Supporting Metrics -->
                    <div class="flex items-center justify-between px-4 pb-3.5 pt-2 text-xs text-gray-500">
                      <div class="flex items-center gap-1.5">
                        <span
                          class="size-2 rounded-full flex-shrink-0"
                          :class="getSafetyDotColor(city.safety)"
                        />
                        <span>{{ formatSafetyLabel(city.safety) }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <LucideWifi :size="12" class="text-gray-400" />
                        <span>{{ city.internetSpeedCity }} Mbps</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <LucideStar :size="12" class="text-amber-400 fill-amber-400" />
                        <span class="font-semibold text-gray-700">{{ city.totalScore }}</span>
                      </div>
                    </div>
                  </NuxtLink>

                  <!-- Photo credit -->
                  <div v-if="city.image" class="absolute top-0 right-0 pointer-events-auto text-[10px] text-white/70 bg-black/40 py-0.5 px-1.5 rounded-bl-md z-10" :style="{ top: 0, right: 0 }">
                    <a target="_blank" :href="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`" class="hover:text-white">{{ city.image.ownerName }}</a> / <a target="_blank" href="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral" class="hover:text-white">Unsplash</a>
                  </div>
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

        <!-- Bottom Stats -->
        <section class="mt-8 mb-2">
          <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span class="flex items-center gap-1.5">
              <LucideMapPin :size="14" class="text-primary-400" />
              {{ $t('hero.statCities') }}
            </span>
            <span class="flex items-center gap-1.5">
              <LucideCalendar :size="14" class="text-primary-400" />
              {{ $t('hero.statUpdated') }}
            </span>
            <span v-if="highlights?.peakCount" class="flex items-center gap-1.5">
              <LucideTrendingUp :size="14" class="text-amber-400" />
              {{ $t('landing.peakCities', { count: highlights.peakCount }) }}
            </span>
            <span class="flex items-center gap-1.5 text-emerald-600 font-medium">
              {{ $t('landing.free') }}
            </span>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@prisma/client';
import upperFirst from 'lodash/upperFirst';
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

const hasFilters = computed(() => Object.keys(route.query).length > 0)

useHead({
  meta: computed(() => hasFilters.value ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
  script: [
    { src: 'https://beamback.whoisarjen.com/widget.js', 'data-api-key': 'ak_ED-ioa4wqla6_w1VdE6Hs', defer: true },
  ],
})

const route = useRoute()
const router = useRouter()

const translatedOrderByOptions = computed(() =>
  OPTIONS_ORDER_BY.map(opt => ({ ...opt, label: t(`orderBy.${opt.value}`) }))
)

const isClearFilter = computed(() => Object.keys(route.query).length)
const queryParams = computed(() => ({
  ...route.query,
  months: route.query.months ?? getUserCurrentMonthString(),
})) as Ref<Partial<GetCitiesSchema>>

const { data: cities, status } = await useCities(queryParams)
const { data: filters } = await useCitiesFilters()
const { data: highlightsData } = await useLandingHighlights({ lazy: true })
const { data: featuresData } = await useFeatures({ lazy: true })

const highlights = computed(() => highlightsData.value as any)
const roadmapFeatures = computed(() => {
  const features = (featuresData.value as any)?.data ?? []
  return features.slice(0, 3)
})

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
</script>
