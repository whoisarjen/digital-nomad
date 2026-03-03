<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- Loading state -->
    <template v-if="!data || status !== 'success'">
      <section class="pt-24 pb-20 px-6">
        <div class="max-w-screen-xl mx-auto flex flex-col gap-4">
          <div class="h-3 skeleton w-40" />
          <div class="h-12 skeleton w-2/3" />
          <div class="h-5 skeleton w-48" />
          <div class="flex gap-2.5 mt-2">
            <div v-for="i in 4" :key="i" class="h-9 skeleton w-28 rounded-full" />
          </div>
        </div>
      </section>
      <div class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10">
        <div class="max-w-screen-xl mx-auto px-6 py-12">
          <div class="h-64 sm:h-80 skeleton w-full rounded-2xl -mt-24 mb-10" />
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <div v-for="i in 6" :key="i" class="h-[104px] skeleton rounded-2xl" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div v-for="i in 4" :key="i" class="h-56 skeleton rounded-2xl" />
          </div>
          <div class="h-48 skeleton rounded-2xl" />
        </div>
      </div>
    </template>

    <!-- Loaded state -->
    <template v-else>
      <!-- ─── Dark Header Zone ─── -->
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
            <span class="text-sm text-primary-400 truncate max-w-[240px]">{{ data.name }}</span>
          </div>

          <!-- City Name -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight">
            {{ data.name }}
          </h1>

          <!-- Country & Region -->
          <div class="flex flex-wrap items-center gap-3 mt-3">
            <span class="text-lg text-white/60">{{ data.country }}</span>
            <span
              v-if="data.region"
              class="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1 text-xs font-medium text-white/50"
            >
              <LucideGlobe :size="12" class="text-primary-400" />
              {{ data.region.replace(/([A-Z])/g, ' $1').trim() }}
            </span>
          </div>

          <!-- Quick Stats Badges -->
          <div class="flex flex-wrap gap-2.5 mt-6">
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70">
              <LucideWallet :size="14" class="text-emerald-400" />
              ${{ data.costForNomadInUsd }}/mo
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70">
              <LucideWifi :size="14" class="text-cyan-400" />
              {{ data.internetSpeedCity }} Mbps
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70">
              <LucideShieldCheck :size="14" :class="getLevelBadgeIconClass(data.safety)" />
              {{ formatLevel(data.safety) }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70">
              <LucideUsers :size="14" class="text-white/40" />
              {{ formatNumber(data.population) }}
            </span>
            <AuthContainer>
              <FavoriteButton :city-slug="citySlug" variant="inline" size="md" />
              <template #fallback>
                <div class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2">
                  <div class="size-[18px] rounded-full bg-white/10 animate-pulse" />
                  <div class="h-4 w-10 rounded bg-white/10 animate-pulse" />
                </div>
              </template>
            </AuthContainer>
          </div>
        </div>
      </section>

      <!-- ─── Light Content Zone ─── -->
      <div class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10">
        <div class="max-w-screen-xl mx-auto px-6 py-12">

          <!-- Hero Image (floating over boundary) -->
          <div class="relative -mt-24 mb-10 rounded-2xl overflow-hidden shadow-2xl aspect-[21/9] group/img">
            <img
              v-if="heroImage.url"
              :src="unsplashUrl(heroImage.url, 1280, 548)"
              :alt="data.name"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <UnsplashCredit :owner-name="heroImage.ownerName" :owner-username="heroImage.ownerUsername" />
          </div>

          <!-- ─── Key Metrics Strip ─── -->
          <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <LucideWallet :size="14" class="text-emerald-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.nomadCost') }}</span>
              </div>
              <p class="text-2xl font-bold text-gray-900 tabular-nums">${{ data.costForNomadInUsd }}<span class="text-sm font-normal text-gray-400">/mo</span></p>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-7 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <LucideWifi :size="14" class="text-cyan-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.internet') }}</span>
              </div>
              <p class="text-2xl font-bold text-gray-900 tabular-nums">{{ data.internetSpeedCity }}<span class="text-sm font-normal text-gray-400"> Mbps</span></p>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <LucideShieldCheck :size="14" class="text-blue-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.safety') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full" :class="getLevelDotClass(data.safety)" />
                <p class="text-lg font-bold capitalize" :class="getLevelTextClass(data.safety)">{{ formatLevel(data.safety) }}</p>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <LucideLeaf :size="14" class="text-green-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.airQuality') }}</span>
              </div>
              <p class="text-2xl font-bold tabular-nums" :class="getAirQualityClass(data.airQualityScore)">{{ data.airQualityScore }}<span class="text-sm font-normal text-gray-400">/5</span></p>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-7 rounded-lg bg-rose-50 flex items-center justify-center">
                  <LucideHeart :size="14" class="text-rose-500" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.healthcare') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full" :class="getLevelDotClass(data.healthCare)" />
                <p class="text-lg font-bold capitalize" :class="getLevelTextClass(data.healthCare)">{{ formatLevel(data.healthCare) }}</p>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <div class="size-7 rounded-lg bg-gray-50 flex items-center justify-center">
                  <LucideUsers :size="14" class="text-gray-500" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.population') }}</span>
              </div>
              <p class="text-2xl font-bold text-gray-900 tabular-nums">{{ formatNumber(data.population) }}</p>
            </div>
          </section>

          <!-- ─── Detail Sections ─── -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <!-- Cost of Living -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <LucideWallet :size="16" class="text-emerald-600" />
                </div>
                {{ $t('city.costOfLiving') }}
              </h2>
              <div class="flex flex-col">
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.nomad') }}</span>
                  <span class="text-sm font-semibold text-emerald-600 tabular-nums">${{ data.costForNomadInUsd }}/mo</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.expat') }}</span>
                  <span class="text-sm font-semibold text-gray-700 tabular-nums">${{ data.costForExpatInUsd }}/mo</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.local') }}</span>
                  <span class="text-sm font-semibold text-gray-700 tabular-nums">${{ data.costForLocalInUsd }}/mo</span>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-sm text-gray-500">{{ $t('city.family') }}</span>
                  <span class="text-sm font-semibold text-gray-700 tabular-nums">${{ data.costForFamilyInUsd }}/mo</span>
                </div>
              </div>
            </section>

            <!-- Internet & Infrastructure -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <LucideWifi :size="16" class="text-cyan-600" />
                </div>
                {{ $t('city.internetInfrastructure') }}
              </h2>
              <div class="flex flex-col">
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.citySpeed') }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-cyan-600 tabular-nums">{{ data.internetSpeedCity }} Mbps</span>
                    <span v-if="data.internetSpeedCityRanking" class="text-[10px] font-medium text-gray-400 bg-gray-50 rounded-full px-2 py-0.5 tabular-nums">#{{ data.internetSpeedCityRanking }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-sm text-gray-500">{{ $t('city.countrySpeed') }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-gray-700 tabular-nums">{{ data.internetSpeedCountry }} Mbps</span>
                    <span v-if="data.internetSpeedCountryRanking" class="text-[10px] font-medium text-gray-400 bg-gray-50 rounded-full px-2 py-0.5 tabular-nums">#{{ data.internetSpeedCountryRanking }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Environment & Health -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <LucideLeaf :size="16" class="text-green-600" />
                </div>
                {{ $t('city.environmentHealth') }}
              </h2>
              <div class="flex flex-col">
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.airQualityNow') }}</span>
                  <span class="text-sm font-semibold text-gray-700 tabular-nums">{{ data.airQualityNow }} AQI</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.airQualityScore') }}</span>
                  <span class="text-sm font-semibold tabular-nums" :class="getAirQualityClass(data.airQualityScore)">{{ data.airQualityScore }}/5</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.humidity') }}</span>
                  <span class="text-sm font-semibold text-gray-700">{{ data.humidity }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.pollution') }}</span>
                  <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.pollution, true)">{{ formatLevel(data.pollution) }}</span>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-sm text-gray-500">{{ $t('city.climate') }}</span>
                  <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.climate)">{{ formatLevel(data.climate) }}</span>
                </div>
              </div>
            </section>

            <!-- Quality of Life -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <LucideHeart :size="16" class="text-rose-500" />
                </div>
                {{ $t('city.qualityOfLife') }}
              </h2>
              <div class="flex flex-col">
                <div class="flex justify-between items-center py-3 border-b border-gray-50">
                  <span class="text-sm text-gray-500">{{ $t('city.safety') }}</span>
                  <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.safety)">{{ formatLevel(data.safety) }}</span>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-sm text-gray-500">{{ $t('city.healthcare') }}</span>
                  <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.healthCare)">{{ formatLevel(data.healthCare) }}</span>
                </div>
              </div>
            </section>
          </div>

          <!-- ─── Monthly Weather ─── -->
          <section class="bg-white rounded-2xl border border-gray-100 p-6 mb-10">
            <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
              <div class="size-8 rounded-xl bg-primary-50 flex items-center justify-center">
                <LucideCalendar :size="16" class="text-primary-600" />
              </div>
              {{ $t('city.monthlyWeather') }}
            </h2>
            <p v-if="bestMonthLabels" class="text-sm text-gray-500 mb-4">
              <span class="font-medium text-emerald-600">{{ $t('city.bestMonths', { months: bestMonthLabels }) }}</span>
              <span class="mx-2 text-gray-300">·</span>
              <span class="font-medium text-red-500">{{ $t('city.avoidMonths', { months: avoidMonthLabels }) }}</span>
            </p>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              <div
                v-for="(monthData, index) in months"
                :key="index"
                class="flex flex-col items-center rounded-xl p-3 transition-all border"
                :class="{
                  'bg-emerald-50/60 border-emerald-200': monthData.totalScoreLevel === 'HIGH',
                  'bg-amber-50/60 border-amber-200': monthData.totalScoreLevel === 'MIDDLE',
                  'bg-gray-50 border-gray-100': monthData.totalScoreLevel === 'LOW',
                }"
              >
                <span
                  class="text-[11px] font-semibold uppercase tracking-wide"
                  :class="{
                    'text-emerald-600': monthData.totalScoreLevel === 'HIGH',
                    'text-amber-600': monthData.totalScoreLevel === 'MIDDLE',
                    'text-gray-400': monthData.totalScoreLevel === 'LOW',
                  }"
                >{{ getMonthShort(monthData.month) }}</span>
                <div class="my-2">
                  <WeatherIcon :weather-icon="monthData.weatherIcon" />
                </div>
                <span class="text-lg font-bold text-gray-900 tabular-nums">{{ Number(monthData.apparentTemperatureMax).toFixed(0) }}°</span>
                <div class="flex flex-col items-center mt-1.5 gap-0.5">
                  <span class="text-[10px] text-gray-400 tabular-nums">{{ Number(monthData.rainSum).toFixed(0) }}mm</span>
                  <span class="text-[10px] text-gray-400 tabular-nums">{{ Number(monthData.sunshineDuration).toFixed(0) }}h</span>
                </div>
                <span
                  class="mt-1.5 text-xs font-bold tabular-nums"
                  :class="{
                    'text-emerald-600': monthData.totalScoreLevel === 'HIGH',
                    'text-amber-600': monthData.totalScoreLevel === 'MIDDLE',
                    'text-gray-400': monthData.totalScoreLevel === 'LOW',
                  }"
                >{{ monthData.totalScore }}</span>
                <span
                  v-if="bestMonthNumbers.has(monthData.month)"
                  class="mt-1 text-[9px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5"
                >{{ $t('city.bestLabel') }}</span>
                <span
                  v-else-if="avoidMonthNumbers.has(monthData.month)"
                  class="mt-1 text-[9px] font-bold uppercase tracking-wide text-red-500 bg-red-50 rounded px-1.5 py-0.5"
                >{{ $t('city.avoidLabel') }}</span>
              </div>
            </div>
          </section>

          <!-- ─── Related Articles ─── -->
          <CityArticlesWidget :city-slug="citySlug" />

          <!-- ─── Compare CTA ─── -->
          <div class="mt-10">
            <NuxtLink
              :to="localePath('compare')"
              class="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <LucideSparkles :size="14" />
              {{ $t('compare.compareWith') }}
            </NuxtLink>
          </div>

          <!-- ─── Back to Explore ─── -->
          <div class="mt-4 pb-4">
            <NuxtLink
              :to="localePath('index')"
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary-600 transition-colors"
            >
              <LucideArrowLeft :size="14" />
              {{ $t('nav.exploreCities') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Level } from '@prisma/client';
import { formatNumber } from '~/shared/global.utils';
import { LOCALES } from '~/constants/global.constant';

defineI18nRoute({
  paths: {
    en: '/cities/[slug]',
    pl: '/miasta/[slug]',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()

const citySlug = computed(() => route.params.slug as string)

const queryParams = ref({
  slug: route.params.slug as string,
})

watch(
  () => route.params.slug as string,
  (slug) => {
    if (slug) {
      queryParams.value.slug = slug
    }
  },
  { immediate: true }
)

const { data, status } = await useCitiesBySlug(queryParams, {
  lazy: true,
})

const unsplashUrl = (raw: string, w: number, h: number) => {
  if (!raw) return ''
  const sep = raw.includes('?') ? '&' : '?'
  return `${raw}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`
}

const heroImage = computed(() => data.value?.image ?? {
  ownerName: 'Tan Kaninthanond',
  ownerUsername: 'tankanin',
  url: '/photo-1535117399959-7df1714b4202?ixid=M3w3MjU5NzR8MHwxfHNlYXJjaHw1fHxCYW5na29rfGVufDB8fHx8MTc0MjYxMjM3Mnww&ixlib=rb-4.0.3&',
})

const months = computed(() => {
  const getMedian = (arr: number[]) => {
    const sorted = arr.slice().sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2
  }

  const low = getMedian(data.value?.monthSummary.map((item) => item.totalScore) ?? [])
  const middle = getMedian(data.value?.monthSummary.map((item) => item.totalScore).filter(value => value >= low) ?? [])

  return data.value?.monthSummary.map((item) => {
    const totalScore = item.totalScore
    const totalScoreLevel =
      totalScore < low ? 'LOW' :
      totalScore < middle ? 'MIDDLE' :
      'HIGH'

    return { ...item, totalScoreLevel }
  })
})

const sortedByScore = computed(() =>
  [...(data.value?.monthSummary ?? [])].sort((a, b) => b.totalScore - a.totalScore)
)
const bestMonthNumbers = computed(() => new Set(sortedByScore.value.slice(0, 3).map(m => m.month)))
const avoidMonthNumbers = computed(() => new Set(sortedByScore.value.slice(-3).map(m => m.month)))

const getMonthShort = (month: string) => {
  return new Date(2023, Number(month) - 1).toLocaleString(getLocaleBcp47(locale.value), { month: 'short' })
}

const bestMonthLabels = computed(() => sortedByScore.value.slice(0, 3).map(m => getMonthShort(m.month)).join(', '))
const avoidMonthLabels = computed(() => sortedByScore.value.slice(-3).map(m => getMonthShort(m.month)).join(', '))

const formatLevel = (level: Level | undefined | null) => {
  if (!level) return 'N/A'
  return t(`levels.${level.toLowerCase()}`)
}

const getLevelDotClass = (level: Level | undefined | null) => {
  if (!level) return 'bg-gray-400'
  if (level === 'HIGH') return 'bg-emerald-500'
  if (level === 'MIDDLE') return 'bg-yellow-500'
  return 'bg-red-500'
}

const getLevelTextClass = (level: Level | undefined | null, inverted = false) => {
  if (!level) return 'text-gray-500'
  const isGood = inverted ? level === 'LOW' : level === 'HIGH'
  const isMid = level === 'MIDDLE'
  if (isGood) return 'text-emerald-600'
  if (isMid) return 'text-yellow-600'
  return 'text-red-600'
}

const getLevelBadgeIconClass = (level: Level | undefined | null) => {
  if (!level) return 'text-white/40'
  if (level === 'HIGH') return 'text-emerald-400'
  if (level === 'MIDDLE') return 'text-amber-400'
  return 'text-red-400'
}

const getAirQualityClass = (score: number) => {
  if (score >= 4) return 'text-emerald-600'
  if (score >= 3) return 'text-yellow-600'
  return 'text-red-600'
}

const BASE_URL = 'https://nomad.whoisarjen.com'

useHead(() => {
  if (!data.value) return {}

  const { name, country, costForNomadInUsd, internetSpeedCity, safety } = data.value
  const slug = citySlug.value
  const title = `${name}, ${country} — Digital Nomad Guide`
  const description = `Live and work in ${name}. Nomad cost $${costForNomadInUsd}/mo, ${internetSpeedCity} Mbps internet, ${formatLevel(safety)} safety rating.`

  const getCityUrl = (code: string) => {
    if (code === 'en') return `${BASE_URL}/cities/${slug}`
    if (code === 'pl') return `${BASE_URL}/pl/miasta/${slug}`
    return `${BASE_URL}/${code}/cities/${slug}`
  }

  const currentUrl = getCityUrl(locale.value)

  const hreflangLinks = [
    ...LOCALES.map(l => ({ rel: 'alternate', hreflang: l.code as string, href: getCityUrl(l.code) })),
    { rel: 'alternate', hreflang: 'x-default', href: getCityUrl('en') },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Cities', 'item': `${BASE_URL}/cities` },
        { '@type': 'ListItem', 'position': 3, 'name': name, 'item': currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      'name': name,
      'url': currentUrl,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': name,
        'addressCountry': country,
      },
    },
  ]

  const imageUrl = data.value.image?.url
  const ogImage = imageUrl?.startsWith('https://')
    ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}w=1200&h=630&fit=crop&auto=format&q=80`
    : undefined

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      ...(ogImage ? [
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
      ] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'canonical', href: currentUrl },
      ...hreflangLinks,
    ],
    script: jsonLd.map(ld => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(ld),
    })),
  }
})
</script>
