<template>
  <section v-if="hasAnyData" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-6 pt-6 pb-5 flex items-center justify-between gap-4 border-b border-gray-50">
      <div class="flex items-center gap-2.5">
        <div class="size-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
          <LucideBarChart2 :size="16" class="text-primary-600" />
        </div>
        <h2 class="text-base font-bold text-gray-900">{{ $t('comparePriceTable.title') }}</h2>
      </div>
      <!-- Legend -->
      <div class="flex items-center gap-3 text-[11px] text-gray-400">
        <span class="flex items-center gap-1.5">
          <span class="inline-block size-2 rounded-full bg-emerald-400" />
          {{ cityAName }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block size-2 rounded-full bg-primary-400" />
          {{ cityBName }}
        </span>
      </div>
    </div>

    <!-- Column headers (sticky) -->
    <div class="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-2.5 grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center">
      <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{{ $t('comparePriceTable.item') }}</span>
      <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-500 text-right w-24">{{ cityAName }}</span>
      <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-500 text-right w-24">{{ cityBName }}</span>
      <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 text-right w-16">{{ $t('comparePriceTable.diff') }}</span>
    </div>

    <!-- Categories and rows -->
    <div>
      <template v-for="cat in visibleCategories" :key="cat.key">
        <!-- Category header -->
        <div class="flex items-center gap-2.5 px-6 py-2.5 bg-gray-50/70 border-y border-gray-100/80">
          <span class="text-base leading-none">{{ cat.icon }}</span>
          <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t(cat.labelKey) }}</span>
          <span class="ml-auto text-[10px] text-gray-400 tabular-nums">{{ cat.visibleCount }} {{ $t('comparePriceTable.items') }}</span>
        </div>

        <!-- Price rows -->
        <div
          v-for="row in cat.rows"
          :key="row.key"
          data-testid="price-row"
          class="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center px-6 py-2.5 border-b border-gray-50 last:border-b-0 transition-colors hover:bg-gray-50/50"
          :class="{
            'cheaper-a': row.winner === 'a',
            'cheaper-b': row.winner === 'b',
          }"
        >
          <!-- Label -->
          <span class="text-sm text-gray-500 leading-snug pr-2">{{ $t(row.labelKey) }}</span>

          <!-- City A value -->
          <span
            class="text-sm font-semibold tabular-nums text-right w-24 transition-colors"
            :class="row.winner === 'a' ? 'text-emerald-600' : 'text-gray-700'"
          >
            <template v-if="row.valueA !== null">{{ formatCost(row.valueA) }}</template>
            <span v-else class="text-gray-300 font-normal">—</span>
          </span>

          <!-- City B value -->
          <span
            class="text-sm font-semibold tabular-nums text-right w-24 transition-colors"
            :class="row.winner === 'b' ? 'text-primary-600' : 'text-gray-700'"
          >
            <template v-if="row.valueB !== null">{{ formatCost(row.valueB) }}</template>
            <span v-else class="text-gray-300 font-normal">—</span>
          </span>

          <!-- % Diff pill -->
          <div class="flex justify-end w-16">
            <span
              v-if="row.diffPct !== null"
              class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums"
              :class="{
                'bg-emerald-50 text-emerald-700': row.winner === 'a',
                'bg-primary-50 text-primary-700': row.winner === 'b',
                'bg-gray-50 text-gray-400': row.winner === null,
              }"
            >
              {{ row.diffPct === 0 ? '=' : `${row.diffPct}%` }}
            </span>
            <span v-else class="text-gray-200 text-[11px]">—</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Footer note -->
    <div class="px-6 py-3 border-t border-gray-50 flex items-center gap-1.5">
      <LucideInfo :size="12" class="text-gray-300 shrink-0" />
      <p class="text-[11px] text-gray-400">{{ $t('comparePriceTable.source') }}</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useCurrency } from '~/composables/useCurrency'
import type { CityPriceData } from '~/components/CostBreakdown.vue'

const props = defineProps<{
  cityAName: string
  cityBName: string
  cityAPrices: CityPriceData
  cityBPrices: CityPriceData
}>()

const { formatCost } = useCurrency()

type CategoryKey = 'restaurants' | 'markets' | 'transport' | 'utilities' | 'sport' | 'childcare' | 'clothing' | 'rent' | 'buy' | 'finance'

interface PriceRow {
  key: string
  labelKey: string
  valueA: number | null
  valueB: number | null
  winner: 'a' | 'b' | null
  diffPct: number | null
}

const CATEGORIES: { key: CategoryKey; icon: string; labelKey: string; items: (keyof CityPriceData)[] }[] = [
  {
    key: 'restaurants',
    icon: '🍽️',
    labelKey: 'costBreakdown.cat.restaurants',
    items: ['mealInexpensiveRestaurant', 'mealMidRangeRestaurant', 'mcMeal', 'cappuccino', 'domesticBeerRestaurant', 'importedBeerRestaurant', 'cokeRestaurant', 'waterRestaurant'],
  },
  {
    key: 'markets',
    icon: '🛒',
    labelKey: 'costBreakdown.cat.markets',
    items: ['milk1L', 'bread500g', 'rice1kg', 'eggs12', 'chickenFillets1kg', 'beefRound1kg', 'localCheese1kg', 'apples1kg', 'banana1kg', 'oranges1kg', 'tomato1kg', 'potato1kg', 'onion1kg', 'lettuce', 'water15L', 'wineBottleMidRange', 'domesticBeerMarket', 'importedBeerMarket', 'cigarettes20Pack'],
  },
  {
    key: 'transport',
    icon: '🚌',
    labelKey: 'costBreakdown.cat.transport',
    items: ['oneWayTicket', 'monthlyTransportPass', 'taxiStart', 'taxi1km', 'taxi1hourWaiting', 'gasoline1L', 'volkswagenGolf', 'toyotaCorolla'],
  },
  {
    key: 'utilities',
    icon: '⚡',
    labelKey: 'costBreakdown.cat.utilities',
    items: ['utilitiesMonthly85m2', 'internet60mbps', 'mobileMinutePrepaid'],
  },
  {
    key: 'sport',
    icon: '🏋️',
    labelKey: 'costBreakdown.cat.sport',
    items: ['fitnessClubMonthly', 'tennisCourt1h', 'cinema1seat'],
  },
  {
    key: 'childcare',
    icon: '👶',
    labelKey: 'costBreakdown.cat.childcare',
    items: ['preschoolMonthly', 'internationalPrimarySchoolYearly'],
  },
  {
    key: 'clothing',
    icon: '👗',
    labelKey: 'costBreakdown.cat.clothing',
    items: ['jeans', 'summerDress', 'nikeShoes', 'leatherBusinessShoes'],
  },
  {
    key: 'rent',
    icon: '🏠',
    labelKey: 'costBreakdown.cat.rent',
    items: ['apartment1brCentre', 'apartment1brOutside', 'apartment3brCentre', 'apartment3brOutside'],
  },
  {
    key: 'buy',
    icon: '🏗️',
    labelKey: 'costBreakdown.cat.buy',
    items: ['pricePerM2Centre', 'pricePerM2Outside'],
  },
  {
    key: 'finance',
    icon: '💰',
    labelKey: 'costBreakdown.cat.finance',
    items: ['averageMonthlyNetSalary', 'mortgageInterestRate'],
  },
]

const ITEM_LABELS: Record<keyof CityPriceData, string> = {
  mealInexpensiveRestaurant: 'costBreakdown.items.mealInexpensive',
  mealMidRangeRestaurant: 'costBreakdown.items.mealMidRange',
  mcMeal: 'costBreakdown.items.mcMeal',
  cappuccino: 'costBreakdown.items.cappuccino',
  domesticBeerRestaurant: 'costBreakdown.items.domesticBeerRestaurant',
  importedBeerRestaurant: 'costBreakdown.items.importedBeerRestaurant',
  cokeRestaurant: 'costBreakdown.items.coke',
  waterRestaurant: 'costBreakdown.items.waterRestaurant',
  milk1L: 'costBreakdown.items.milk1L',
  bread500g: 'costBreakdown.items.bread500g',
  rice1kg: 'costBreakdown.items.rice1kg',
  eggs12: 'costBreakdown.items.eggs12',
  chickenFillets1kg: 'costBreakdown.items.chicken1kg',
  beefRound1kg: 'costBreakdown.items.beef1kg',
  localCheese1kg: 'costBreakdown.items.cheese1kg',
  apples1kg: 'costBreakdown.items.apples1kg',
  banana1kg: 'costBreakdown.items.banana1kg',
  oranges1kg: 'costBreakdown.items.oranges1kg',
  tomato1kg: 'costBreakdown.items.tomato1kg',
  potato1kg: 'costBreakdown.items.potato1kg',
  onion1kg: 'costBreakdown.items.onion1kg',
  lettuce: 'costBreakdown.items.lettuce',
  water15L: 'costBreakdown.items.water15L',
  wineBottleMidRange: 'costBreakdown.items.wine',
  domesticBeerMarket: 'costBreakdown.items.domesticBeerMarket',
  importedBeerMarket: 'costBreakdown.items.importedBeerMarket',
  cigarettes20Pack: 'costBreakdown.items.cigarettes',
  oneWayTicket: 'costBreakdown.items.oneWayTicket',
  monthlyTransportPass: 'costBreakdown.items.monthlyPass',
  taxiStart: 'costBreakdown.items.taxiStart',
  taxi1km: 'costBreakdown.items.taxi1km',
  taxi1hourWaiting: 'costBreakdown.items.taxiWaiting',
  gasoline1L: 'costBreakdown.items.gasoline1L',
  volkswagenGolf: 'costBreakdown.items.volkswagenGolf',
  toyotaCorolla: 'costBreakdown.items.toyotaCorolla',
  utilitiesMonthly85m2: 'costBreakdown.items.utilities85m2',
  internet60mbps: 'costBreakdown.items.internet60mbps',
  mobileMinutePrepaid: 'costBreakdown.items.mobile',
  fitnessClubMonthly: 'costBreakdown.items.fitnessClub',
  tennisCourt1h: 'costBreakdown.items.tennis1h',
  cinema1seat: 'costBreakdown.items.cinema',
  preschoolMonthly: 'costBreakdown.items.preschool',
  internationalPrimarySchoolYearly: 'costBreakdown.items.internationalSchool',
  jeans: 'costBreakdown.items.jeans',
  summerDress: 'costBreakdown.items.summerDress',
  nikeShoes: 'costBreakdown.items.nikeShoes',
  leatherBusinessShoes: 'costBreakdown.items.leatherShoes',
  apartment1brCentre: 'costBreakdown.items.apt1brCentre',
  apartment1brOutside: 'costBreakdown.items.apt1brOutside',
  apartment3brCentre: 'costBreakdown.items.apt3brCentre',
  apartment3brOutside: 'costBreakdown.items.apt3brOutside',
  pricePerM2Centre: 'costBreakdown.items.priceM2Centre',
  pricePerM2Outside: 'costBreakdown.items.priceM2Outside',
  averageMonthlyNetSalary: 'costBreakdown.items.avgSalary',
  mortgageInterestRate: 'costBreakdown.items.mortgageRate',
}

function toNum(val: string | null | undefined): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

function computeRow(key: keyof CityPriceData): PriceRow {
  const rawA = props.cityAPrices[key]
  const rawB = props.cityBPrices[key]
  const valueA = toNum(rawA)
  const valueB = toNum(rawB)

  let winner: 'a' | 'b' | null = null
  let diffPct: number | null = null

  if (valueA !== null && valueB !== null) {
    const pct = Math.round(Math.abs(valueA - valueB) / Math.max(valueA, valueB) * 100)
    diffPct = pct
    if (valueA < valueB) winner = 'a'
    else if (valueB < valueA) winner = 'b'
  } else if (valueA !== null || valueB !== null) {
    // one is null — show but no diff pill
    winner = null
    diffPct = null
  }

  return {
    key,
    labelKey: ITEM_LABELS[key],
    valueA,
    valueB,
    winner,
    diffPct,
  }
}

const visibleCategories = computed(() =>
  CATEGORIES.map(cat => {
    const rows = cat.items
      .map(k => computeRow(k))
      .filter(r => r.valueA !== null || r.valueB !== null)
    return { ...cat, rows, visibleCount: rows.length }
  }).filter(cat => cat.visibleCount > 0)
)

const hasAnyData = computed(() => visibleCategories.value.length > 0)
</script>
