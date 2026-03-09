<template>
  <div class="min-h-screen">
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

    <!-- Month list -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <!-- Skeleton -->
        <template v-if="status === 'pending' || !data">
          <div class="space-y-2">
            <div v-for="i in 12" :key="i" class="h-20 skeleton rounded-2xl" />
          </div>
        </template>

        <template v-else>
          <!-- Column headers -->
          <div class="hidden sm:grid grid-cols-[8rem_1fr_auto_auto] gap-4 px-5 pb-2 text-xs font-medium text-white/25 uppercase tracking-wider border-b border-white/[0.06] mb-1">
            <span>Month</span>
            <span>#1 City</span>
            <span>Score</span>
            <span />
          </div>

          <div class="space-y-1">
            <NuxtLink
              v-for="(entry, i) in data"
              :key="entry.month"
              :to="localePath({ name: 'best-cities-month', params: { month: monthValueToSlug(entry.month) } })"
              class="group grid grid-cols-[8rem_1fr_auto_auto] gap-4 items-center px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-primary-400/30 transition-all duration-200"
            >
              <!-- Month -->
              <div>
                <span class="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                  {{ monthValueToDisplayName(entry.month) }}
                </span>
                <span class="block text-xs text-white/25 tabular-nums">{{ currentYear }}</span>
              </div>

              <!-- Top city -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white/[0.06]">
                  <CustomNuxtImg
                    v-if="entry.topCity.image"
                    :src="entry.topCity.image.url"
                    :alt="entry.topCity.name"
                    :width="entry.topCity.image.width"
                    :height="entry.topCity.image.height"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">#1 city</p>
                  <p class="text-white text-sm font-medium truncate">{{ entry.topCity.name }}</p>
                  <p class="text-white/40 text-xs truncate">{{ entry.topCity.country }}</p>
                </div>
              </div>

              <!-- Score -->
              <NomadScoreBadge :score="entry.topCity.totalScore" />

              <!-- Arrow -->
              <div class="flex items-center gap-1 text-white/30 group-hover:text-primary-400 transition-colors text-sm font-medium">
                <span class="hidden sm:inline text-xs">View rankings</span>
                <LucideChevronRight :size="16" />
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
