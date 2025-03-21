<template>
    <div class="min-h-screen bg-gray-100 text-gray-900">
      <section class="bg-blue-600 text-white py-20 text-center flex flex-col justify-center min-h-[50vh]">
        <h1 class="text-5xl font-bold">Explore. Work. Live.</h1>
        <p class="mt-4 text-lg">Find the perfect city for your digital nomad lifestyle.</p>
        <div class="mt-6 flex justify-center">
          <SearchBar />
        </div>
      </section>

      <section class="p-6 flex flex-col gap-6">
        <section class="flex gap-2 justify-end">
          <SinglePicker
            name="orderBy"
            operation="equals"
            :options="ORDER_BY_OPTIONS"
            :customDefaultOption="ORDER_BY_OPTIONS[0]"
          />
          <SortPicker />
        </section>
    
        <section class="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <aside class="lg:col-span-1 rounded-2xl flex flex-col gap-3">
            <h3 class="text-xl font-bold">Filters</h3>
            <div
              @click="() => Object.keys(route.query).length && router.push({ query: {} })"
              class="px-4 py-2 rounded-xl border transition-all text-center text-sm text-white"
              :class="{
                'bg-red-600 hover:bg-red-700 cursor-pointer': Object.keys(route.query).length,
                'cursor-not-allowed opacity-50 bg-gray-400 hover:bg-gray-400': !Object.keys(route.query).length,
              }"
            >
              Clear filters
            </div>
            <MonthsPicker />
            <WeathersPicker />
            <template v-if="filters">
              <SinglePicker
                v-for="key of Object.keys(filters)"
                :key="key"
                :name="key"
                :operation="filters[key as keyof typeof filters].operation"
                :options="filters[key as keyof typeof filters].options"
                isLabel
              />
            </template>
          </aside>
    
          <div class="lg:col-span-5 flex flex-col gap-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <template v-if="status === 'pending'">
                <div v-for="city in 20" :key="city" class="bg-white rounded-xl transition-all transform">
                  <div class="h-64 bg-gray-300 rounded-t-lg animate-pulse" />
                </div>
                <div class="col-span-4">
                  <section
                    class="flex items-center justify-center mt-5 gap-1"
                  >
                    <div class="bg-gray-300 rounded-xl animate-pulse size-11"></div>

                    <div v-for="n in 5" :key="n" class="bg-gray-300 rounded-xl animate-pulse size-11" />

                    <div class="bg-gray-300 rounded-xl animate-pulse size-11"></div>
                  </section>
                </div>
              </template>
              <template v-else>
                <div
                  v-for="city in cities?.data"
                  :key="city.slug"
                  class="bg-white cursor-pointer rounded-xl overflow-hidden transition-all transform group"
                >
                  <div class="relative">
                    <NuxtImg
                      provider="unsplash"
                      :src="city.image?.url.replace('https://images.unsplash.com', '')"
                      :alt="city.name"
                      class="w-full h-48 object-cover rounded-t-xl transition-all transform group-hover:scale-105"
                      loading="lazy"
                      width="360"
                      quality="75"
                    />
                    <div v-if="city.image" class="text-xs absolute bottom-0 right-0 text-white bg-black py-1 px-2 rounded-tl-lg">
                      <NuxtLink target="_blank" :href="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ city.image.ownerName }}</NuxtLink> on <NuxtLink target="_blank" href="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
                    </div>
                  </div>
                  
                  <div class="p-4 flex flex-col gap-4">
                    <h3 class="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-500">
                      {{ city.name }}, {{ city.country }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      Population: {{ city.population }}
                    </p>

                    <div class="flex justify-between text-sm text-gray-500">
                      <span class="text-blue-500 flex items-center gap-1">
                        <WeatherIcon :weather-icon="city.weathersAverage[0]?.weatherIcon" />
                        {{ Number(city.temperature).toFixed(1) }}°C
                      </span>
                      <span class="text-green-500">💰 ${{ city.costForNomadInUsd }}/mo</span>
                      <span class="text-yellow-500">🌐 {{ city.internetSpeed }} Mbps</span>
                    </div>
                  </div>
                </div>
                <div class="col-span-4">
                  <Pagination :pages-count="cities?.pagesCount ?? 0" />
                </div>
              </template>
            </div>
          </div>
        </section>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { GetCitiesSchema } from '~/server/api/cities/index.get';
import { getUserCurrentMonthString, ORDER_BY_OPTIONS } from '~/shared/global.utils';

  const route = useRoute()
  const router = useRouter()

  const params = computed(() => ({
    ...route.query,
    months: route.query.months ?? getUserCurrentMonthString(),
  })) as Ref<Partial<GetCitiesSchema>>

  const { data: cities, status } = await useFetch('/api/cities', {
    params,
    watch: [() => params.value],
    immediate: true,
  })
  const { data: filters } = await useFetch('/api/cities/filters', {
    params,
    // watch: [() => params.value],
    immediate: true,
  })

  watch(() => params.value.page, () => {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  }, { immediate: true })
  </script>
  