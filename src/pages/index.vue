<template>
    <div class="min-h-screen bg-gray-100 text-gray-900">
      <section class="relative min-h-[60vh] flex flex-col justify-center items-center text-center text-white p-6 bg-primary-900 overflow-hidden">
        <!-- <NuxtImg
          provider="unsplash"
          src="/photo-1535117399959-7df1714b4202?ixid=M3w3MjU5NzR8MHwxfHNlYXJjaHw1fHxCYW5na29rfGVufDB8fHx8MTc0MjYxMjM3Mnww&ixlib=rb-4.0.3&" 
          alt="Explore. Work. Live." 
          class="absolute inset-0 w-full h-full object-cover"
        /> -->
        <!-- Content -->
        <div class="relative z-20 py-12 max-w-4xl mx-auto">
          <!-- Your Picture -->
          <NuxtImg
            src="https://media.licdn.com/dms/image/v2/D4D03AQHHgPmY4SiQtw/profile-displayphoto-shrink_400_400/B4DZdAbYdqG8Ag-/0/1749132610996?e=1754524800&v=beta&t=Ux3U04ZNx5_25j16UXzK1KMFCH41LWp7rR1S-xt2MlE"
            alt="Your Name"
            class="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
          />
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Meet [Product Name]: Built for Digital Nomads
          </h1>
          <p class="text-lg md:text-xl text-gray-200 mb-6">
            Hi, I'm [Your Name]! I created [Product Name] to help you find the perfect city for your digital nomad lifestyle. Try it out and share your feedback to make it even better!
          </p>
          <div class="mt-6 flex justify-center gap-4">
            <a
              href="#"
              class="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Share Feedback
            </a>
            <a
              href="#app"
              class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
            >
              Explore the App
            </a>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 text-white bg-black py-1 px-2 rounded-tl-lg text-xs z-10">
          <NuxtLink target="_blank" to="https://unsplash.com/@tankanin?utm_source=Digital%20Nomad&utm_medium=referral">Tan Kaninthanond</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
        </div>
      </section>
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
              class="px-4 py-2 rounded-xl border transition-all duration-500 text-center text-sm text-white"
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
            <div class="gap-6 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <template v-if="status === 'pending'">
                <div v-for="city in 40" :key="city" class="bg-white rounded-xl transition-all duration-500 transform">
                  <div class="h-64 bg-gray-300 rounded-t-lg animate-pulse" />
                </div>
              </template>
              <template v-else>
                <div class="relative w-full flex" v-for="city in cities?.data" :key="city.slug">
                  <NuxtLink
                    :to="`/cities/${city.slug}`"
                    class="bg-white cursor-pointer rounded-xl overflow-hidden transition-all duration-500 transform group hover:shadow-lg w-full flex flex-col"
                  >
                    <div class="relative h-48 overflow-hidden">
                      <NuxtImg
                        provider="unsplash"
                        :src="city.image?.url.replace('https://images.unsplash.com', '')"
                        :alt="city.name"
                        class="w-full h-48 object-cover rounded-t-xl transition-all duration-500 transform group-hover:scale-105"
                        loading="lazy"
                        height="192"
                        quality="75"
                      />
                    </div>

                    <div class="p-4 flex flex-col gap-4 flex-1">
                      <h3 class="text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary-900">
                        {{ city.name }}, {{ city.country }} ({{ city.totalScore }})
                      </h3>
                      <div class="text-sm text-gray-600 flex gap-1 flex-1">
                        Pollution: {{ city.pollution }}
                        Safety: {{ city.safety }}
                        Population: {{ city.population }}
                      </div>

                      <div class="flex justify-between text-sm text-gray-500">
                        <span class="text-primary-900 flex items-center gap-1">
                          <WeatherIcon :weather-icon="city.weatherIcon" />
                          {{ Number(city.temperature).toFixed(1) }}°C
                        </span>
                        <span class="text-green-500">💰 ${{ city.costForNomadInUsd }}/mo</span>
                        <span class="text-yellow-500">🌐 {{ city.internetSpeedCity }} Mbps</span>
                      </div>
                    </div>
                  </NuxtLink>

                  <div v-if="city.image" class="absolute top-[168px] right-0 text-white bg-black py-1 px-2 rounded-tl-lg text-xs z-10">
                    <NuxtLink target="_blank" :to="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ city.image.ownerName }}</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
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
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  }, { immediate: true })
  </script>
  