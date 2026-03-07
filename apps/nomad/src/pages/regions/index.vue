<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- Hero -->
    <section class="relative pt-24 pb-12 px-6 overflow-hidden">
      <div
        class="absolute inset-0 opacity-40"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);"
      />
      <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />

      <div class="relative max-w-screen-xl mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-sm text-primary-400">{{ $t('nav.regions') }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('nav.regions') }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('regionPage.indexSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Bento grid -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <!-- Skeleton -->
        <template v-if="status === 'pending' || !data">
          <div class="grid grid-cols-12 gap-3 sm:gap-4 sm:grid-rows-[300px_240px_200px]">
            <div class="col-span-12 sm:col-span-5 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
            <div class="col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
            <div class="col-span-12 sm:col-span-3 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
            <div class="col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
            <div class="col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
            <div class="col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
            <div class="col-span-12 aspect-[4/3] sm:aspect-auto skeleton rounded-2xl" />
          </div>
        </template>

        <!-- Bento region grid -->
        <template v-else>
          <div class="grid grid-cols-12 gap-3 sm:gap-4 sm:grid-rows-[300px_240px_200px]">
            <NuxtLink
              v-for="(region, i) in data"
              :key="region.slug"
              :to="localePath({ name: 'regions-region', params: { region: region.slug } })"
              class="group relative rounded-2xl overflow-hidden block"
              :class="BENTO[i]?.cls ?? 'col-span-12 aspect-[4/3] sm:aspect-auto'"
            >
              <!-- Image -->
              <CustomNuxtImg
                v-if="region.imageUrl"
                :src="region.imageUrl"
                :alt="$t(`regions.${region.region}`)"
                width="800"
                height="600"
                sizes="lg:50vw 100vw"
                quality="75"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700" />

              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <!-- City count badge (top right) -->
              <div class="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-white/70">
                {{ $t('regionPage.cityCount', { count: region.cityCount }) }}
              </div>

              <!-- Content -->
              <div class="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h2 class="text-white font-bold text-xl leading-tight">
                  {{ $t(`regions.${region.region}`) }}
                </h2>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-white/50 text-sm">
                    {{ $t('regionPage.explore') }}
                  </span>
                  <div class="flex items-center justify-center size-8 rounded-full border border-white/20 text-white text-sm opacity-0 group-hover:opacity-100 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-200">
                    <LucideArrowRight :size="14" />
                  </div>
                </div>
              </div>

              <!-- Unsplash credit -->
              <UnsplashCredit
                v-if="region.imageOwnerName"
                :owner-name="region.imageOwnerName"
                :owner-username="region.imageOwnerUsername ?? ''"
              />
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

defineI18nRoute({
  paths: {
    en: '/regions',
    pl: '/regiony',
    es: '/regiones',
    de: '/regionen',
    pt: '/regioes',
    fr: '/regions',
    ko: '/regions',
    ar: '/regions',
    tr: '/bolgeler',
    ja: '/regions',
    it: '/regioni',
  },
})

const { t, locale } = useCustomI18n()
const localePath = useLocalePath()

// Bento grid config — ordered to match REGION_SLUGS order
// (europe, asia, latin-america, middle-east, north-america, africa, oceania)
// On mobile: full-width + 4/3 aspect-ratio stacked cards.
// On desktop (sm+): col-spans flow into grid-rows-[300px_240px_200px],
// so sm:aspect-auto lets the fixed row height control card height.
const BENTO = [
  { cls: 'col-span-12 sm:col-span-5 aspect-[4/3] sm:aspect-auto' },
  { cls: 'col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto' },
  { cls: 'col-span-12 sm:col-span-3 aspect-[4/3] sm:aspect-auto' },
  { cls: 'col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto' },
  { cls: 'col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto' },
  { cls: 'col-span-12 sm:col-span-4 aspect-[4/3] sm:aspect-auto' },
  { cls: 'col-span-12 aspect-[4/3] sm:aspect-auto' },
] as const

const { data, status } = await useCustomQuery(
  '/api/regions',
  undefined,
  undefined,
  undefined,
)

useSeoMeta({
  title: () => t('nav.regions'),
  description: () => t('regionPage.indexSubtitle'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: () => t('nav.regions') },
    ],
  }),
])
</script>
