<template>
  <div v-if="data" class="p-4 flex flex-col gap-4 flex-1">
    <h3 class="text-xl font-semibold text-gray-900">
      {{ data.name }}, {{ data.country }}
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div class="custom-box">
        <h5 class="font-semibold">Internet</h5>
        <p>Speed: {{ data.internetSpeed }} Mbps</p>
        <p>Digital Nomad Score: {{ data.internetScoreDigitalNomad }}</p>
        <p>City Speed: {{ data.internetSpeedCity }} Mbps (Rank: {{ data.internetSpeedCityRanking }})</p>
        <p>Country Speed: {{ data.internetSpeedCountry }} Mbps (Rank: {{ data.internetSpeedCountryRanking }})</p>
      </div>

      <div class="custom-box">
        <h5 class="font-semibold">Air Quality</h5>
        <p>Now: {{ data.airQualityNow }}</p>
        <p>Score: {{ data.airQualityScore }}</p>
        <p>Now Score: {{ data.airQualityNowScore }}</p>
        <p>Humidity: {{ data.humidity }}</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mt-4">
      <div
        v-for="(monthData, index) in data.monthSummary"
        :key="index"
        class="flex flex-col items-center custom-box"
      >
        <span class="text-sm text-gray-500 font-semibold">{{ new Date(2023, Number(monthData.month) - 1).toLocaleString('en-US', { month: 'long' }) }}</span>
        <WeatherIcon :weather-icon="monthData.weatherIcon" class="text-3xl" />
        <span class="text-primary-500 text-lg font-bold">{{ Number(monthData.apparentTemperatureMax).toFixed(1) }}°C</span>
        <div class="text-xs text-gray-500 flex gap-2 mt-2">
          <span>🌧️ {{ Number(monthData.rainSum).toFixed(1) }}mm</span>
          <span>☀️ {{ Number(monthData.sunshineDuration).toFixed(1) }} hrs</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { InternalApi } from 'nitropack';

const router = useRouter()
const slug = computed(() => router.currentRoute.value.params.slug as string)

// TODO rewrite to useCitiesBySlug
const { data } = await useFetch<InternalApi['/api/cities/:slug']['get']>(() => `/api/cities/${slug.value}`, {
  watch: [() => slug.value],
  immediate: true,
})
</script>
