<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <Hero :image="data?.image" />
    <section class="p-6 flex flex-col gap-6">
      <section v-if="!data || status !== 'success'" class="flex max-md:flex-col gap-6 max-md:items-center animate-pulse">
        <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
          <div class="h-10 bg-gray-300 rounded-xl"></div>
          <div class="h-40 bg-gray-300 rounded-xl"></div>
        </aside>

        <div class="p-4 flex flex-col gap-4 flex-1">
          <div class="h-6 w-3/4 bg-gray-300 rounded"></div>

          <div class="grid grid-cols-2 gap-4">
            <div class="custom-box h-32 bg-gray-300 rounded"></div>
            <div class="custom-box h-32 bg-gray-300 rounded"></div>
          </div>

          <div class="grid grid-cols-4 gap-4 mt-4">
            <div v-for="index in 4" :key="index" class="flex flex-col items-center custom-box h-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>
      <section v-else class="flex max-md:flex-col gap-6 max-md:items-center">
        <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-xl border transition-all duration-500 text-center text-sm text-white bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            Main page
          </NuxtLink>
          <MonthsPicker />
        </aside>
        <div class="p-4 flex flex-col gap-4 flex-1">
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
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
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
</script>
