<template>
  <section class="relative h-[50vh] flex flex-col justify-center text-center text-white p-6 group overflow-hidden">
    <NuxtImg
      provider="unsplash"
      :src="props.image?.url" 
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
      <NuxtLink target="_blank" :to="`https://unsplash.com/@${props.image?.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ image?.ownerName }}</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Image } from '@prisma/client';

const props = defineProps<{ image: Pick<Image, 'ownerName' | 'ownerUsername' | 'url'> | undefined | null }>()
</script>
