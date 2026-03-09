<template>
  <div class="min-h-screen text-white">
    <div
      class="pointer-events-none fixed inset-0 opacity-30"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);"
    />

    <!-- ── HERO ──────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-16 px-6 overflow-hidden">
      <div class="absolute -top-[15%] left-[25%] w-[50%] h-[60%] rounded-full bg-emerald-500/[0.05] blur-[140px] pointer-events-none" />
      <div class="absolute top-[30%] right-[0%] w-[25%] h-[40%] rounded-full bg-emerald-600/[0.03] blur-[100px] pointer-events-none" />

      <div class="relative max-w-screen-xl mx-auto">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-3 mb-10">
          <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <NuxtLink to="/safe-cities" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('safeCitiesPage.breadcrumb') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-sm text-emerald-400">{{ pageHeading }}</span>
        </div>

        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
          <LucideShieldCheck :size="13" class="text-emerald-400" />
          <span class="text-xs font-semibold text-emerald-400 tracking-[0.2em] uppercase">Verified HIGH safety</span>
        </div>

        <!-- Heading -->
        <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92]">
          <span class="block text-white">{{ pageHeading }}</span>
          <span class="block text-emerald-400">for Nomads</span>
        </h1>

        <p class="mt-6 text-lg text-white/40 max-w-lg leading-relaxed">
          {{ pageSubtitle }}
        </p>

        <!-- Stat row -->
        <div class="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-10 border-t border-white/[0.08]">
          <div v-if="safeCitiesData">
            <div class="text-3xl font-black text-emerald-400 tabular-nums">{{ safeCitiesData.stats.cityCount }}</div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">Safe cities</div>
          </div>
          <div v-if="safeCitiesData?.stats.avgSpeed">
            <div class="text-3xl font-black text-cyan-400 tabular-nums">{{ safeCitiesData.stats.avgSpeed }}<span class="text-lg font-semibold"> Mbps</span></div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">Avg. internet</div>
          </div>
          <div v-if="safeCitiesData?.stats.costMin">
            <div class="text-3xl font-black text-white tabular-nums">{{ formatCost(safeCitiesData.stats.costMin) }}</div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">From / month</div>
          </div>
          <div v-if="safeCitiesData?.stats.costMax">
            <div class="text-3xl font-black text-white/50 tabular-nums">{{ formatCost(safeCitiesData.stats.costMax) }}</div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">Up to / month</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── RANKED LIST ─────────────────────────────────────── -->
    <section class="px-6 pb-24 border-t border-white/[0.06]">
      <div class="max-w-screen-xl mx-auto">

        <div class="flex items-end justify-between pt-12 pb-8">
          <div>
            <div class="text-[10px] font-bold tracking-[0.35em] text-emerald-400 uppercase mb-2">Ranked cities</div>
            <h2 class="text-2xl sm:text-3xl font-black text-white">
              {{ safeCitiesData ? `${safeCitiesData.stats.cityCount} cities` : '…' }}, HIGH safety rating
            </h2>
          </div>
          <span class="hidden sm:block text-xs text-white/25 pb-1">Ranked by nomad score</span>
        </div>

        <!-- Loading skeletons -->
        <template v-if="status === 'pending' || !safeCitiesData">
          <div class="space-y-2">
            <div v-for="i in 15" :key="i" class="h-14 skeleton rounded-xl" />
          </div>
        </template>

        <template v-else-if="!safeCitiesData.cities.length">
          <p class="text-white/30 text-center py-20">{{ $t('safeCitiesPage.noResults') }}</p>
        </template>

        <template v-else>
          <!-- Table header -->
          <div class="grid grid-cols-[2rem_1fr_auto_auto_auto] gap-3 sm:gap-4 px-4 py-2 text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] border-b border-white/[0.06] mb-1">
            <span>#</span>
            <span>City</span>
            <span class="text-right">Score</span>
            <span class="text-right hidden sm:block">Cost</span>
            <span class="text-right">Internet</span>
          </div>

          <NuxtLink
            v-for="(city, index) in safeCitiesData.cities"
            :key="city.slug"
            :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
            class="city-row group grid grid-cols-[2rem_1fr_auto_auto_auto] gap-3 sm:gap-4 items-center px-4 py-3 sm:py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            :style="{ animationDelay: `${index * 20}ms` }"
          >
            <span class="text-white/20 font-mono text-xs font-bold">{{ index + 1 }}</span>

            <div class="min-w-0">
              <p class="text-white font-semibold text-sm group-hover:text-emerald-300 transition-colors truncate leading-tight">
                {{ city.name }}
              </p>
              <p class="text-white/35 text-xs truncate">{{ city.country }}</p>
            </div>

            <div class="flex justify-end">
              <NomadScoreBadge v-if="city.totalScore != null" :score="city.totalScore" />
              <span v-else class="text-white/20 text-xs">—</span>
            </div>

            <span class="text-emerald-400 text-sm font-semibold tabular-nums text-right hidden sm:block">
              {{ formatCost(Number(city.costForNomadInUsd)) }}<span class="text-white/25 font-normal text-xs">/mo</span>
            </span>

            <span class="text-white/50 text-sm tabular-nums text-right">
              {{ city.internetSpeedCity }}<span class="text-white/25 text-xs"> Mbps</span>
            </span>
          </NuxtLink>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { SAFE_CITIES_SLUG_MAP, REGION_SLUG_MAP } from '~/shared/global.utils'
import { useCurrency } from '~/composables/useCurrency'

const { formatCost } = useCurrency()

defineI18nRoute({
  paths: {
    en: '/safe-cities/[context]',
    pl: '/bezpieczne-miasta/[context]',
    es: '/ciudades-seguras/[context]',
    de: '/sichere-staedte/[context]',
    pt: '/cidades-seguras/[context]',
    fr: '/villes-sures/[context]',
    tr: '/guvenli-sehirler/[context]',
    it: '/citta-sicure/[context]',
    ko: '/safe-cities/[context]',
    ar: '/safe-cities/[context]',
    ja: '/safe-cities/[context]',
  },
})

const { t } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()

const context = computed(() => route.params.context as string)

if (!(context.value in SAFE_CITIES_SLUG_MAP)) {
  throw createError({ statusCode: 404, statusMessage: 'Safe cities context not found' })
}

const contextQuery = computed(() => ({ context: context.value }))
const { data: safeCitiesData, status } = await useSafeCities(contextQuery)

// Resolve region label for regional contexts
const regionEnum = computed(() => SAFE_CITIES_SLUG_MAP[context.value as keyof typeof SAFE_CITIES_SLUG_MAP])
const regionLabel = computed(() => {
  if (!regionEnum.value) return null
  return t(`regions.${regionEnum.value}`)
})

const pageHeading = computed(() => {
  if (context.value === 'women') return t('safeCitiesPage.womenH1')
  if (regionLabel.value) return t('safeCitiesPage.regionalH1', { region: regionLabel.value })
  return t('safeCitiesPage.allH1')
})

const pageSubtitle = computed(() => {
  const count = safeCitiesData.value?.stats.cityCount ?? 0
  if (context.value === 'women') return t('safeCitiesPage.womenSubtitle', { count })
  if (regionLabel.value) return t('safeCitiesPage.regionalSubtitle', { count, region: regionLabel.value })
  return t('safeCitiesPage.allSubtitle', { count })
})

const currentYear = new Date().getFullYear()

const unsplashUrl = (raw: string, w: number, h: number) => {
  if (!raw) return ''
  const sep = raw.includes('?') ? '&' : '?'
  return `${raw}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`
}

useHead(() => {
  if (!safeCitiesData.value) return {}

  const count = safeCitiesData.value.stats.cityCount

  let title: string
  let description: string

  if (context.value === 'women') {
    title = t('safeCitiesPage.metaTitleWomen', { year: currentYear })
    description = t('safeCitiesPage.metaDescWomen', { count })
  } else if (regionLabel.value) {
    title = t('safeCitiesPage.metaTitleRegional', { region: regionLabel.value, year: currentYear })
    description = t('safeCitiesPage.metaDescRegional', { count, region: regionLabel.value })
  } else {
    title = t('safeCitiesPage.metaTitleAll', { year: currentYear })
    description = t('safeCitiesPage.metaDescAll', { count })
  }

  const firstCityImageUrl = safeCitiesData.value.cities[0]?.image?.url
  const ogImage = firstCityImageUrl ? unsplashUrl(firstCityImageUrl, 1200, 630) : undefined

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }
})

useSchemaOrg(() => {
  if (!safeCitiesData.value) return []

  const count = safeCitiesData.value.stats.cityCount
  let title: string
  let description: string

  if (context.value === 'women') {
    title = t('safeCitiesPage.metaTitleWomen', { year: currentYear })
    description = t('safeCitiesPage.metaDescWomen', { count })
  } else if (regionLabel.value) {
    title = t('safeCitiesPage.metaTitleRegional', { region: regionLabel.value, year: currentYear })
    description = t('safeCitiesPage.metaDescRegional', { count, region: regionLabel.value })
  } else {
    title = t('safeCitiesPage.metaTitleAll', { year: currentYear })
    description = t('safeCitiesPage.metaDescAll', { count })
  }

  return [
    {
      '@type': 'ItemList',
      'name': title,
      'description': description,
      'numberOfItems': count,
      'itemListElement': (safeCitiesData.value.cities ?? []).slice(0, 10).map((city, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': city.name,
        'url': `https://nomad.whoisarjen.com/cities/${city.slug}`,
      })),
    },
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: '/' },
        { name: t('safeCitiesPage.breadcrumb'), item: '/safe-cities' },
        { name: pageHeading.value },
      ],
    }),
  ]
})
</script>
