<template>
  <section class="relative h-[40vh] min-h-[280px] flex flex-col justify-end text-white p-6 group overflow-hidden">
    <NuxtImg
      provider="cityImages"
      :src="image.url"
      :alt="cityName || 'City'"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div class="relative z-20 max-w-screen-2xl mx-auto w-full pb-4">
      <h1 v-if="cityName" class="text-4xl md:text-5xl font-bold drop-shadow-lg">
        {{ cityName }}
      </h1>
      <p v-if="country" class="mt-1 text-lg text-gray-200 drop-shadow">
        {{ country }}<span v-if="region"> · {{ region.replace(/([A-Z])/g, ' $1').trim() }}</span>
      </p>
    </div>
    <div class="absolute bottom-0 right-0 text-white bg-black/60 py-1 px-2 rounded-tl-lg text-xs z-10">
      <NuxtLink target="_blank" :to="`https://unsplash.com/@${image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`">{{ image?.ownerName }}</NuxtLink> on <NuxtLink target="_blank" to="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral">Unsplash</NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Image, Region } from '@prisma/client';

const props = defineProps<{
  image?: Pick<Image, 'ownerName' | 'ownerUsername' | 'url'> | undefined | null
  cityName?: string
  country?: string
  region?: Region
}>()
const image = computed(() => props.image ?? { ownerName: 'Tan Kaninthanond', ownerUsername: 'tankanin', url: '/photo-1535117399959-7df1714b4202?ixid=M3w3MjU5NzR8MHwxfHNlYXJjaHw1fHxCYW5na29rfGVufDB8fHx8MTc0MjYxMjM3Mnww&ixlib=rb-4.0.3&' })
</script>
