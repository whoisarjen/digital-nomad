<template>
  <div class="bg-gray-100">
    <!-- Dark hero zone -->
    <div class="bg-[#060E1B] text-white">
      <!-- Loading skeleton -->
      <template v-if="!countryData || countryStatus !== 'success'">
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
              <NuxtLink :to="localePath('countries')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
                {{ $t('countryPage.allCountries') }}
              </NuxtLink>
              <span class="text-white/20">/</span>
              <span class="text-sm text-primary-400">{{ countryData.country }}</span>
            </div>

            <!-- Flag + H1 -->
            <div class="flex items-center gap-4 mb-3">
              <span class="text-6xl leading-none">{{ flag }}</span>
              <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight">
                {{ $t('countryPage.heading', { country: countryData.country }) }}
              </h1>
            </div>

            <!-- Subtitle -->
            <p class="mt-1 text-lg text-white/50">
              {{ $t('regionPage.subtitle', { count: countryData.stats.cityCount, month: currentMonthName }) }}
            </p>

            <!-- Stats chips -->
            <div class="flex flex-wrap gap-4 mt-8">
              <div class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[120px]">
                <span class="text-2xl font-bold text-white tabular-nums">{{ countryData.stats.cityCount }}</span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statCities') }}</span>
              </div>
              <div v-if="countryData.stats.costMin && countryData.stats.costMax" class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[140px]">
                <span class="text-2xl font-bold text-emerald-400 tabular-nums">${{ countryData.stats.costMin }} – ${{ countryData.stats.costMax }}</span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statCostRange') }}</span>
              </div>
              <div v-if="countryData.stats.avgSpeed" class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[120px]">
                <span class="text-2xl font-bold text-cyan-400 tabular-nums">{{ countryData.stats.avgSpeed }} <span class="text-sm font-normal">Mbps</span></span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statAvgInternet') }}</span>
              </div>
              <div class="flex flex-col gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 min-w-[120px]">
                <span class="text-2xl font-bold text-white tabular-nums">{{ countryData.stats.safetyHighCount }}</span>
                <span class="text-xs text-white/40 uppercase tracking-wide">{{ $t('regionPage.statSafeCities') }}</span>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- Light content zone — top cities -->
    <section class="bg-gray-100 px-6 pt-12 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <!-- Skeleton -->
        <template v-if="!countryData || countryStatus !== 'success'">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div v-for="i in 10" :key="i" class="aspect-[3/4] rounded-2xl skeleton" />
          </div>
        </template>

        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="city in countryData.cities"
              :key="city.slug"
              class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group"
            >
              <NuxtLink
                :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
                class="absolute inset-0 z-10"
              >
                <CustomNuxtImg
                  v-if="city.image?.url"
                  :src="city.image.url"
                  :alt="city.name"
                  width="400"
                  height="530"
                  sizes="sm:50vw md:33vw lg:25vw xl:20vw 100vw"
                  quality="75"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <!-- Weather pill -->
                <div class="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1 text-sm font-medium text-white">
                  <WeatherIcon :weather-icon="city.weatherIcon" />
                  <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
                </div>

                <!-- Price -->
                <div class="absolute top-3 right-3 z-20 bg-black/50 rounded-full px-2.5 py-1 text-sm font-semibold text-emerald-400 tabular-nums pointer-events-none">
                  ${{ city.costForNomadInUsd }}<span class="text-[11px] font-normal text-white/60">/mo</span>
                </div>

                <!-- Bottom info -->
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-base leading-tight truncate">{{ city.name }}</h3>
                  <div class="flex items-center gap-3 mt-2 text-xs text-white/70">
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

              <UnsplashCredit v-if="city.image" :owner-name="city.image.ownerName" :owner-username="city.image.ownerUsername" position="bottom-right" />
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@prisma/client'

defineI18nRoute({
  paths: {
    en: '/countries/[countrySlug]',
    pl: '/kraje/[countrySlug]',
    es: '/paises/[countrySlug]',
    de: '/laender/[countrySlug]',
    pt: '/paises/[countrySlug]',
    fr: '/pays/[countrySlug]',
    ko: '/countries/[countrySlug]',
    ar: '/countries/[countrySlug]',
    tr: '/ulkeler/[countrySlug]',
    ja: '/countries/[countrySlug]',
    it: '/paesi/[countrySlug]',
  },
})

const { t, locale } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()

const countrySlugParam = computed(() => route.params.countrySlug as string)
const statsQuery = computed(() => ({ countrySlug: countrySlugParam.value }))
const { data: countryData, status: countryStatus } = await useCountry(statsQuery)

const flag = computed(() => {
  const code = countryData.value?.countryCode
  if (!code) return '🌍'
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + 127397))
})

const currentMonthName = computed(() =>
  new Date().toLocaleString(locale.value, { month: 'long' })
)

const currentYear = new Date().getFullYear()


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

useHead(() => {
  if (!countryData.value) return {}

  const title = t('countryPage.title', { country: countryData.value.country, year: currentYear })
  const description = t('countryPage.description', { count: countryData.value.stats.cityCount, country: countryData.value.country })

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }
})

useSchemaOrg(() => {
  if (!countryData.value) return []

  const title = t('countryPage.title', { country: countryData.value.country, year: currentYear })
  const description = t('countryPage.description', { count: countryData.value.stats.cityCount, country: countryData.value.country })

  return [
    {
      '@type': 'ItemList',
      'name': title,
      'description': description,
      'numberOfItems': countryData.value.stats.cityCount,
      'itemListElement': countryData.value.cities.slice(0, 10).map((city, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': city.name,
        'url': `https://nomad.whoisarjen.com/cities/${city.slug}`,
      })),
    },
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: '/' },
        { name: t('countryPage.allCountries'), item: '/countries' },
        { name: countryData.value.country },
      ],
    }),
  ]
})
</script>
