<template>
  <div class="container">
    <template v-if="!data || status !== 'success'">
      <div class="grid grid-cols-4 gap-4">
        <div v-for="index in 12" :key="index" class="bg-gray-300 animate-pulse rounded h-20"></div>
      </div>
    </template>

    <template v-else>
      <div class="p-4 flex flex-col gap-4 flex-1">
        <div class="relative aspect-video overflow-hidden">
          <NuxtImg
            provider="unsplash"
            :src="data.image?.url.replace('https://images.unsplash.com', '')"
            :alt="data.name"
            class="w-full aspect-video object-cover rounded-t-xl transition-all transform group-hover:scale-105"
            loading="lazy"
            width="1024"
            quality="100"
          />
          <div v-if="data.image" class="text-xs absolute bottom-0 right-0 text-white bg-black py-1 px-2 rounded-tl-lg">
            <NuxtLink target="_blank" :to="`https://unsplash.com/@${data.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ data.image.ownerName }}</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
          </div>
        </div>

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
  </div>
</template>

<script lang="ts" setup>
import type { InternalApi } from 'nitropack';

const router = useRouter()
const slug = computed(() => router.currentRoute.value.params.slug as string)

// TODO rewrite to useCitiesBySlug
const { data, status } = await useFetch<InternalApi['/api/cities/:slug']['get']>(() => `/api/cities/${slug.value}`, {
  watch: [() => slug.value],
  immediate: true,
})
</script>
