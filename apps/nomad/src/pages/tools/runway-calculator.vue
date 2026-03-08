<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Dark hero with inputs -->
    <section class="relative bg-[#060E1B] text-white overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/3 -right-[15%] w-[50%] h-[50%] rounded-full bg-accent-500/[0.06] blur-[100px] animate-float" />
        <div class="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.04] blur-[80px] animate-float-reverse" />
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-10 text-center">
        <!-- Breadcrumb pill -->
        <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
          <NuxtLink :to="localePath('tools')" class="hover:text-white transition-colors">{{ $t('tools.badge') }}</NuxtLink>
          <span class="text-white/20">/</span>
          <LucidePiggyBank :size="14" class="text-accent-400" />
          {{ $t('runway.breadcrumb') }}
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          {{ $t('runway.title') }}
        </h1>
        <p class="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          {{ $t('runway.subtitle') }}
        </p>

        <!-- Calculator inputs card (sits in hero) -->
        <div class="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-6 sm:p-8 text-left max-w-2xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <!-- Savings -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {{ $t('runway.savings') }}
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  v-model.number="rawSavings"
                  type="number"
                  min="0"
                  step="1000"
                  class="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white placeholder-gray-500 focus:outline-none focus:border-accent-400/60 focus:bg-white/[0.10] transition-all text-lg font-semibold tabular-nums"
                  :placeholder="$t('runway.savingsPlaceholder')"
                />
              </div>
            </div>

            <!-- Monthly income -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {{ $t('runway.income') }}
                <span class="normal-case text-gray-500 font-normal ml-1">({{ $t('runway.optional') }})</span>
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  v-model.number="rawIncome"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white placeholder-gray-500 focus:outline-none focus:border-accent-400/60 focus:bg-white/[0.10] transition-all text-lg font-semibold tabular-nums"
                  :placeholder="$t('runway.incomePlaceholder')"
                />
              </div>
            </div>
          </div>

          <!-- Tier toggle -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {{ $t('runway.tierLabel') }}
            </label>
            <div class="grid grid-cols-4 gap-1.5 bg-white/[0.06] rounded-xl p-1">
              <button
                v-for="tier in tiers"
                :key="tier.key"
                class="py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                :class="activeTier === tier.key
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'"
                @click="activeTier = tier.key"
              >
                {{ $t(tier.label) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results section -->
    <section class="max-w-4xl mx-auto px-6 -mt-2 pb-20">

      <!-- Empty state -->
      <div v-if="!rawSavings" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <div class="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LucidePiggyBank :size="28" class="text-accent-500" />
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">{{ $t('runway.emptyTitle') }}</h2>
        <p class="text-sm text-gray-500 max-w-sm mx-auto">{{ $t('runway.emptyDesc') }}</p>
      </div>

      <!-- Results -->
      <template v-else-if="savings">
        <!-- Summary bar -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 mb-4 flex flex-wrap items-center gap-4 justify-between">
          <div class="flex items-center gap-6">
            <div>
              <div class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('runway.savings') }}</div>
              <div class="text-lg font-bold tabular-nums text-gray-900">${{ formatNum(savings) }}</div>
            </div>
            <template v-if="income">
              <div class="text-gray-200">|</div>
              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('runway.income') }}/mo</div>
                <div class="text-lg font-bold tabular-nums text-gray-900">${{ formatNum(income) }}</div>
              </div>
            </template>
            <div class="text-gray-200">|</div>
            <div>
              <div class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('runway.lifestyle') }}</div>
              <div class="text-lg font-bold text-gray-900">{{ $t(tiers.find(t => t.key === activeTier)?.label ?? '') }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-400">
            {{ $t('runway.resultsCount', { count: visibleCities.length, total: rankedCities.length }) }}
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="flex flex-col gap-2">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl border border-gray-200 h-16 animate-pulse" />
        </div>

        <!-- City rows -->
        <div v-else class="flex flex-col gap-2">
          <NuxtLink
            v-for="(city, i) in visibleCities"
            :key="city.slug"
            :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
            class="group bg-white rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-sm transition-all px-5 py-4 flex items-center gap-4"
          >
            <!-- Rank -->
            <span class="w-8 flex-shrink-0 text-center text-sm font-bold tabular-nums text-gray-300 group-hover:text-accent-500 transition-colors">
              {{ i + 1 }}
            </span>

            <!-- City info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2">
                <span class="font-bold text-gray-900 group-hover:text-accent-600 transition-colors truncate">{{ city.name }}</span>
                <span class="text-xs text-gray-400 flex-shrink-0">{{ city.country }}</span>
              </div>
              <!-- Runway bar -->
              <div class="mt-2 flex items-center gap-3">
                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    v-if="!city.isIndefinite"
                    class="h-full rounded-full transition-all duration-500"
                    :class="runwayBarClass(city.runway)"
                    :style="{ width: `${runwayBarWidth(city.runway)}%` }"
                  />
                  <div
                    v-else
                    class="h-full rounded-full bg-emerald-400 w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Cost/mo -->
            <div class="flex-shrink-0 text-right">
              <div class="text-xs text-gray-400">{{ $t('runway.costPerMonth') }}</div>
              <div class="text-sm font-semibold text-gray-700 tabular-nums">${{ formatNum(city.cost) }}/mo</div>
            </div>

            <!-- Runway badge -->
            <div class="flex-shrink-0 text-right min-w-[90px]">
              <span
                class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold tabular-nums"
                :class="city.isIndefinite ? 'bg-emerald-50 text-emerald-700' : runwayBadgeClass(city.runway)"
              >
                <LucideInfinity v-if="city.isIndefinite" :size="14" />
                <template v-else>{{ city.runway.toFixed(1) }} {{ $t('runway.months') }}</template>
              </span>
            </div>

            <LucideChevronRight :size="16" class="flex-shrink-0 text-gray-300 group-hover:text-accent-400 transition-colors" />
          </NuxtLink>
        </div>

        <!-- Show more -->
        <div v-if="rankedCities.length > visibleCount" class="text-center mt-6">
          <button
            @click="visibleCount += 50"
            class="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-accent-300 text-gray-700 hover:text-accent-600 font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow"
          >
            <LucideChevronDown :size="16" />
            {{ $t('runway.showMore', { count: Math.min(50, rankedCities.length - visibleCount) }) }}
          </button>
        </div>
      </template>

      <!-- Debounce spinner: rawSavings typed but debounced value not yet applied -->
      <div v-else-if="rawSavings && !savings" class="flex justify-center py-12">
        <div class="w-6 h-6 rounded-full border-2 border-accent-400 border-t-transparent animate-spin" />
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
import { useRunwayData } from '~/composables/useRunwayData'

const { t } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

defineI18nRoute({
  paths: {
    en: '/tools/runway-calculator',
    pl: '/narzedzia/kalkulator-pasa',
    es: '/herramientas/calculadora-pista',
    de: '/werkzeuge/laufbahn-rechner',
    fr: '/outils/calculateur-piste',
    pt: '/ferramentas/calculadora-pista',
    it: '/strumenti/calcolatore-pista',
    ko: '/tools/runway-calculator',
    ja: '/tools/runway-calculator',
    ar: '/tools/runway-calculator',
    tr: '/araclar/pist-hesaplayici',
  },
})

// ─── Raw input state (bound directly to inputs) ───
const rawSavings = ref<number | null>(Number(route.query.savings) || null)
const rawIncome = ref<number | null>(Number(route.query.income) || null)
const activeTier = ref<'nomad' | 'expat' | 'local' | 'family'>(
  (['nomad', 'expat', 'local', 'family'].includes(route.query.tier as string)
    ? route.query.tier
    : 'nomad') as 'nomad' | 'expat' | 'local' | 'family',
)
const visibleCount = ref(10)

// ─── Debounced values (used for calculation + URL) ───
const savings = ref<number | null>(rawSavings.value)
const income = ref<number | null>(rawIncome.value)

let savingsTimer: ReturnType<typeof setTimeout> | null = null
let incomeTimer: ReturnType<typeof setTimeout> | null = null

watch(rawSavings, (val) => {
  if (savingsTimer) clearTimeout(savingsTimer)
  savingsTimer = setTimeout(() => { savings.value = val }, 400)
})

watch(rawIncome, (val) => {
  if (incomeTimer) clearTimeout(incomeTimer)
  incomeTimer = setTimeout(() => { income.value = val }, 400)
})

const tiers = [
  { key: 'nomad' as const, label: 'city.nomad' },
  { key: 'expat' as const, label: 'city.expat' },
  { key: 'local' as const, label: 'city.local' },
  { key: 'family' as const, label: 'city.family' },
]

// Sync to URL (uses debounced values)
watch([savings, income, activeTier], () => {
  router.replace({
    query: {
      ...(savings.value ? { savings: String(savings.value) } : {}),
      ...(income.value ? { income: String(income.value) } : {}),
      tier: activeTier.value,
    },
  })
  visibleCount.value = 10
}, { flush: 'post' })

// ─── Data ───
const { data, isLoading } = await useRunwayData()

type CostKey = 'costForNomadInUsd' | 'costForExpatInUsd' | 'costForLocalInUsd' | 'costForFamilyInUsd'

// ─── Calculation ───
const tierCostKey = computed<CostKey>(() => {
  const map: Record<typeof activeTier.value, CostKey> = {
    nomad: 'costForNomadInUsd',
    expat: 'costForExpatInUsd',
    local: 'costForLocalInUsd',
    family: 'costForFamilyInUsd',
  }
  return map[activeTier.value]
})

type RankedCity = {
  slug: string
  name: string
  country: string
  cost: number
  runway: number
  isIndefinite: boolean
}

const rankedCities = computed<RankedCity[]>(() => {
  if (!data.value || !savings.value) return []
  const s = savings.value
  const inc = income.value ?? 0
  const key = tierCostKey.value

  return data.value
    .filter((city) => city[key] > 0)
    .map((city) => {
      const cost = city[key]
      const netMonthly = cost - inc
      const isIndefinite = netMonthly <= 0
      const runway = isIndefinite ? Infinity : s / netMonthly
      return {
        slug: city.slug,
        name: city.name,
        country: city.country,
        cost,
        runway,
        isIndefinite,
      }
    })
    .sort((a, b) => {
      if (a.isIndefinite && b.isIndefinite) return a.cost - b.cost
      if (a.isIndefinite) return -1
      if (b.isIndefinite) return 1
      return b.runway - a.runway
    })
})

const visibleCities = computed(() => rankedCities.value.slice(0, visibleCount.value))

const maxRunway = computed(() => {
  const finite = rankedCities.value.filter((c) => !c.isIndefinite)
  return finite[0]?.runway ?? 0
})

// ─── Helpers ───
function formatNum(n: number | null): string {
  if (!n) return '0'
  return n.toLocaleString('en-US')
}

function runwayBarWidth(runway: number): number {
  if (!maxRunway.value) return 0
  return Math.min(100, (runway / maxRunway.value) * 100)
}

function runwayBarClass(runway: number): string {
  if (runway >= 36) return 'bg-emerald-500'
  if (runway >= 18) return 'bg-primary-500'
  if (runway >= 6) return 'bg-amber-400'
  return 'bg-red-400'
}

function runwayBadgeClass(runway: number): string {
  if (runway >= 36) return 'bg-emerald-50 text-emerald-700'
  if (runway >= 18) return 'bg-primary-50 text-primary-700'
  if (runway >= 6) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-600'
}

// ─── SEO ───
useSeoMeta({
  title: () => savings.value
    ? t('runway.metaTitleWithSavings', { savings: formatNum(savings.value) })
    : t('runway.metaTitle'),
  description: () => t('runway.metaDesc'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('tools.badge'), item: '/tools' },
      { name: () => t('runway.breadcrumb') },
    ],
  }),
])
</script>
