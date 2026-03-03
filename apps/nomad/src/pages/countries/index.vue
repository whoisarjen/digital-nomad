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
          <span class="text-sm text-primary-400">{{ $t('countryPage.allCountries') }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {{ $t('countryPage.allCountriesTitle') }}
        </h1>
        <p class="mt-3 text-lg text-white/40 max-w-xl">
          {{ $t('countryPage.allCountriesDesc', { count: data?.length ?? 0 }) }}
        </p>
      </div>
    </section>

    <!-- Country grid -->
    <section class="px-6 pb-16">
      <div class="max-w-screen-xl mx-auto">
        <!-- Skeleton -->
        <template v-if="status === 'pending' || !data">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div v-for="i in 20" :key="i" class="h-36 skeleton rounded-2xl" />
          </div>
        </template>

        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <NuxtLink
              v-for="country in data"
              :key="country.countrySlug"
              :to="localePath({ name: 'countries-countrySlug', params: { countrySlug: country.countrySlug } })"
              class="group flex flex-col gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl px-4 py-5 transition-all duration-200"
            >
              <span class="text-4xl leading-none">{{ countryFlag(country.countryCode) }}</span>
              <div class="mt-1">
                <p class="text-white font-semibold text-sm leading-tight">{{ country.country }}</p>
                <p class="text-white/40 text-xs mt-0.5">{{ $t('countryPage.cityCount', { count: country.cityCount }) }}</p>
              </div>
              <p v-if="country.avgCost" class="text-emerald-400 text-xs font-medium tabular-nums">
                ~${{ Math.round(country.avgCost) }}<span class="text-white/30 font-normal">/mo</span>
              </p>
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
    en: '/countries',
    pl: '/kraje',
  },
})

const { t } = useCustomI18n()
const localePath = useLocalePath()

const { data, status } = await useCountries()

const countryFlag = (code: string | null) => {
  if (!code) return '🌍'
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + 127397))
}

useHead({
  title: t('countryPage.allCountriesTitle') + ' | Digital Nomad',
  meta: [
    { name: 'description', content: t('countryPage.allCountriesDesc', { count: '' }) },
  ],
})
</script>
