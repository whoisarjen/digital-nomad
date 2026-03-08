<template>
  <section v-if="hasAnyData" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-6 pt-6 pb-4 flex items-center gap-2.5">
      <div class="size-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
        <LucideReceiptText :size="16" class="text-amber-600" />
      </div>
      <h2 class="text-base font-bold text-gray-900">{{ $t('costBreakdown.title') }}</h2>
    </div>

    <!-- Category nav -->
    <div class="px-6 pb-4">
      <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in visibleCategories"
          :key="cat.key"
          class="flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap"
          :class="activeCategory === cat.key
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'"
          @click="activeCategory = cat.key"
        >
          <span>{{ cat.icon }}</span>
          {{ $t(cat.labelKey) }}
          <span
            class="text-[10px] rounded-full px-1.5 py-0.5 tabular-nums"
            :class="activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-400'"
          >{{ cat.count }}</span>
        </button>
      </div>
    </div>

    <!-- Items list -->
    <div class="divide-y divide-gray-50 border-t border-gray-50">
      <div
        v-for="item in activeItems"
        :key="item.key"
        class="flex items-center justify-between px-6 py-3"
      >
        <span class="text-sm text-gray-500">{{ $t(item.labelKey) }}</span>
        <span
          v-if="item.value !== null"
          class="text-sm font-semibold text-gray-800 tabular-nums"
        >{{ formatCost(item.value) }}</span>
        <span v-else class="text-sm text-gray-300">—</span>
      </div>
    </div>

  </section>
</template>

<script lang="ts" setup>
import { useCurrency } from '~/composables/useCurrency'

// Prisma Decimal fields serialize to strings over JSON
type Price = string | null

export interface CityPriceData {
  // Restaurants
  mealInexpensiveRestaurant: Price
  mealMidRangeRestaurant: Price
  mcMeal: Price
  domesticBeerRestaurant: Price
  importedBeerRestaurant: Price
  cappuccino: Price
  cokeRestaurant: Price
  waterRestaurant: Price
  // Markets
  milk1L: Price
  bread500g: Price
  rice1kg: Price
  eggs12: Price
  localCheese1kg: Price
  chickenFillets1kg: Price
  beefRound1kg: Price
  apples1kg: Price
  banana1kg: Price
  oranges1kg: Price
  tomato1kg: Price
  potato1kg: Price
  onion1kg: Price
  lettuce: Price
  water15L: Price
  wineBottleMidRange: Price
  domesticBeerMarket: Price
  importedBeerMarket: Price
  cigarettes20Pack: Price
  // Transport
  oneWayTicket: Price
  monthlyTransportPass: Price
  taxiStart: Price
  taxi1km: Price
  taxi1hourWaiting: Price
  gasoline1L: Price
  volkswagenGolf: Price
  toyotaCorolla: Price
  // Utilities
  utilitiesMonthly85m2: Price
  mobileMinutePrepaid: Price
  internet60mbps: Price
  // Sport & Leisure
  fitnessClubMonthly: Price
  tennisCourt1h: Price
  cinema1seat: Price
  // Childcare
  preschoolMonthly: Price
  internationalPrimarySchoolYearly: Price
  // Clothing
  jeans: Price
  summerDress: Price
  nikeShoes: Price
  leatherBusinessShoes: Price
  // Rent
  apartment1brCentre: Price
  apartment1brOutside: Price
  apartment3brCentre: Price
  apartment3brOutside: Price
  // Buy
  pricePerM2Centre: Price
  pricePerM2Outside: Price
  // Finance
  averageMonthlyNetSalary: Price
  mortgageInterestRate: Price
}

const props = defineProps<{ prices: CityPriceData }>()

const { formatCost } = useCurrency()

type CategoryKey = 'restaurants' | 'markets' | 'transport' | 'utilities' | 'sport' | 'childcare' | 'clothing' | 'rent' | 'buy' | 'finance'

interface PriceItem {
  key: string
  labelKey: string
  value: number | null
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

function countNonNull(keys: (keyof CityPriceData)[]) {
  return keys.filter(k => props.prices[k] !== null).length
}

const visibleCategories = computed(() =>
  CATEGORIES
    .map(cat => ({ ...cat, count: countNonNull(cat.items) }))
    .filter(cat => cat.count > 0)
)

const hasAnyData = computed(() => visibleCategories.value.length > 0)

const activeCategory = ref<CategoryKey>('restaurants')

// Auto-select first available category
watchEffect(() => {
  if (visibleCategories.value.length > 0 && !visibleCategories.value.find(c => c.key === activeCategory.value)) {
    activeCategory.value = visibleCategories.value[0]!.key
  }
})

const activeItems = computed<PriceItem[]>(() => {
  const cat = CATEGORIES.find(c => c.key === activeCategory.value)
  if (!cat) return []
  return cat.items.map(key => ({
    key,
    labelKey: ITEM_LABELS[key],
    value: props.prices[key] !== null ? Number(props.prices[key]) : null,
  }))
})
</script>
