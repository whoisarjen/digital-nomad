<template>
  <div class="min-h-screen bg-[#060E1B] text-white">
    <!-- Background texture -->
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
          <span class="text-sm text-emerald-400">{{ $t('safeCitiesPage.breadcrumb') }}</span>
        </div>

        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8 safe-cities-badge">
          <LucideShieldCheck :size="13" class="text-emerald-400" />
          <span class="text-xs font-semibold text-emerald-400 tracking-[0.2em] uppercase">Verified HIGH safety</span>
        </div>

        <!-- Giant headline -->
        <h1 class="safe-cities-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92]">
          <span class="block text-white">Safe Cities</span>
          <span class="block text-emerald-400">for Nomads</span>
        </h1>

        <p class="mt-6 text-lg text-white/40 max-w-lg leading-relaxed safe-cities-sub">
          {{ safeCitiesData ? $t('safeCitiesPage.allSubtitle', { count: safeCitiesData.stats.cityCount }) : '…' }}
          No compromises on security.
        </p>

        <!-- Stat row -->
        <div class="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-10 border-t border-white/[0.08] safe-cities-stats">
          <div>
            <div class="text-3xl font-black text-emerald-400 tabular-nums">
              {{ safeCitiesData?.stats.cityCount ?? '—' }}
            </div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">Safe cities</div>
          </div>
          <div>
            <div class="text-3xl font-black text-white">{{ contexts.length }}</div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">Collections</div>
          </div>
          <div v-if="safeCitiesData?.stats.avgSpeed">
            <div class="text-3xl font-black text-cyan-400 tabular-nums">{{ safeCitiesData.stats.avgSpeed }}<span class="text-lg font-semibold"> Mbps</span></div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">Avg. internet</div>
          </div>
          <div v-if="safeCitiesData?.stats.costMin">
            <div class="text-3xl font-black text-white tabular-nums">{{ formatCost(safeCitiesData.stats.costMin) }}</div>
            <div class="text-xs text-white/30 uppercase tracking-widest mt-1">From / month</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COLLECTIONS ────────────────────────────────────────── -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">

        <!-- Section label -->
        <div class="flex items-center gap-4 mb-6">
          <div class="h-px flex-1 bg-white/[0.06]" />
          <span class="text-[10px] font-bold tracking-[0.35em] text-white/25 uppercase">{{ contexts.length }} Collections</span>
          <div class="h-px flex-1 bg-white/[0.06]" />
        </div>

        <!-- Image card grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- Women card — spans full width on mobile, 2 cols on sm+ -->
          <NuxtLink
            v-if="womenCtx"
            :to="localePath({ name: 'safe-cities-context', params: { context: womenCtx.slug } })"
            class="context-card group relative col-span-2 overflow-hidden rounded-2xl"
            style="animation-delay: 0ms"
          >
            <div class="aspect-[16/7]">
              <CustomNuxtImg
                :src="womenCtx.imageUrl"
                :alt="womenCtx.label"
                width="900"
                height="394"
                sizes="sm:50vw 100vw"
                quality="75"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div class="absolute inset-0 bg-emerald-950/30 group-hover:bg-emerald-950/10 transition-colors duration-300" />
              <div class="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                <LucideShieldCheck :size="11" class="text-emerald-400" />
                <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Women</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 class="text-white font-bold text-base sm:text-lg leading-tight">{{ womenCtx.label }}</h3>
                <p class="text-white/50 text-xs sm:text-sm mt-1 line-clamp-1">{{ womenCtx.tagline }}</p>
              </div>
              <div class="absolute top-3 right-3 size-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-200">
                <LucideArrowRight :size="13" class="text-white" />
              </div>
            </div>
          </NuxtLink>

          <!-- Region cards -->
          <NuxtLink
            v-for="(ctx, i) in contexts.slice(1)"
            :key="ctx.slug"
            :to="localePath({ name: 'safe-cities-context', params: { context: ctx.slug } })"
            class="context-card group relative overflow-hidden rounded-2xl"
            :style="{ animationDelay: `${(i + 1) * 60}ms` }"
          >
            <div class="aspect-[4/3]">
              <CustomNuxtImg
                :src="ctx.imageUrl"
                :alt="ctx.label"
                width="450"
                height="338"
                sizes="sm:25vw 50vw"
                quality="75"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 class="text-white font-bold text-sm sm:text-base leading-tight">{{ ctx.label }}</h3>
                <p class="text-white/45 text-xs mt-0.5 line-clamp-2 hidden sm:block">{{ ctx.tagline }}</p>
              </div>
              <div class="absolute top-2.5 right-2.5 size-7 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-200">
                <LucideArrowRight :size="12" class="text-white" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── ALL SAFE CITIES — Compact ranked list ──────────────── -->
    <section id="all" class="px-6 pb-24 border-t border-white/[0.06]">
      <div class="max-w-screen-xl mx-auto">

        <!-- Section header -->
        <div class="flex items-end justify-between pt-12 pb-8">
          <div>
            <div class="text-[10px] font-bold tracking-[0.35em] text-emerald-400 uppercase mb-2">All safe cities</div>
            <h2 class="text-2xl sm:text-3xl font-black text-white">
              Top 20 cities, HIGH safety rating
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
            v-for="(city, index) in safeCitiesData.cities.slice(0, 20)"
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
import { useCurrency } from '~/composables/useCurrency'

const { formatCost } = useCurrency()


const { t } = useCustomI18n()
const localePath = useLocalePath()

const contextQuery = computed(() => ({ context: 'all' }))
const { data: safeCitiesData, status } = await useSafeCities(contextQuery)

const contexts = computed(() => [
  {
    slug: 'women',
    label: 'Solo Female Travelers',
    tagline: 'Highest-safety cities curated for women traveling alone',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  },
  {
    slug: 'europe',
    label: t('regions.Europe'),
    tagline: 'Old-world capitals and modern hubs with strong safety records',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
  },
  {
    slug: 'asia',
    label: t('regions.Asia'),
    tagline: 'Southeast and East Asian cities with HIGH safety ratings',
    imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd',
  },
  {
    slug: 'latin-america',
    label: t('regions.LatinAmerica'),
    tagline: 'The safest digital nomad picks across Latin America',
    imageUrl: 'https://images.unsplash.com/photo-1583997052103-b4a1cb974ce5',
  },
  {
    slug: 'north-america',
    label: t('regions.NorthAmerica'),
    tagline: 'North American cities with top safety scores',
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856',
  },
  {
    slug: 'middle-east',
    label: t('regions.MiddleEast'),
    tagline: 'Modern Gulf and Levant cities with high safety standards',
    imageUrl: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33',
  },
  {
    slug: 'africa',
    label: t('regions.Africa'),
    tagline: "Africa's highest-rated safe cities for remote workers",
    imageUrl: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e',
  },
  {
    slug: 'oceania',
    label: t('regions.Oceania'),
    tagline: 'Australia, New Zealand and Pacific island picks',
    imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
  },
])

const womenCtx = computed(() => contexts.value[0])

const currentYear = new Date().getFullYear()

const unsplashUrl = (raw: string, w: number, h: number) => {
  if (!raw) return ''
  const sep = raw.includes('?') ? '&' : '?'
  return `${raw}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`
}

useHead(() => {
  if (!safeCitiesData.value) return {}
  const count = safeCitiesData.value.stats.cityCount
  const title = t('safeCitiesPage.metaTitleAll', { year: currentYear })
  const description = t('safeCitiesPage.metaDescAll', { count })
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
  const title = t('safeCitiesPage.metaTitleAll', { year: currentYear })
  const description = t('safeCitiesPage.metaDescAll', { count })
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
        { name: t('safeCitiesPage.breadcrumb') },
      ],
    }),
  ]
})
</script>

<style scoped>
.safe-cities-badge {
  animation: fadeUp 0.5s ease both;
}
.safe-cities-heading {
  animation: fadeUp 0.5s ease both 0.08s;
}
.safe-cities-sub {
  animation: fadeUp 0.5s ease both 0.16s;
}
.safe-cities-stats {
  animation: fadeUp 0.5s ease both 0.24s;
}

.context-row {
  animation: fadeUp 0.4s ease both;
}

.city-row {
  animation: fadeIn 0.3s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
