<template>
  <div class="min-h-screen bg-[#0A0F1A]">
    <!-- ─── Hero Header ─── -->
    <section class="relative overflow-hidden">
      <!-- Ambient glows -->
      <div class="absolute -top-[30%] left-[20%] w-[60%] h-[60%] rounded-full bg-amber-500/[0.05] blur-[120px] pointer-events-none" />
      <div class="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-orange-600/[0.04] blur-[100px] pointer-events-none" />

      <div class="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        <!-- Breadcrumb pill -->
        <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
          <NuxtLink :to="localePath('tools')" class="hover:text-white transition-colors">{{ $t('tools.badge') }}</NuxtLink>
          <span class="text-white/20">/</span>
          <LucideSunrise :size="14" class="text-amber-400" />
          {{ $t('dayInLife.breadcrumb') }}
        </div>

        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-4">
          {{ $t('dayInLife.title') }}
        </h1>
        <p class="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          {{ $t('dayInLife.subtitle') }}
        </p>
      </div>
    </section>

    <!-- ─── Main Layout ─── -->
    <div class="max-w-5xl mx-auto px-6 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

        <!-- LEFT: Builder -->
        <div class="space-y-4">

          <!-- City Picker -->
          <div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <label class="block text-xs font-bold uppercase tracking-widest text-amber-400/80 mb-3">
              {{ $t('dayInLife.pickCity') }}
            </label>
            <div class="relative">
              <LucideSearch :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                v-model="citySearch"
                type="text"
                :placeholder="$t('dayInLife.searchCity')"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.08] transition-all text-base"
                @focus="searchFocused = true"
                @blur="onSearchBlur"
              />
              <!-- Dropdown -->
              <div
                v-if="searchFocused && filteredCities.length"
                class="absolute z-50 top-full left-0 right-0 mt-1.5 bg-[#111827] border border-white/[0.10] rounded-xl overflow-hidden shadow-2xl max-h-56 overflow-y-auto"
              >
                <button
                  v-for="city in filteredCities.slice(0, 12)"
                  :key="city.slug"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.06] transition-colors"
                  @mousedown.prevent="selectCity(city)"
                >
                  <span class="text-sm font-medium text-white">{{ city.name }}</span>
                  <span class="text-xs text-gray-500">{{ city.country }}</span>
                </button>
              </div>
            </div>

            <!-- Selected City Chip -->
            <div v-if="selectedCity" class="flex items-center gap-2 mt-3">
              <div class="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full pl-3 pr-2 py-1">
                <LucideMapPin :size="12" class="text-amber-400" />
                <span class="text-sm font-semibold text-amber-300">{{ selectedCity.name }}</span>
                <button
                  class="text-amber-400/60 hover:text-amber-300 transition-colors ml-0.5"
                  @click="clearCity"
                >
                  <LucideX :size="14" />
                </button>
              </div>
            </div>
          </div>

          <!-- Day Items -->
          <div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div class="px-5 pt-5 pb-3">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-500">{{ $t('dayInLife.buildYourDay') }}</p>
            </div>

            <div class="divide-y divide-white/[0.05]">
              <DayItem
                v-for="item in dayItems"
                :key="item.key"
                :item="item"
                :price="getPriceForItem(item)"
                @increment="increment(item.key)"
                @decrement="decrement(item.key)"
              />
            </div>
          </div>

          <!-- Data note -->
          <p class="text-xs text-gray-600 text-center">{{ $t('dayInLife.dataNote') }}</p>
        </div>

        <!-- RIGHT: Cost Display (sticky) -->
        <div class="lg:sticky lg:top-6 space-y-4">

          <!-- Big Cost Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#0D1117] border border-white/[0.08] rounded-2xl p-6">
            <!-- Corner glow -->
            <div class="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <p class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">{{ $t('dayInLife.dailyCost') }}</p>

            <!-- Cost number -->
            <div v-if="selectedCity && priceData" class="mb-1">
              <div class="flex items-end gap-2 leading-none">
                <span class="text-6xl sm:text-7xl font-black tabular-nums text-amber-400 leading-none tracking-tight" style="font-variant-numeric: tabular-nums;">
                  {{ formatCost(dailyCost) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-2">{{ $t('dayInLife.perDay') }}</p>
            </div>

            <!-- No city selected -->
            <div v-else-if="!selectedCity" class="py-4">
              <div class="text-5xl font-black text-white/10 tabular-nums">$—</div>
              <p class="text-sm text-gray-600 mt-2">{{ $t('dayInLife.noCity') }}</p>
            </div>

            <!-- Loading -->
            <div v-else-if="pending" class="py-4">
              <div class="h-16 w-32 bg-white/[0.06] animate-pulse rounded-xl" />
            </div>

            <!-- No data -->
            <div v-else class="py-4">
              <div class="text-5xl font-black text-white/10">$—</div>
              <p class="text-sm text-amber-600/70 mt-2">{{ $t('dayInLife.noData') }}</p>
            </div>

            <!-- Receipt-style line breakdown -->
            <div v-if="selectedCity && priceData && dailyCost > 0" class="mt-5 pt-5 border-t border-white/[0.06] space-y-2">
              <div
                v-for="item in activeItems"
                :key="item.key"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-500 flex items-center gap-1.5">
                  <span>{{ item.emoji }}</span>
                  <span>{{ $t(item.labelKey) }}</span>
                  <span class="text-gray-700">×{{ item.qty }}</span>
                </span>
                <span class="tabular-nums font-medium text-gray-300">{{ formatCost(item.subtotal) }}</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Total</span>
                <span class="text-sm font-black text-amber-400 tabular-nums">{{ formatCost(dailyCost) }}</span>
              </div>
            </div>
          </div>

          <!-- Comparison card (shows when city is selected) -->
          <div v-if="selectedCity && priceData && dailyCost > 0 && comparisonCity" class="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <p class="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">vs.</p>
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-white">{{ comparisonCity.name }}</p>
                <p class="text-xs text-gray-600">{{ comparisonCity.country }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-black tabular-nums" :class="comparisonRatio > 1 ? 'text-emerald-400' : 'text-red-400'">
                  {{ comparisonRatio > 1 ? `${comparisonRatio.toFixed(1)}×` : `${(1/comparisonRatio).toFixed(1)}×` }}
                </p>
                <p class="text-[11px] text-gray-600">{{ comparisonRatio > 1 ? 'cheaper' : 'pricier' }}</p>
              </div>
            </div>
          </div>

          <!-- Share button -->
          <button
            class="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
            :class="copied
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500 hover:bg-amber-400 text-black'"
            @click="shareUrl"
          >
            <LucideLink2 v-if="!copied" :size="16" />
            <LucideCheck v-else :size="16" />
            {{ copied ? $t('dayInLife.copied') : $t('dayInLife.shareDay') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

defineI18nRoute({
  paths: {
    en: '/tools/day-in-the-life',
    pl: '/narzedzia/dzien-z-zycia',
  },
})

const { t } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const { formatCost } = useCurrency()

// ─── City Search ───────────────────────────────────────────────────────────────

interface RunwayCityItem {
  slug: string
  name: string
  country: string
}

const { data: allCities } = await useAsyncData('day-in-life-cities', () =>
  $fetch<RunwayCityItem[]>('/api/tools/runway'),
  { lazy: true, default: () => [] as RunwayCityItem[] }
)

const citySearch = ref('')
const searchFocused = ref(false)
const selectedCity = ref<RunwayCityItem | null>(null)

const filteredCities = computed(() => {
  const q = citySearch.value.trim().toLowerCase()
  if (!q || !allCities.value) return allCities.value ?? []
  return allCities.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q),
  )
})

function selectCity(city: RunwayCityItem) {
  selectedCity.value = city
  citySearch.value = ''
  searchFocused.value = false
  updateUrl()
}

function clearCity() {
  selectedCity.value = null
  updateUrl()
}

function onSearchBlur() {
  setTimeout(() => {
    searchFocused.value = false
  }, 150)
}

// ─── Price Data ────────────────────────────────────────────────────────────────

interface DayCostResponse {
  citySlug: string
  cityName: string
  mealInexpensiveRestaurant: number | null
  mealMidRangeRestaurant: number | null
  cappuccino: number | null
  domesticBeerRestaurant: number | null
  taxi1km: number | null
  oneWayTicket: number | null
}

const { data: priceData, pending } = await useAsyncData(
  () => `day-cost-${selectedCity.value?.slug ?? 'none'}`,
  () => {
    if (!selectedCity.value) return Promise.resolve(null)
    return $fetch<DayCostResponse>('/api/tools/day-cost', {
      query: { citySlug: selectedCity.value.slug },
    })
  },
  { watch: [selectedCity], lazy: true },
)

// ─── Day Config ────────────────────────────────────────────────────────────────

interface DayItemConfig {
  key: string
  emoji: string
  labelKey: string
  priceField: keyof DayCostResponse
  qty: number
  min: number
  max: number
}

const quantities = reactive<Record<string, number>>({
  cheapMeal: 2,
  midMeal: 0,
  coffee: 1,
  beer: 1,
  taxi: 5,
  transport: 1,
})

const DAY_ITEMS: Omit<DayItemConfig, 'qty'>[] = [
  { key: 'cheapMeal', emoji: '🍜', labelKey: 'dayInLife.cheapMeal', priceField: 'mealInexpensiveRestaurant', min: 0, max: 5 },
  { key: 'midMeal', emoji: '🍽️', labelKey: 'dayInLife.midRangeMeal', priceField: 'mealMidRangeRestaurant', min: 0, max: 3 },
  { key: 'coffee', emoji: '☕', labelKey: 'dayInLife.coffee', priceField: 'cappuccino', min: 0, max: 5 },
  { key: 'beer', emoji: '🍺', labelKey: 'dayInLife.beer', priceField: 'domesticBeerRestaurant', min: 0, max: 6 },
  { key: 'taxi', emoji: '🚕', labelKey: 'dayInLife.taxiKm', priceField: 'taxi1km', min: 0, max: 30 },
  { key: 'transport', emoji: '🚇', labelKey: 'dayInLife.publicTransport', priceField: 'oneWayTicket', min: 0, max: 5 },
]

const dayItems = computed((): DayItemConfig[] =>
  DAY_ITEMS.map((item) => ({ ...item, qty: quantities[item.key] ?? 0 })),
)

function getPriceForItem(item: DayItemConfig): number | null {
  if (!priceData.value) return null
  const raw = priceData.value[item.priceField]
  if (raw === null || raw === undefined) return null
  // midMeal uses half of meal-for-2 price
  if (item.key === 'midMeal') return Number(raw) / 2
  return Number(raw)
}

function increment(key: string) {
  const item = DAY_ITEMS.find((i) => i.key === key)
  if (!item) return
  quantities[key] = Math.min((quantities[key] ?? 0) + 1, item.max)
  updateUrl()
}

function decrement(key: string) {
  const item = DAY_ITEMS.find((i) => i.key === key)
  if (!item) return
  quantities[key] = Math.max((quantities[key] ?? 0) - 1, item.min)
  updateUrl()
}

// ─── Cost Calculation ──────────────────────────────────────────────────────────

const activeItems = computed(() =>
  dayItems.value
    .map((item) => {
      const price = getPriceForItem(item)
      const qty = item.qty
      if (!price || qty === 0) return null
      return { ...item, subtotal: price * qty }
    })
    .filter(Boolean) as (DayItemConfig & { subtotal: number })[],
)

const dailyCost = computed(() =>
  activeItems.value.reduce((sum, item) => sum + item.subtotal, 0),
)

// ─── Comparison ────────────────────────────────────────────────────────────────

// Fixed reference city: London
const COMPARISON_CITY: RunwayCityItem = { slug: 'london', name: 'London', country: 'United Kingdom' }

const { data: comparisonPriceData } = await useAsyncData(
  'day-cost-comparison-london',
  () => $fetch<DayCostResponse>('/api/tools/day-cost', { query: { citySlug: 'london' } }),
  { lazy: true },
)

const comparisonCity = computed(() => {
  if (!selectedCity.value || selectedCity.value.slug === COMPARISON_CITY.slug) return null
  return COMPARISON_CITY
})

const comparisonDailyCost = computed(() => {
  if (!comparisonPriceData.value) return 0
  return DAY_ITEMS.reduce((sum, item) => {
    const qty = quantities[item.key] ?? 0
    const raw = comparisonPriceData.value![item.priceField]
    if (!raw || qty === 0) return sum
    const price = item.key === 'midMeal' ? Number(raw) / 2 : Number(raw)
    return sum + price * qty
  }, 0)
})

const comparisonRatio = computed(() => {
  if (!dailyCost.value || !comparisonDailyCost.value) return 1
  return comparisonDailyCost.value / dailyCost.value
})

// ─── URL Shareability ──────────────────────────────────────────────────────────

function updateUrl() {
  const q: Record<string, string> = {}
  if (selectedCity.value) q.city = selectedCity.value.slug
  if (quantities.cheapMeal !== 2) q.meals = String(quantities.cheapMeal)
  if (quantities.midMeal !== 0) q.midMeals = String(quantities.midMeal)
  if (quantities.coffee !== 1) q.coffee = String(quantities.coffee)
  if (quantities.beer !== 1) q.beer = String(quantities.beer)
  if (quantities.taxi !== 5) q.taxi = String(quantities.taxi)
  if (quantities.transport !== 1) q.transport = String(quantities.transport)
  router.replace({ query: q })
}

// Read URL on mount
onMounted(async () => {
  const q = route.query
  if (q.meals) quantities.cheapMeal = Number(q.meals)
  if (q.midMeals) quantities.midMeal = Number(q.midMeals)
  if (q.coffee) quantities.coffee = Number(q.coffee)
  if (q.beer) quantities.beer = Number(q.beer)
  if (q.taxi) quantities.taxi = Number(q.taxi)
  if (q.transport) quantities.transport = Number(q.transport)

  if (q.city && allCities.value?.length) {
    const found = allCities.value.find((c) => c.slug === q.city)
    if (found) selectedCity.value = found
  }
})

// Also watch allCities for late load (lazy)
watch(allCities, (cities) => {
  const citySlug = route.query.city as string | undefined
  if (citySlug && cities?.length && !selectedCity.value) {
    const found = cities.find((c) => c.slug === citySlug)
    if (found) selectedCity.value = found
  }
})

// ─── Share ─────────────────────────────────────────────────────────────────────

const copied = ref(false)

async function shareUrl() {
  const url = window.location.href
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// ─── SEO ───────────────────────────────────────────────────────────────────────

useSeoMeta({
  title: () => t('dayInLife.metaTitle'),
  description: () => t('dayInLife.metaDesc'),
  robots: 'index, follow',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('tools.badge'), item: '/tools' },
      { name: () => t('dayInLife.breadcrumb') },
    ],
  }),
])
</script>
