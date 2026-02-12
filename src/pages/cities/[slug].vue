<template>
  <div class="text-gray-900">
    <!-- Loading state -->
    <template v-if="!data || status !== 'success'">
      <div class="h-[40vh] min-h-[280px] bg-gray-200 animate-pulse" />
      <div class="max-w-screen-xl mx-auto p-6 flex flex-col gap-6 animate-pulse">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="i in 6" :key="i" class="h-24 bg-gray-200 rounded-xl" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="h-48 bg-gray-200 rounded-xl" />
          <div class="h-48 bg-gray-200 rounded-xl" />
        </div>
        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          <div v-for="i in 12" :key="i" class="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </template>

    <!-- Loaded state -->
    <template v-else>
      <Hero
        :image="data.image"
        :city-name="data.name"
        :country="data.country"
        :region="data.region"
      />

      <div class="max-w-screen-xl mx-auto p-6 flex flex-col gap-8">
        <!-- Key Metrics Strip -->
        <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 -mt-10 relative z-20">
          <div class="bg-white rounded-xl shadow-md p-4 text-center">
            <p class="text-xs text-gray-500 mb-1">Nomad Cost</p>
            <p class="text-xl font-bold text-emerald-600">${{ data.costForNomadInUsd }}<span class="text-sm font-normal text-gray-400">/mo</span></p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-4 text-center">
            <p class="text-xs text-gray-500 mb-1">Internet</p>
            <p class="text-xl font-bold text-cyan-600">{{ data.internetSpeedCity }}<span class="text-sm font-normal text-gray-400"> Mbps</span></p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-4 text-center">
            <p class="text-xs text-gray-500 mb-1">Safety</p>
            <div class="flex items-center justify-center gap-1.5">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :class="getLevelDotClass(data.safety)"
              />
              <p class="text-lg font-bold capitalize" :class="getLevelTextClass(data.safety)">{{ data.safety?.toLowerCase() ?? 'N/A' }}</p>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-md p-4 text-center">
            <p class="text-xs text-gray-500 mb-1">Air Quality</p>
            <p class="text-xl font-bold" :class="getAirQualityClass(data.airQualityScore)">{{ data.airQualityScore }}<span class="text-sm font-normal text-gray-400">/5</span></p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-4 text-center">
            <p class="text-xs text-gray-500 mb-1">Healthcare</p>
            <div class="flex items-center justify-center gap-1.5">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :class="getLevelDotClass(data.healthCare)"
              />
              <p class="text-lg font-bold capitalize" :class="getLevelTextClass(data.healthCare)">{{ data.healthCare?.toLowerCase() ?? 'N/A' }}</p>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-md p-4 text-center">
            <p class="text-xs text-gray-500 mb-1">Population</p>
            <p class="text-xl font-bold text-gray-700">{{ formatNumber(data.population) }}</p>
          </div>
        </section>

        <!-- Detail Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Cost of Living -->
          <section class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LucideWallet :size="20" class="text-emerald-600" />
              Cost of Living
            </h2>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Nomad</span>
                <span class="font-semibold text-emerald-600">${{ data.costForNomadInUsd }}/mo</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Expat</span>
                <span class="font-semibold text-gray-700">${{ data.costForExpatInUsd }}/mo</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Local</span>
                <span class="font-semibold text-gray-700">${{ data.costForLocalInUsd }}/mo</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-600">Family</span>
                <span class="font-semibold text-gray-700">${{ data.costForFamilyInUsd }}/mo</span>
              </div>
            </div>
          </section>

          <!-- Internet & Infrastructure -->
          <section class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LucideWifi :size="20" class="text-cyan-600" />
              Internet & Infrastructure
            </h2>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">City Speed</span>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-cyan-600">{{ data.internetSpeedCity }} Mbps</span>
                  <span v-if="data.internetSpeedCityRanking" class="text-xs text-gray-400">#{{ data.internetSpeedCityRanking }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Country Speed</span>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-700">{{ data.internetSpeedCountry }} Mbps</span>
                  <span v-if="data.internetSpeedCountryRanking" class="text-xs text-gray-400">#{{ data.internetSpeedCountryRanking }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Environment & Health -->
          <section class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LucideLeaf :size="20" class="text-green-600" />
              Environment & Health
            </h2>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Air Quality Now</span>
                <span class="font-semibold">{{ data.airQualityNow }} AQI</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Air Quality Score</span>
                <span class="font-semibold" :class="getAirQualityClass(data.airQualityScore)">{{ data.airQualityScore }}/5</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Humidity</span>
                <span class="font-semibold text-gray-700">{{ data.humidity }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Pollution</span>
                <span class="font-semibold capitalize" :class="getLevelTextClass(data.pollution, true)">{{ data.pollution?.toLowerCase() ?? 'N/A' }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-600">Climate</span>
                <span class="font-semibold capitalize" :class="getLevelTextClass(data.climate)">{{ data.climate?.toLowerCase() ?? 'N/A' }}</span>
              </div>
            </div>
          </section>

          <!-- Quality of Life -->
          <section class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LucideHeart :size="20" class="text-rose-500" />
              Quality of Life
            </h2>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Safety</span>
                <span class="font-semibold capitalize" :class="getLevelTextClass(data.safety)">{{ data.safety?.toLowerCase() ?? 'N/A' }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Healthcare</span>
                <span class="font-semibold capitalize" :class="getLevelTextClass(data.healthCare)">{{ data.healthCare?.toLowerCase() ?? 'N/A' }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Monthly Weather -->
        <section class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LucideCalendar :size="20" class="text-primary-600" />
            Monthly Weather
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
            <div
              v-for="(monthData, index) in months"
              :key="index"
              class="flex flex-col items-center rounded-xl border p-3 transition-all"
              :class="{
                'bg-emerald-50 border-emerald-200': monthData.totalScoreLevel === 'HIGH',
                'bg-yellow-50 border-yellow-200': monthData.totalScoreLevel === 'MIDDLE',
                'bg-white border-gray-200': monthData.totalScoreLevel === 'LOW',
              }"
            >
              <span class="text-xs font-semibold text-gray-500">{{ getMonthShort(monthData.month) }}</span>
              <WeatherIcon :weather-icon="monthData.weatherIcon" class="my-1" />
              <span class="text-primary-700 text-lg font-bold">{{ Number(monthData.apparentTemperatureMax).toFixed(0) }}°</span>
              <div class="text-[10px] text-gray-400 flex flex-col items-center mt-1 gap-0.5">
                <span>{{ Number(monthData.rainSum).toFixed(0) }}mm</span>
                <span>{{ Number(monthData.sunshineDuration).toFixed(0) }}h</span>
              </div>
              <span class="mt-1 text-xs font-bold" :class="{
                'text-emerald-600': monthData.totalScoreLevel === 'HIGH',
                'text-yellow-600': monthData.totalScoreLevel === 'MIDDLE',
                'text-gray-400': monthData.totalScoreLevel === 'LOW',
              }">{{ monthData.totalScore }}</span>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Level } from '@prisma/client';
import { formatNumber } from '~/shared/global.utils';

const route = useRoute()

const queryParams = ref({
  slug: route.params.slug as string,
})

watch(
  () => route.params.slug as string,
  (slug) => {
    if (slug) {
      queryParams.value.slug = slug
    }
  },
  { immediate: true }
)

const { data, status } = await useCitiesBySlug(queryParams, {
  lazy: true,
})

const months = computed(() => {
  const getMedian = (arr: number[]) => {
    const sorted = arr.slice().sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2
  }

  const low = getMedian(data.value?.monthSummary.map((item) => item.totalScore) ?? [])
  const middle = getMedian(data.value?.monthSummary.map((item) => item.totalScore).filter(value => value >= low) ?? [])

  return data.value?.monthSummary.map((item) => {
    const totalScore = item.totalScore
    const totalScoreLevel =
      totalScore < low ? 'LOW' :
      totalScore < middle ? 'MIDDLE' :
      'HIGH'

    return { ...item, totalScoreLevel }
  })
})

const getMonthShort = (month: string) => {
  return new Date(2023, Number(month) - 1).toLocaleString('en-US', { month: 'short' })
}

const getLevelDotClass = (level: Level | undefined | null) => {
  if (!level) return 'bg-gray-400'
  if (level === 'HIGH') return 'bg-emerald-500'
  if (level === 'MIDDLE') return 'bg-yellow-500'
  return 'bg-red-500'
}

const getLevelTextClass = (level: Level | undefined | null, inverted = false) => {
  if (!level) return 'text-gray-500'
  const isGood = inverted ? level === 'LOW' : level === 'HIGH'
  const isMid = level === 'MIDDLE'
  if (isGood) return 'text-emerald-600'
  if (isMid) return 'text-yellow-600'
  return 'text-red-600'
}

const getAirQualityClass = (score: number) => {
  if (score >= 4) return 'text-emerald-600'
  if (score >= 3) return 'text-yellow-600'
  return 'text-red-600'
}
</script>
