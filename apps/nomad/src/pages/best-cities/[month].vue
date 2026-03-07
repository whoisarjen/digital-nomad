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
          <div class="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-white/30 uppercase tracking-wider border-b border-white/[0.06] mb-2">
            <span>{{ $t('bestCities.rank') }}</span>
            <span>City</span>
            <span class="text-right">{{ $t('bestCities.nomadScore') }}</span>
            <span class="text-right">{{ $t('bestCities.cost') }}</span>
            <span class="text-right">{{ $t('bestCities.internet') }}</span>
          </div>

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

if (!Object.keys(MONTH_SLUG_MAP).includes(monthSlug)) {
  throw createError({ statusCode: 404, statusMessage: 'Month not found' })
}

const slug = monthSlug as MonthSlug
const monthValue = MONTH_SLUG_MAP[slug]
const displayName = MONTH_DISPLAY_NAMES[slug]

const { data, status } = await useCities(
  ref({ months: monthValue, orderBy: 'totalScore' as const, sort: 'desc' as const, limit: 50 }),
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
