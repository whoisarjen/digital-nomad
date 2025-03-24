<template>
  <template v-if="!data || status !== 'success'">
    <div class="relative aspect-video overflow-hidden bg-gray-200 animate-pulse">
      <div class="w-full aspect-video bg-gray-300 rounded-t-xl h-full"></div>
      <div class="absolute bottom-0 right-0 text-xs text-white bg-black py-1 px-2 rounded-tl-lg w-32"></div>
    </div>

    <div class="p-4 flex flex-col gap-4 flex-1">
      <h3 class="text-xl font-semibold text-gray-900 bg-gray-300 animate-pulse rounded w-2/3 h-6 mb-2"></h3>
      <div class="text-sm text-gray-600 bg-gray-300 animate-pulse rounded w-3/4 h-4 mb-2"></div>

      <div class="flex justify-between text-sm text-gray-500">
        <span class="bg-gray-300 animate-pulse rounded w-1/4 h-4"></span>
        <span class="bg-gray-300 animate-pulse rounded w-1/4 h-4"></span>
        <span class="bg-gray-300 animate-pulse rounded w-1/4 h-4"></span>
      </div>
    </div>
  </template>
  <template v-else>
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

    <div class="p-4 flex flex-col gap-4 flex-1">
      <h3 class="text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary-500">
        {{ data.name }}, {{ data.country }}
      </h3>
      <div class="text-sm text-gray-600 flex gap-1 flex-1">
        Pollution: {{ data.pollution }}
        Safety: {{ data.safety }}
        Population: {{ data.population }}
      </div>

      <div class="flex justify-between text-sm text-gray-500">
        <span class="text-primary-500 flex items-center gap-1">
          <!-- <WeatherIcon :weather-icon="data.weatherIcon" />
          {{ Number(data.temperature).toFixed(1) }}°C -->
        </span>
        <span class="text-green-500">💰 ${{ data.costForNomadInUsd }}/mo</span>
        <span class="text-yellow-500">🌐 {{ data.internetSpeed }} Mbps</span>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import type { InternalApi } from 'nitropack';

const router = useRouter()
const slug = computed(() => router.currentRoute.value.params.slug as string)

const { data, status } = await useFetch<InternalApi['/api/cities/:slug']['get']>(() => `/api/cities/${slug.value}`, {
  watch: [() => slug.value],
  immediate: true,
})
</script>
