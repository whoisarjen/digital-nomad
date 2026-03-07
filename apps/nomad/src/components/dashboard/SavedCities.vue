<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-gray-900">{{ $t('dashboard.savedCities') }}</h3>
      <span v-if="count > 0" class="text-sm text-gray-400">
        {{ $t('dashboard.savedCount', { count }) }}
      </span>
    </div>

    <template v-if="status === 'pending'">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="n in 3" :key="n" class="rounded-xl border border-gray-100 overflow-hidden">
          <div class="aspect-[16/10] bg-gray-100 animate-pulse" />
          <div class="p-3">
            <div class="h-3.5 w-20 bg-gray-100 rounded animate-pulse mb-1.5" />
            <div class="h-3 w-14 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="!favorites?.length">
      <div class="py-10 flex flex-col items-center text-center">
        <div class="size-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <LucideHeart :size="22" class="text-gray-300" />
        </div>
        <p class="text-sm text-gray-400 mb-4">{{ $t('dashboard.noSavedCities') }}</p>
        <NuxtLink
          :to="localePath('index')"
          class="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {{ $t('dashboard.exploreCTA') }}
          <LucideArrowRight :size="14" />
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
          v-for="city in favorites"
          :key="city.slug"
          class="group relative rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
        >
          <NuxtLink
            :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
            class="block"
          >
            <div class="relative aspect-[16/10] bg-gray-100 overflow-hidden">
              <CustomNuxtImg
                v-if="city.image?.url"
                :src="city.image.url"
                :alt="city.name"
                width="280"
                height="175"
                quality="75"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-if="city.totalScore" class="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 text-[11px] font-semibold text-white">
                <LucideStar :size="10" class="text-amber-400 fill-amber-400" />
                {{ city.totalScore }}
              </div>
              <UnsplashCredit v-if="city.image?.ownerName" :owner-name="city.image.ownerName" :owner-username="city.image.ownerUsername" position="bottom-right" />
            </div>
            <div class="p-3">
              <h4 class="text-sm font-semibold text-gray-900 leading-tight truncate">{{ city.name }}</h4>
              <div class="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span class="truncate">{{ city.country }}</span>
                <span v-if="city.costForNomadInUsd" class="text-emerald-600 font-medium tabular-nums">${{ city.costForNomadInUsd }}</span>
              </div>
            </div>
          </NuxtLink>
          <button
            @click.stop.prevent="handleUnfavorite(city.slug)"
            class="absolute top-1.5 right-1.5 size-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/50"
            :aria-label="$t('favorites.save')"
          >
            <LucideHeart :size="13" class="text-rose-500 fill-rose-500" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { t } = useCustomI18n()
const localePath = useLocalePath()
const { toggleFavorite } = useFavoriteSlugs()

const query = ref({ page: 1, limit: 50 })
const { data: favoritesData, status } = await useFavorites(query, { lazy: true })

const favorites = computed(() => (favoritesData.value as any)?.data ?? [])
const count = computed(() => (favoritesData.value as any)?.count ?? 0)

async function handleUnfavorite(slug: string) {
  await toggleFavorite(slug)
}
</script>
