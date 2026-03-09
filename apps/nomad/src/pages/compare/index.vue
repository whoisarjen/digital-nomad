<template>
  <div class="min-h-screen">
    <!-- ─── Dark Header Zone ─── -->
    <section class="relative pt-24 pb-16 px-6 overflow-hidden">
      <div
        class="absolute inset-0 opacity-40"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);"
      />
      <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />
      <div class="absolute -bottom-[10%] -left-[15%] w-[30%] h-[30%] rounded-full bg-accent-500/[0.04] blur-[80px]" />

      <div class="relative max-w-screen-xl mx-auto">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-3 mb-4">
          <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-sm text-primary-400">{{ $t('compare.hubTitle') }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('compare.hubTitle') }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('compare.hubSubtitle') }}
        </p>
      </div>
    </section>

    <!-- ─── Content Zone ─── -->
    <section class="relative z-10 min-h-[60vh]">
      <div class="max-w-screen-xl mx-auto px-6 py-12">

        <!-- City Picker -->
        <div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-12">
          <h2 class="text-lg font-bold text-white mb-1">{{ $t('compare.pickCities') }}</h2>
          <p class="text-sm text-white/40 mb-6">{{ $t('compare.hubSubtitle') }}</p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            <!-- City A -->
            <div class="flex-1 relative">
              <label class="text-xs font-medium text-white/40 uppercase tracking-wide mb-1.5 block">City A</label>
              <div class="relative">
                <LucideSearch :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  v-model="searchA"
                  type="text"
                  :placeholder="$t('compare.searchCity')"
                  class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary-400/50 transition-colors"
                  @focus="showDropdownA = true"
                  @blur="handleBlurA"
                />
              </div>
              <!-- Dropdown A -->
              <div
                v-if="showDropdownA && filteredCitiesA.length > 0"
                class="absolute z-30 left-0 right-0 top-full mt-1 bg-[#0d1b2e] rounded-xl border border-white/[0.1] shadow-xl max-h-60 overflow-y-auto"
              >
                <button
                  v-for="city in filteredCitiesA"
                  :key="city.slug"
                  class="w-full px-4 py-2.5 text-left text-sm hover:bg-white/[0.06] transition-colors flex items-center gap-3"
                  @mousedown.prevent="selectCityA(city)"
                >
                  <CustomNuxtImg
                    v-if="city.imageUrl"
                    :src="city.imageUrl"
                    :alt="city.name"
                    width="40"
                    height="40"
                    quality="75"
                    class="size-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <div v-else class="size-8 rounded-lg bg-white/[0.08] flex-shrink-0" />
                  <div>
                    <span class="font-medium text-white">{{ city.name }}</span>
                    <span class="text-white/40 ml-1">{{ city.country }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- VS divider -->
            <div class="flex items-center justify-center sm:pb-3">
              <span class="text-sm font-bold text-white/25 uppercase">{{ $t('compare.vs') }}</span>
            </div>

            <!-- City B -->
            <div class="flex-1 relative">
              <label class="text-xs font-medium text-white/40 uppercase tracking-wide mb-1.5 block">City B</label>
              <div class="relative">
                <LucideSearch :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  v-model="searchB"
                  type="text"
                  :placeholder="$t('compare.searchCity')"
                  class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary-400/50 transition-colors"
                  @focus="showDropdownB = true"
                  @blur="handleBlurB"
                />
              </div>
              <!-- Dropdown B -->
              <div
                v-if="showDropdownB && filteredCitiesB.length > 0"
                class="absolute z-30 left-0 right-0 top-full mt-1 bg-[#0d1b2e] rounded-xl border border-white/[0.1] shadow-xl max-h-60 overflow-y-auto"
              >
                <button
                  v-for="city in filteredCitiesB"
                  :key="city.slug"
                  class="w-full px-4 py-2.5 text-left text-sm hover:bg-white/[0.06] transition-colors flex items-center gap-3"
                  @mousedown.prevent="selectCityB(city)"
                >
                  <CustomNuxtImg
                    v-if="city.imageUrl"
                    :src="city.imageUrl"
                    :alt="city.name"
                    width="40"
                    height="40"
                    quality="75"
                    class="size-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <div v-else class="size-8 rounded-lg bg-white/[0.08] flex-shrink-0" />
                  <div>
                    <span class="font-medium text-white">{{ city.name }}</span>
                    <span class="text-white/40 ml-1">{{ city.country }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Compare button -->
            <button
              :disabled="!selectedA || !selectedB"
              class="sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm transition-all"
              :class="selectedA && selectedB
                ? 'bg-accent-500 hover:bg-accent-400 text-white shadow-lg shadow-accent-500/20 cursor-pointer'
                : 'bg-white/[0.06] text-white/25 cursor-not-allowed'"
              @click="goCompare"
            >
              {{ $t('compare.compareNow') }}
            </button>
          </div>
        </div>

        <!-- Loading skeleton for popular comparisons -->
        <template v-if="status === 'pending'">
          <div class="mb-6">
            <div class="h-7 skeleton w-56 mb-2" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="h-20 skeleton rounded-2xl" />
          </div>
        </template>

        <!-- Popular Comparisons -->
        <template v-else-if="data?.popularPairs?.length">
          <h2 class="text-xl font-bold text-white mb-6">{{ $t('compare.popularComparisons') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="pair in data.popularPairs"
              :key="pair.slugs"
              :to="localePath({ name: 'compare-slugs', params: { slugs: pair.slugs } })"
              class="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:border-primary-400/30 hover:bg-white/[0.07] transition-all group"
            >
              <div class="flex items-center gap-3">
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-semibold text-white truncate block">{{ pair.cityA }}</span>
                  <span class="text-xs text-white/40">{{ pair.countryA }}</span>
                </div>
                <div class="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-white/[0.06] group-hover:bg-primary-500/[0.15] transition-colors">
                  <span class="text-[10px] font-bold text-white/40 group-hover:text-primary-400 transition-colors uppercase">vs</span>
                </div>
                <div class="flex-1 min-w-0 text-right">
                  <span class="text-sm font-semibold text-white truncate block">{{ pair.cityB }}</span>
                  <span class="text-xs text-white/40">{{ pair.countryB }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>

        <!-- Back link -->
        <div class="mt-12 pb-4">
          <NuxtLink
            :to="localePath('index')"
            class="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-primary-400 transition-colors"
          >
            <LucideArrowLeft :size="14" />
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { buildCompareSlug } from '~/shared/global.utils'

defineI18nRoute({
  paths: {
    en: '/compare',
    pl: '/porownaj',
  },
})

const { t } = useCustomI18n()
const localePath = useLocalePath()
const router = useRouter()

const { data, status } = await useComparePairs({ lazy: true })

// City picker state
const searchA = ref('')
const searchB = ref('')
const selectedA = ref<{ name: string; slug: string; country: string } | null>(null)
const selectedB = ref<{ name: string; slug: string; country: string } | null>(null)
const showDropdownA = ref(false)
const showDropdownB = ref(false)

const filteredCitiesA = computed(() => {
  if (!data.value?.cities || searchA.value.length < 2) return []
  const q = searchA.value.toLowerCase()
  return data.value.cities
    .filter((c: any) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    .filter((c: any) => c.slug !== selectedB.value?.slug)
    .slice(0, 8)
})

const filteredCitiesB = computed(() => {
  if (!data.value?.cities || searchB.value.length < 2) return []
  const q = searchB.value.toLowerCase()
  return data.value.cities
    .filter((c: any) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    .filter((c: any) => c.slug !== selectedA.value?.slug)
    .slice(0, 8)
})

function selectCityA(city: any) {
  selectedA.value = city
  searchA.value = `${city.name}, ${city.country}`
  showDropdownA.value = false
}

function selectCityB(city: any) {
  selectedB.value = city
  searchB.value = `${city.name}, ${city.country}`
  showDropdownB.value = false
}

function handleBlurA() {
  setTimeout(() => { showDropdownA.value = false }, 150)
}

function handleBlurB() {
  setTimeout(() => { showDropdownB.value = false }, 150)
}

function goCompare() {
  if (!selectedA.value || !selectedB.value) return
  const slugs = buildCompareSlug(selectedA.value.slug, selectedB.value.slug)
  router.push(localePath({ name: 'compare-slugs', params: { slugs } }))
}

useSeoMeta({
  title: () => t('compare.hubTitle'),
  description: () => t('compare.hubSubtitle'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('compare.hubTitle') },
    ],
  }),
])
</script>
