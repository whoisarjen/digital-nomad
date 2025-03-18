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
      <aside class="lg:col-span-1 rounded-2xl p-6">
        <h3 class="text-xl font-bold">Filters</h3>
        <template v-if="data">
          <div v-for="filterKey of Object.keys(data.filters ?? {})" :key="filterKey" class="mb-4">
            <label :for="filterKey" class="block text-sm font-medium text-gray-700">{{ upperFirst(filterKey) }}</label>
            <select :id="filterKey" class="w-full p-3 mt-2 border rounded-lg">
              <option value="">All {{ filterKey }}</option>
              <option v-for="option of data.filters[filterKey as keyof typeof data['filters']].options" :value="option">{{ option }}</option>
            </select>
          </div>
        </template>
      </aside>

      <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="city in data?.cities" :key="city.slug" class="bg-white shadow-xl rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl">
          <img :src="city.image" :alt="city.name" class="rounded-lg w-full object-cover">
          <div class="p-3 flex flex-col gap-3">
            <h3 class="text-xl font-semibold text-gray-900">{{ city.name }}, {{ city.country }}</h3>
            <p class="text-sm text-gray-600">Population: {{ city.population }}</p>
            <div class="flex justify-between text-sm">
              <span class="text-blue-500">☀️ {{ city.temperatureC }}°C</span>
              <span class="text-green-500">💰 ${{ city.costForNomadInUsd }}/mo</span>
              <span class="text-yellow-500">🌐 {{ city.internet.value }} Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import upperFirst from 'lodash/upperFirst';

const { data } = await useFetch('/api/cities')
</script>
