<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Hero -->
    <section class="relative min-h-[85vh] flex flex-col justify-center items-center text-center text-white p-6 bg-[#060E1B] overflow-hidden">
      <!-- Dot grid pattern (SVG for GPU efficiency) -->
      <div
        class="absolute inset-0 opacity-[0.07]"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.5)'/%3E%3C/svg%3E&quot;);"
      />

      <!-- Content -->
      <div class="relative z-20 py-12 max-w-3xl mx-auto flex flex-col items-center gap-6">
        <div class="flex flex-col items-center">
          <img
            src="/digital-nomad-logo.png"
            alt="Digital Nomad"
            class="w-24 h-24 md:w-32 md:h-32 mb-4"
          />
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Every city, decoded.<br class="hidden sm:block" />
            <span class="text-primary-400">Pick yours.</span>
          </h1>
          <p class="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Compare cost of living, weather, internet speed, safety, and 12+ data points
            across 500+ cities — filtered to exactly what you need.
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
            <LucideWallet :size="15" class="text-emerald-400" />
            Cost breakdowns
          </span>
          <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
            <LucideThermometer :size="15" class="text-amber-400" />
            Weather calendar
          </span>
          <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
            <LucideWifi :size="15" class="text-cyan-400" />
            Internet speed
          </span>
          <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
            <LucideShieldCheck :size="15" class="text-emerald-400" />
            Safety scores
          </span>
        </div>

        <a
          href="#app"
          class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white font-semibold px-8 py-3.5 rounded-xl text-base"
        >
          Explore Cities
          <LucideChevronDown :size="18" />
        </a>

        <p class="text-xs text-gray-500 flex flex-wrap justify-center gap-x-3">
          <span>500+ cities analyzed</span>
          <span class="text-gray-700">&middot;</span>
          <span>Updated monthly</span>
          <span class="text-gray-700">&middot;</span>
          <span>12+ data points per city</span>
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="p-6 flex flex-col gap-6" id="app">
      <section class="flex gap-6 justify-end flex-col md:flex-row items-center">
        <div class="flex-1 bg-white">
          <SearchBar />
        </div>
        <div class="flex gap-1 max-md:w-full">
          <SinglePicker
            name="orderBy"
            operation="equals"
            :options="OPTIONS_ORDER_BY"
            :customDefaultOption="OPTIONS_ORDER_BY[0]"
          />
          <SortPicker />
        </div>
      </section>

      <section class="flex max-md:flex-col gap-6 max-md:items-center">
        <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
          <h3 class="text-xl font-bold">Filters</h3>
          <div
            @click="() => isClearFilter && router.push({ query: {} })"
            class="px-4 py-2 rounded-xl border text-center text-sm text-white"
            :class="{
              'bg-red-600 hover:bg-red-700 cursor-pointer': isClearFilter,
              'cursor-not-allowed opacity-50 bg-gray-400 hover:bg-gray-400': !isClearFilter,
            }"
          >
            Clear filters
          </div>
          <MonthsPicker />
          <TemperaturesPicker />
          <WeathersPicker />
          <RegionsPicker />
          <PricesPicker :min="filters?.data.costs.costMin ?? 0" :max="filters?.data.costs.costMax ?? 0" />
          <template v-if="filters?.pickers">
            <SinglePicker
              v-for="key of Object.keys(filters?.pickers)"
              :key="key"
              :name="key"
              :operation="filters['pickers'][key as keyof typeof filters['pickers']].operation"
              :options="filters['pickers'][key as keyof typeof filters['pickers']].options"
              isLabel
            />
          </template>
        </aside>

        <div class="flex flex-col gap-6 flex-1 w-full">
          <div
            v-if="isClearFilter"
            class="text-sm flex gap-1 items-center"
          >
            <b>Filters:</b>
            <span>{{ Object.entries(queryParams).map(([key, value]) =>
              `${key.split('_').map(upperFirst).join(' ')} (${key === 'months'
                ? new Date(2025, Number(value) - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase()
                : `${filters?.pickers[key as keyof typeof filters['pickers']]?.operation === 'lte' ? '≤' : ''}${value}`.toLowerCase().split(',').join(', ').replace('gte:', '').replace('lte:', '')}${filters?.pickers[key as keyof typeof filters['pickers']]?.operation === 'gte' ? '≤' : ''})`).join(', ') }}
              </span>
          </div>

          <!-- Cards Grid -->
          <div class="gap-5 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <!-- Skeleton Loading -->
            <template v-if="status === 'pending'">
              <div v-for="city in 40" :key="city" class="bg-white rounded-xl overflow-hidden">
                <div class="aspect-[3/2] bg-gray-200 animate-pulse" />
                <div class="px-4 pt-3.5 pb-1 flex justify-between items-start gap-3">
                  <div class="flex-1">
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div class="h-3 bg-gray-100 rounded animate-pulse w-1/3 mt-1.5" />
                  </div>
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div class="px-4 pb-3.5 pt-2 flex justify-between">
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-12" />
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-14" />
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-8" />
                </div>
              </div>
            </template>

            <!-- City Cards -->
            <template v-else>
              <div class="relative w-full flex" v-for="city in cities?.data" :key="city.slug">
                <NuxtLink
                  :to="`/cities/${city.slug}`"
                  class="bg-white cursor-pointer rounded-xl overflow-hidden shadow-sm w-full flex flex-col"
                >
                  <!-- Photo -->
                  <div class="relative aspect-[3/2] overflow-hidden">
                    <NuxtImg
                      provider="unsplash"
                      :src="city.image?.url.replace('https://images.unsplash.com', '')"
                      :alt="city.name"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      quality="75"
                    />
                    <!-- Weather pill -->
                    <div class="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-full px-2.5 py-1 text-sm font-medium text-white">
                      <WeatherIcon :weather-icon="city.weatherIcon" />
                      <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
                    </div>
                  </div>

                  <!-- Identity + Price -->
                  <div class="flex items-start justify-between gap-3 px-4 pt-3.5 pb-1">
                    <div class="min-w-0">
                      <h3 class="text-base font-semibold text-gray-900 leading-tight truncate">
                        {{ city.name }}, {{ city.country }}
                      </h3>
                      <span class="text-xs text-gray-400 mt-0.5 block">
                        {{ city.region?.replace(/([A-Z])/g, ' $1').trim() }}
                      </span>
                    </div>
                    <span class="text-base font-bold text-emerald-600 tabular-nums whitespace-nowrap flex-shrink-0 leading-tight">
                      ${{ city.costForNomadInUsd }}<span class="text-[11px] font-normal text-gray-400">/mo</span>
                    </span>
                  </div>

                  <!-- Supporting Metrics -->
                  <div class="flex items-center justify-between px-4 pb-3.5 pt-2 text-xs text-gray-500">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="size-2 rounded-full flex-shrink-0"
                        :class="getSafetyDotColor(city.safety)"
                      />
                      <span>{{ formatSafetyLabel(city.safety) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <LucideWifi :size="12" class="text-gray-400" />
                      <span>{{ city.internetSpeedCity }} Mbps</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <LucideStar :size="12" class="text-amber-400 fill-amber-400" />
                      <span class="font-semibold text-gray-700">{{ city.totalScore }}</span>
                    </div>
                  </div>
                </NuxtLink>

                <!-- Unsplash credit -->
                <div v-if="city.image"
                     class="absolute top-0 right-0 w-full pointer-events-none"
                     style="aspect-ratio: 3/2;">
                  <div class="absolute bottom-0 right-0 pointer-events-auto text-[10px] text-white/70 bg-black/40 py-0.5 px-1.5 rounded-tl-md z-10">
                    <a
                      target="_blank"
                      :href="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`"
                      class="hover:text-white"
                    >{{ city.image.ownerName }}</a>
                    /
                    <a
                      target="_blank"
                      href="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral"
                      class="hover:text-white"
                    >Unsplash</a>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center">
            <section
              v-if="status === 'pending'"
              class="flex items-center justify-center mt-5 gap-1"
            >
              <div class="bg-gray-300 rounded-xl animate-pulse size-11"></div>
              <div v-for="n in 5" :key="n" class="bg-gray-300 rounded-xl animate-pulse size-11" />
              <div class="bg-gray-300 rounded-xl animate-pulse size-11"></div>
            </section>
            <Pagination v-else :pages-count="cities?.pagesCount ?? 0" />
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="mt-8 mb-4">
        <div class="bg-white rounded-xl p-6 shadow-sm max-w-2xl mx-auto flex items-center gap-5 max-sm:flex-col max-sm:text-center">
          <img
            src="https://avatars.githubusercontent.com/whoisarjen"
            alt="Kamil"
            class="w-16 h-16 rounded-full border-2 border-primary-200 flex-shrink-0"
          />
          <div>
            <h4 class="font-semibold text-gray-900 mb-1">Built by Kamil</h4>
            <p class="text-sm text-gray-600 mb-2">
              I built this app to help digital nomads find the best cities to live, work, and thrive. It's actively evolving — your feedback shapes its future!
            </p>
            <a
              href="mailto:kamilow97@gmail.com"
              class="inline-flex items-center gap-1 text-sm text-primary-700 hover:text-primary-800 font-medium"
            >
              <LucideMail :size="14" />
              Share Feedback
            </a>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@prisma/client';
import upperFirst from 'lodash/upperFirst';
import type { GetCitiesSchema } from '~/shared/global.schema';
import { getUserCurrentMonthString, OPTIONS_ORDER_BY } from '~/shared/global.utils';

const route = useRoute()
const router = useRouter()

const isClearFilter = computed(() => Object.keys(route.query).length)
const queryParams = computed(() => ({
  ...route.query,
  months: route.query.months ?? getUserCurrentMonthString(),
})) as Ref<Partial<GetCitiesSchema>>

const { data: cities, status } = await useCities(queryParams)
const { data: filters } = await useCitiesFilters()

watch(() => queryParams.value.page, () => {
  window?.scrollTo({ top: 0 });
}, { immediate: true })

const getSafetyDotColor = (level: Level | undefined | null) => {
  if (!level) return 'bg-gray-300'
  if (level === 'HIGH') return 'bg-emerald-500'
  if (level === 'MIDDLE') return 'bg-amber-400'
  return 'bg-red-400'
}

const formatSafetyLabel = (level: Level | undefined | null) => {
  if (!level) return 'N/A'
  const labels: Record<string, string> = {
    HIGH: 'Safe',
    MIDDLE: 'Moderate',
    LOW: 'Caution',
  }
  return labels[level] ?? level.toLowerCase()
}
</script>
