<template>
  <div v-if="props.city" class="p-4 flex flex-col gap-4 flex-1">
    <h3 class="text-xl font-semibold text-gray-900">
      {{ props.city.name }}, {{ props.city.country }}
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div class="custom-box">
        <h5 class="font-semibold">Internet</h5>
        <p>Speed: {{ props.city.internetSpeed }} Mbps</p>
        <p>Digital Nomad Score: {{ props.city.internetScoreDigitalNomad }}</p>
        <p>City Speed: {{ props.city.internetSpeedCity }} Mbps (Rank: {{ props.city.internetSpeedCityRanking }})</p>
        <p>Country Speed: {{ props.city.internetSpeedCountry }} Mbps (Rank: {{ props.city.internetSpeedCountryRanking }})</p>
      </div>

      <div class="custom-box">
        <h5 class="font-semibold">Air Quality</h5>
        <p>Now: {{ props.city.airQualityNow }}</p>
        <p>Score: {{ props.city.airQualityScore }}</p>
        <p>Now Score: {{ props.city.airQualityNowScore }}</p>
        <p>Humidity: {{ props.city.humidity }}</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mt-4">
      <div
        v-for="(monthData, index) in props.city.monthSummary"
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

const props = defineProps<{ city: InternalApi['/api/cities/:slug']['get'] | null | undefined }>()
</script>
