<template>
    <div class="min-h-screen bg-gray-100 text-gray-900">
      <section class="bg-blue-600 text-white py-20 text-center">
        <h1 class="text-5xl font-bold">Explore. Work. Live.</h1>
        <p class="mt-4 text-lg">Find the perfect city for your digital nomad lifestyle.</p>
        <div class="mt-6">
          <input 
            type="text" 
            placeholder="Search for a city..." 
            class="w-3/4 p-3 rounded-lg text-gray-900 focus:outline-none"
          />
        </div>
      </section>
  
      <section class="py-12 px-6 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <aside class="lg:col-span-1 rounded-2xl flex flex-col gap-3">
          <h3 class="text-xl font-bold">Filters</h3>
          <MonthsPicker />
          <template v-if="data">
            <SinglePicker
              v-for="key of Object.keys(data.filters)"
              :key="key"
              :name="key"
              :operation="data.filters[key as keyof typeof data['filters']].operation"
              :options="data.filters[key as keyof typeof data['filters']].options"
            />
          </template>
        </aside>
  
        <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <template v-if="status === 'pending'">
            <div v-for="city in 20" :key="city" class="bg-white shadow-xl rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl">
              <div class="h-64 bg-gray-300 rounded-t-lg animate-pulse" />
            </div>
          </template>
          <template v-else>
            <div v-for="city in data?.cities" :key="city.slug" class="bg-white shadow-xl rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl">
              <img :src="city.image" :alt="city.name" class="rounded-lg w-full object-cover">
              <div class="p-3 flex flex-col gap-3">
                <h3 class="text-xl font-semibold text-gray-900">{{ city.name }}, {{ city.country }}</h3>
                <p class="text-sm text-gray-600">Population: {{ city.population }}</p>
                <div class="flex justify-between text-sm">
                  <span class="text-blue-500 flex items-center gap-1"><WeatherIcon :weather-code="city.weathersAverage[0]?.weatherCode" /> {{ Number(city.temperature).toFixed(1) }}°C</span>
                  <span class="text-green-500">💰 ${{ city.costForNomadInUsd }}/mo</span>
                  <span class="text-yellow-500">🌐 {{ city.internetSpeed }} Mbps</span>
                </div>
              </div>
            </div>
            <div class="col-span-4">
              <Pagination :pages-count="data?.pagesCount ?? 0" />
            </div>
          </template>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { getUserCurrentMonthString } from '~/shared/global.utils';

  const route = useRoute()

  const params = computed(() => ({
    ...route.query,
    months: route.query.months ?? getUserCurrentMonthString(),
  }))

  const { data, status } = await useFetch('/api/cities', {
    params,
    watch: [() => params.value],
    immediate: true,
  })
  </script>
  