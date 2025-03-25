<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <section class="relative h-[50vh] flex flex-col justify-center text-center text-white p-6 group overflow-hidden">
      <NuxtImg
        provider="unsplash"
        :src="data?.image?.url" 
        alt="Explore. Work. Live." 
        class="absolute inset-0 w-full h-[50vh] object-cover transition-all duration-500 transform group-hover:scale-105"
      />
      <div class="absolute inset-0 z-10 bg-black size-full opacity-50" />
      <div class="relative py-20 z-20">
        <h1 class="text-5xl font-bold">Explore. Work. Live.</h1>
        <p class="mt-4 text-lg">Find the perfect city for your digital nomad lifestyle.</p>
        <div class="mt-6 flex justify-center">
          <SearchBar />
        </div>
      </div>
      <div class="absolute bottom-0 right-0 text-white bg-black py-1 px-2 rounded-tl-lg text-xs z-10">
        <NuxtLink target="_blank" :to="`https://unsplash.com/@${data?.image?.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ data?.image?.ownerName }}</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
      </div>
    </section>
    <section class="p-6 flex flex-col gap-6">
      <section class="flex max-md:flex-col gap-6 max-md:items-center">
        <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-xl border transition-all duration-500 text-center text-sm text-white bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            Main page
          </NuxtLink>
          <MonthsPicker />
        </aside>
        <CityPageMainContent class="flex-1" />
      </section>
    </section>
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
