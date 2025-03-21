<template>
    <div class="min-h-screen bg-gray-100 text-gray-900">
      <section class="bg-primary-600 text-white py-20 text-center flex flex-col justify-center min-h-[50vh]">
        <h1 class="text-5xl font-bold">Explore. Work. Live.</h1>
        <p class="mt-4 text-lg">Find the perfect city for your digital nomad lifestyle.</p>
        <div class="mt-6 flex justify-center">
          <SearchBar />
        </div>
      </section>

      <section class="p-6 flex flex-col gap-6">
        <section class="flex gap-6 justify-end flex-col md:flex-row items-center">
          <div
            v-if="isClearFilter"
            class="flex-1 text-sm flex gap-1 items-center"
          >
            <b>Filters:</b>
            <span>{{ Object.entries(params).map(([key, value]) =>
              `${key.split('_').map(upperFirst).join(' ')} (${key === 'months'
                ? new Date(2025, Number(value) - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase()
                : `${filters?.[key as keyof typeof filters]?.operation === 'lte' ? '≤' : ''}${value}`.toLowerCase().split(',').join(', ')}${filters?.[key as keyof typeof filters]?.operation === 'gte' ? '≤' : ''})`).join(', ') }}
              </span>
          </div>
          <div class="flex gap-1">
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
          <aside class="rounded-2xl flex flex-col gap-3 w-full max-w-[268px]">
            <h3 class="text-xl font-bold">Filters</h3>
            <div
              @click="() => isClearFilter && router.push({ query: {} })"
              class="px-4 py-2 rounded-xl border transition-all text-center text-sm text-white"
              :class="{
                'bg-red-600 hover:bg-red-700 cursor-pointer': isClearFilter,
                'cursor-not-allowed opacity-50 bg-gray-400 hover:bg-gray-400': !isClearFilter,
              }"
            >
              Clear filters
            </div>
            <MonthsPicker />
            <WeathersPicker />
            <RegionsPicker />
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
    
          <div class="flex flex-col gap-6 flex-1">
            <div class="gap-6 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <template v-if="status === 'pending'">
                <div v-for="city in 40" :key="city" class="bg-white rounded-xl transition-all transform">
                  <div class="h-64 bg-gray-300 rounded-t-lg animate-pulse" />
                </div>
              </template>
              <template v-else>
                <div
                  v-for="city in cities?.data"
                  :key="city.slug"
                  class="bg-white cursor-pointer rounded-xl overflow-hidden transition-all transform group hover:shadow-lg w-full"
                >
                  <div class="relative h-48 overflow-hidden">
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
                      <NuxtLink target="_blank" :to="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ city.image.ownerName }}</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
                    </div>
                  </div>
                  
                  <div class="p-4 flex flex-col gap-4">
                    <h3 class="text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary-500">
                      {{ city.name }}, {{ city.country }}
                    </h3>
                    <div class="text-sm text-gray-600 flex gap-1">
                      Pollution: {{ city.pollution }}
                      Safety: {{ city.safety }}
                      Population: {{ city.population }}
                    </div>

                    <div class="flex justify-between text-sm text-gray-500">
                      <span class="text-primary-500 flex items-center gap-1">
                        <WeatherIcon :weather-icon="city.weathersAverage[0]?.weatherIcon" />
                        {{ Number(city.temperature).toFixed(1) }}°C
                      </span>
                      <span class="text-green-500">💰 ${{ city.costForNomadInUsd }}/mo</span>
                      <span class="text-yellow-500">🌐 {{ city.internetSpeed }} Mbps</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
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
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import upperFirst from 'lodash/upperFirst';
import type { GetCitiesSchema } from '~/server/api/cities/index.get';
import { getUserCurrentMonthString, OPTIONS_ORDER_BY } from '~/shared/global.utils';

  const route = useRoute()
  const router = useRouter()

  const isClearFilter = computed(() => Object.keys(route.query).length)
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
  