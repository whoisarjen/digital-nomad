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
                <span class="absolute top-2 left-3 text-xs font-semibold text-white/80 uppercase tracking-wider">
                  {{ monthValueToDisplayName(entry.month) }}
                </span>
              </div>

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
