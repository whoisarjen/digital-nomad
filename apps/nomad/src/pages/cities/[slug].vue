<template>
  <div class="min-h-screen">
    <!-- Ambient background orbs (fixed, atmospheric) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[20%] right-[5%] w-[45%] h-[45%] rounded-full bg-primary-500/[0.06] blur-[130px]" />
      <div class="absolute top-[60%] -left-[10%] w-[35%] h-[35%] rounded-full bg-accent-500/[0.04] blur-[100px]" />
    </div>

    <!-- ─── Hero: Full-bleed image with overlay ─── -->
    <section class="relative h-[75vh] min-h-[560px] overflow-hidden">
      <!-- Background image -->
      <template v-if="data">
        <CustomNuxtImg
          v-if="heroImage.url"
          :src="heroImage.url"
          :alt="data.name"
          width="1600"
          height="900"
          quality="75"
          loading="eager"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div v-else class="absolute inset-0 bg-[#0a1628]" />
      </template>
      <div v-else class="absolute inset-0 bg-[#0a1628] animate-pulse" />

      <!-- Gradient overlays: bottom fade to page bg, slight left vignette -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#060E1B] via-[#060E1B]/50 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#060E1B]/50 to-transparent" />

      <!-- Dot grid texture -->
      <div
        class="absolute inset-0 opacity-20"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.035)'/%3E%3C/svg%3E&quot;);"
      />

      <!-- Top bar: breadcrumb + unsplash credit -->
      <div class="absolute top-0 inset-x-0 pt-24 px-6 z-10">
        <div class="max-w-screen-xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <template v-if="data">
              <NuxtLink
                :to="localePath('index')"
                class="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                {{ $t('nav.exploreCities') }}
              </NuxtLink>
              <span class="text-white/20">/</span>
              <span class="text-sm text-primary-400 truncate max-w-[240px]">{{ data.name }}</span>
            </template>
            <div v-else class="h-4 w-40 bg-white/10 animate-pulse rounded" />
          </div>
          <UnsplashCredit
            v-if="data && heroImage.url"
            :owner-name="heroImage.ownerName"
            :owner-username="heroImage.ownerUsername"
            position="top-right"
          />
        </div>
      </div>

      <!-- Bottom content: city name, meta, quick stats -->
      <div class="absolute bottom-0 inset-x-0 px-6 pb-10 z-10">
        <div class="max-w-screen-xl mx-auto">
          <!-- City name -->
          <h1
            v-if="data"
            class="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.04] tracking-tight mb-3 drop-shadow-2xl"
          >
            {{ data.name }}
          </h1>
          <div v-else class="h-16 w-2/3 bg-white/10 animate-pulse rounded-lg mb-3" />

          <!-- Country & region -->
          <div class="flex flex-wrap items-center gap-3 mb-5">
            <template v-if="data">
              <NuxtLink
                v-if="data.countrySlug"
                :to="localePath({ name: 'countries-countrySlug', params: { countrySlug: data.countrySlug } })"
                class="text-xl text-white/70 hover:text-white transition-colors font-medium"
              >
                {{ data.country }}
              </NuxtLink>
              <span v-else class="text-xl text-white/70 font-medium">{{ data.country }}</span>
              <span
                v-if="data.region"
                class="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/[0.15] rounded-full px-3 py-1 text-xs font-medium text-white/60"
              >
                <LucideGlobe :size="12" class="text-primary-400" />
                {{ data.region.replace(/([A-Z])/g, ' $1').trim() }}
              </span>
            </template>
            <template v-else>
              <div class="h-6 w-32 bg-white/10 animate-pulse rounded" />
            </template>
          </div>

          <!-- Quick stat badges — glassmorphism pill buttons -->
          <div class="flex flex-wrap gap-2.5">
            <template v-if="data">
              <span class="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/[0.14] rounded-xl px-4 py-2 text-sm">
                <LucideWallet :size="14" class="text-emerald-400" />
                <span class="font-semibold text-emerald-300">{{ formatCost(Number(data.costForNomadInUsd)) }}</span>
                <span class="text-white/40">/mo</span>
              </span>
              <span class="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/[0.14] rounded-xl px-4 py-2 text-sm">
                <LucideWifi :size="14" class="text-cyan-400" />
                <span class="font-semibold text-cyan-300">{{ data.internetSpeedCity }} Mbps</span>
              </span>
              <span class="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/[0.14] rounded-xl px-4 py-2 text-sm">
                <LucideShieldCheck :size="14" :class="getLevelBadgeIconClass(data.safety)" />
                <span class="font-semibold capitalize" :class="getLevelBadgeIconClass(data.safety)">{{ formatLevel(data.safety) }}</span>
              </span>
              <span class="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/[0.14] rounded-xl px-4 py-2 text-sm text-white/60">
                <LucideUsers :size="14" class="text-white/40" />
                {{ formatNumber(data.population) }}
              </span>
              <AuthContainer>
                <FavoriteButton :city-slug="citySlug" variant="inline" size="md" />
                <template #fallback>
                  <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/[0.14] rounded-xl px-4 py-2">
                    <div class="size-[18px] rounded-full bg-white/10 animate-pulse" />
                    <div class="h-4 w-10 rounded bg-white/10 animate-pulse" />
                  </div>
                </template>
              </AuthContainer>
            </template>
            <template v-else>
              <div v-for="i in 4" :key="i" class="h-9 w-28 bg-white/[0.06] border border-white/[0.08] animate-pulse rounded-xl" />
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Main Content ─── -->
    <div class="relative z-10 max-w-screen-xl mx-auto px-6 py-10">

      <!-- ─── Key Metrics Strip ─── -->
      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        <div class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.07] hover:border-emerald-500/30 hover:bg-white/[0.06] transition-all group">
          <template v-if="data">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <LucideWallet :size="14" class="text-emerald-400" />
              </div>
              <span class="text-[11px] font-medium text-white/30 uppercase tracking-wide">{{ $t('city.nomadCost') }}</span>
            </div>
            <p class="text-2xl font-bold text-white tabular-nums">
              {{ formatCost(Number(data.costForNomadInUsd)) }}<span class="text-sm font-normal text-white/30">/mo</span>
            </p>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 skeleton rounded-lg" />
              <div class="h-2.5 w-14 skeleton rounded" />
            </div>
            <div class="h-8 w-20 skeleton rounded" />
          </template>
        </div>

        <div class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.07] hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all group">
          <template v-if="data">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <LucideWifi :size="14" class="text-cyan-400" />
              </div>
              <span class="text-[11px] font-medium text-white/30 uppercase tracking-wide">{{ $t('city.internet') }}</span>
            </div>
            <p class="text-2xl font-bold text-white tabular-nums">
              {{ data.internetSpeedCity }}<span class="text-sm font-normal text-white/30"> Mbps</span>
            </p>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 skeleton rounded-lg" />
              <div class="h-2.5 w-14 skeleton rounded" />
            </div>
            <div class="h-8 w-20 skeleton rounded" />
          </template>
        </div>

        <div class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.07] hover:border-blue-500/30 hover:bg-white/[0.06] transition-all group">
          <template v-if="data">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <LucideShieldCheck :size="14" class="text-blue-400" />
              </div>
              <span class="text-[11px] font-medium text-white/30 uppercase tracking-wide">{{ $t('city.safety') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-2.5 rounded-full" :class="getLevelDotClass(data.safety)" />
              <p class="text-lg font-bold capitalize" :class="getLevelTextClass(data.safety)">{{ formatLevel(data.safety) }}</p>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 skeleton rounded-lg" />
              <div class="h-2.5 w-14 skeleton rounded" />
            </div>
            <div class="h-8 w-16 skeleton rounded" />
          </template>
        </div>

        <div class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.07] hover:border-green-500/30 hover:bg-white/[0.06] transition-all group">
          <template v-if="data">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <LucideLeaf :size="14" class="text-green-400" />
              </div>
              <span class="text-[11px] font-medium text-white/30 uppercase tracking-wide">{{ $t('city.airQuality') }}</span>
            </div>
            <p class="text-2xl font-bold tabular-nums" :class="getAirQualityClass(data.airQualityScore)">
              {{ data.airQualityScore }}<span class="text-sm font-normal text-white/30">/5</span>
            </p>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 skeleton rounded-lg" />
              <div class="h-2.5 w-14 skeleton rounded" />
            </div>
            <div class="h-8 w-16 skeleton rounded" />
          </template>
        </div>

        <div class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.07] hover:border-rose-500/30 hover:bg-white/[0.06] transition-all group">
          <template v-if="data">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                <LucideHeart :size="14" class="text-rose-400" />
              </div>
              <span class="text-[11px] font-medium text-white/30 uppercase tracking-wide">{{ $t('city.healthcare') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-2.5 rounded-full" :class="getLevelDotClass(data.healthCare)" />
              <p class="text-lg font-bold capitalize" :class="getLevelTextClass(data.healthCare)">{{ formatLevel(data.healthCare) }}</p>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 skeleton rounded-lg" />
              <div class="h-2.5 w-14 skeleton rounded" />
            </div>
            <div class="h-8 w-16 skeleton rounded" />
          </template>
        </div>

        <div class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] transition-all group">
          <template v-if="data">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                <LucideUsers :size="14" class="text-white/50" />
              </div>
              <span class="text-[11px] font-medium text-white/30 uppercase tracking-wide">{{ $t('city.population') }}</span>
            </div>
            <p class="text-2xl font-bold text-white tabular-nums">{{ formatNumber(data.population) }}</p>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 skeleton rounded-lg" />
              <div class="h-2.5 w-14 skeleton rounded" />
            </div>
            <div class="h-8 w-20 skeleton rounded" />
          </template>
        </div>
      </section>

      <!-- ─── Detail Sections ─── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <!-- Cost of Living -->
        <section class="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6">
          <h2 class="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <template v-if="data">
              <div class="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <LucideWallet :size="16" class="text-emerald-400" />
              </div>
              {{ $t('city.costOfLiving') }}
            </template>
            <template v-else>
              <div class="size-8 skeleton rounded-xl" />
              <div class="h-4 w-32 skeleton rounded" />
            </template>
          </h2>
          <div class="flex flex-col">
            <template v-if="data">
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.nomad') }}</span>
                <span class="text-sm font-semibold text-emerald-400 tabular-nums">{{ formatCost(Number(data.costForNomadInUsd)) }}/mo</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.expat') }}</span>
                <span class="text-sm font-semibold text-white/70 tabular-nums">{{ formatCost(Number(data.costForExpatInUsd)) }}/mo</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.local') }}</span>
                <span class="text-sm font-semibold text-white/70 tabular-nums">{{ formatCost(Number(data.costForLocalInUsd)) }}/mo</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-sm text-white/40">{{ $t('city.family') }}</span>
                <span class="text-sm font-semibold text-white/70 tabular-nums">{{ formatCost(Number(data.costForFamilyInUsd)) }}/mo</span>
              </div>
              <SalaryPurchasingPower
                :salary="data.averageMonthlyNetSalary !== null ? Number(data.averageMonthlyNetSalary) : null"
                :nomad-cost="data.costForNomadInUsd !== null ? Number(data.costForNomadInUsd) : null"
              />
            </template>
            <template v-else>
              <div v-for="i in 4" :key="i" class="flex justify-between items-center py-3" :class="{ 'border-b border-white/[0.06]': i < 4 }">
                <div class="h-3.5 w-20 skeleton rounded" />
                <div class="h-3.5 w-16 skeleton rounded" />
              </div>
            </template>
          </div>
        </section>

        <!-- Internet & Infrastructure -->
        <section class="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6">
          <h2 class="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <template v-if="data">
              <div class="size-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <LucideWifi :size="16" class="text-cyan-400" />
              </div>
              {{ $t('city.internetInfrastructure') }}
            </template>
            <template v-else>
              <div class="size-8 skeleton rounded-xl" />
              <div class="h-4 w-44 skeleton rounded" />
            </template>
          </h2>
          <div class="flex flex-col">
            <template v-if="data">
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.citySpeed') }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-cyan-400 tabular-nums">{{ data.internetSpeedCity }} Mbps</span>
                  <span v-if="data.internetSpeedCityRanking" class="text-[10px] font-medium text-white/30 bg-white/[0.06] rounded-full px-2 py-0.5 tabular-nums">#{{ data.internetSpeedCityRanking }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.countrySpeed') }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-white/70 tabular-nums">{{ data.internetSpeedCountry }} Mbps</span>
                  <span v-if="data.internetSpeedCountryRanking" class="text-[10px] font-medium text-white/30 bg-white/[0.06] rounded-full px-2 py-0.5 tabular-nums">#{{ data.internetSpeedCountryRanking }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.plugType') }}</span>
                <div class="flex items-center gap-1">
                  <template v-if="data.plugTypes">
                    <span
                      v-for="type in data.plugTypes.split(',')"
                      :key="type"
                      class="inline-flex items-center justify-center size-6 rounded-md bg-white/[0.08] border border-white/[0.12] text-xs font-bold text-white/60"
                    >{{ type.trim() }}</span>
                  </template>
                  <span v-else class="text-sm text-white/30">N/A</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.voltage') }}</span>
                <span
                  class="text-sm font-semibold tabular-nums"
                  :class="data.voltage && data.voltage < 200 ? 'text-amber-400' : 'text-white/70'"
                >{{ data.voltage ? `${data.voltage}V` : 'N/A' }}</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-sm text-white/40">{{ $t('city.frequency') }}</span>
                <span class="text-sm font-semibold text-white/70 tabular-nums">{{ data.frequency ? `${data.frequency} Hz` : 'N/A' }}</span>
              </div>
              <div v-if="electricityTip" class="flex items-start gap-2 pt-3 mt-1 border-t border-white/[0.06]">
                <LucideZap :size="14" class="text-amber-400 mt-0.5 shrink-0" />
                <p class="text-xs text-white/40 leading-relaxed">{{ electricityTip }}</p>
              </div>
            </template>
            <template v-else>
              <div v-for="i in 5" :key="i" class="flex justify-between items-center py-3" :class="{ 'border-b border-white/[0.06]': i < 5 }">
                <div class="h-3.5 w-24 skeleton rounded" />
                <div class="h-3.5 w-24 skeleton rounded" />
              </div>
            </template>
          </div>
        </section>

        <!-- Environment & Health -->
        <section class="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6">
          <h2 class="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <template v-if="data">
              <div class="size-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                <LucideLeaf :size="16" class="text-green-400" />
              </div>
              {{ $t('city.environmentHealth') }}
            </template>
            <template v-else>
              <div class="size-8 skeleton rounded-xl" />
              <div class="h-4 w-40 skeleton rounded" />
            </template>
          </h2>
          <div class="flex flex-col">
            <template v-if="data">
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.airQualityNow') }}</span>
                <span class="text-sm font-semibold text-white/70 tabular-nums">{{ data.airQualityNow }} AQI</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.airQualityScore') }}</span>
                <span class="text-sm font-semibold tabular-nums" :class="getAirQualityClass(data.airQualityScore)">{{ data.airQualityScore }}/5</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.humidity') }}</span>
                <span class="text-sm font-semibold text-white/70">{{ data.humidity }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.pollution') }}</span>
                <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.pollution, true)">{{ formatLevel(data.pollution) }}</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-sm text-white/40">{{ $t('city.climate') }}</span>
                <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.climate)">{{ formatLevel(data.climate) }}</span>
              </div>
            </template>
            <template v-else>
              <div v-for="i in 5" :key="i" class="flex justify-between items-center py-3" :class="{ 'border-b border-white/[0.06]': i < 5 }">
                <div class="h-3.5 w-28 skeleton rounded" />
                <div class="h-3.5 w-16 skeleton rounded" />
              </div>
            </template>
          </div>
        </section>

        <!-- Quality of Life -->
        <section class="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6">
          <h2 class="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <template v-if="data">
              <div class="size-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <LucideHeart :size="16" class="text-rose-400" />
              </div>
              {{ $t('city.qualityOfLife') }}
            </template>
            <template v-else>
              <div class="size-8 skeleton rounded-xl" />
              <div class="h-4 w-28 skeleton rounded" />
            </template>
          </h2>
          <div class="flex flex-col">
            <template v-if="data">
              <div class="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span class="text-sm text-white/40">{{ $t('city.safety') }}</span>
                <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.safety)">{{ formatLevel(data.safety) }}</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-sm text-white/40">{{ $t('city.healthcare') }}</span>
                <span class="text-sm font-semibold capitalize" :class="getLevelTextClass(data.healthCare)">{{ formatLevel(data.healthCare) }}</span>
              </div>
            </template>
            <template v-else>
              <div v-for="i in 2" :key="i" class="flex justify-between items-center py-3" :class="{ 'border-b border-white/[0.06]': i < 2 }">
                <div class="h-3.5 w-16 skeleton rounded" />
                <div class="h-3.5 w-16 skeleton rounded" />
              </div>
            </template>
          </div>
        </section>
      </div>

      <!-- ─── Affordability Calculator ─── -->
      <AffordabilityWidget
        v-if="data"
        :cost-nomad="Number(data.costForNomadInUsd)"
        :cost-expat="Number(data.costForExpatInUsd)"
        :cost-local="Number(data.costForLocalInUsd)"
        :cost-family="Number(data.costForFamilyInUsd)"
        class="mb-5"
      />

      <!-- ─── Granular Cost Breakdown ─── -->
      <CostBreakdown v-if="data" :prices="data" class="mb-10" />

      <!-- ─── Monthly Weather ─── -->
      <section class="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-6 mb-10">
        <h2 class="text-base font-bold text-white mb-5 flex items-center gap-2.5">
          <template v-if="data">
            <div class="size-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <LucideCalendar :size="16" class="text-primary-400" />
            </div>
            {{ $t('city.monthlyWeather') }}
          </template>
          <template v-else>
            <div class="size-8 skeleton rounded-xl" />
            <div class="h-4 w-36 skeleton rounded" />
          </template>
        </h2>
        <template v-if="data">
          <p v-if="bestMonthLabels" class="text-sm text-white/40 mb-4">
            <span class="font-medium text-emerald-400">{{ $t('city.bestMonths', { months: bestMonthLabels }) }}</span>
            <span class="mx-2 text-white/20">&middot;</span>
            <span class="font-medium text-red-400">{{ $t('city.avoidMonths', { months: avoidMonthLabels }) }}</span>
          </p>
        </template>
        <div v-else class="h-4 w-64 skeleton rounded mb-4" />
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          <template v-if="months">
            <div
              v-for="(monthData, index) in months"
              :key="index"
              class="flex flex-col items-center rounded-xl p-3 transition-all border"
              :class="{
                'bg-emerald-500/[0.08] border-emerald-500/20 hover:bg-emerald-500/[0.12]': monthData.totalScoreLevel === 'HIGH',
                'bg-amber-500/[0.08] border-amber-500/20 hover:bg-amber-500/[0.12]': monthData.totalScoreLevel === 'MIDDLE',
                'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]': monthData.totalScoreLevel === 'LOW',
              }"
            >
              <span
                class="text-[11px] font-semibold uppercase tracking-wide"
                :class="{
                  'text-emerald-400': monthData.totalScoreLevel === 'HIGH',
                  'text-amber-400': monthData.totalScoreLevel === 'MIDDLE',
                  'text-white/30': monthData.totalScoreLevel === 'LOW',
                }"
              >{{ getMonthShort(monthData.month) }}</span>
              <div class="my-2">
                <WeatherIcon :weather-icon="monthData.weatherIcon" />
              </div>
              <span class="text-lg font-bold text-white tabular-nums">{{ Number(monthData.apparentTemperatureMax).toFixed(0) }}&deg;</span>
              <div class="flex flex-col items-center mt-1.5 gap-0.5">
                <span class="text-[10px] text-white/30 tabular-nums">{{ Number(monthData.rainSum).toFixed(0) }}mm</span>
                <span class="text-[10px] text-white/30 tabular-nums">{{ Number(monthData.sunshineDuration).toFixed(0) }}h</span>
              </div>
              <span
                class="mt-1.5 text-xs font-bold tabular-nums"
                :class="{
                  'text-emerald-400': monthData.totalScoreLevel === 'HIGH',
                  'text-amber-400': monthData.totalScoreLevel === 'MIDDLE',
                  'text-white/30': monthData.totalScoreLevel === 'LOW',
                }"
              >{{ monthData.totalScore }}</span>
              <span
                v-if="bestMonthNumbers.has(monthData.month)"
                class="mt-1 text-[9px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5"
              >{{ $t('city.bestLabel') }}</span>
              <span
                v-else-if="avoidMonthNumbers.has(monthData.month)"
                class="mt-1 text-[9px] font-bold uppercase tracking-wide text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5"
              >{{ $t('city.avoidLabel') }}</span>
            </div>
          </template>
          <template v-else>
            <div v-for="i in 12" :key="i" class="flex flex-col items-center rounded-xl p-3 border border-white/[0.06] bg-white/[0.03]">
              <div class="h-3 w-6 skeleton rounded mb-2" />
              <div class="size-6 skeleton rounded-full my-2" />
              <div class="h-5 w-8 skeleton rounded" />
              <div class="flex flex-col items-center mt-1.5 gap-0.5">
                <div class="h-2.5 w-8 skeleton rounded" />
                <div class="h-2.5 w-6 skeleton rounded" />
              </div>
              <div class="h-3 w-6 skeleton rounded mt-1.5" />
            </div>
          </template>
        </div>
      </section>

      <!-- ─── Related Articles ─── -->
      <CityArticlesWidget :city-slug="citySlug" />

      <!-- ─── Compare CTA ─── -->
      <div class="mt-10">
        <template v-if="data">
          <p class="text-sm font-semibold text-white/50 mb-3 flex items-center gap-2">
            <LucideSparkles :size="14" class="text-primary-400" />
            {{ $t('compare.compareWith') }}
          </p>
          <div v-if="relatedComparisons && relatedComparisons.length" class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="pair in relatedComparisons.slice(0, 3)"
              :key="pair.slugs"
              :to="localePath({ name: 'compare-slugs', params: { slugs: pair.slugs } })"
              class="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.1] rounded-full px-4 py-1.5 text-sm font-medium text-white/50 hover:border-primary-500/40 hover:text-primary-400 transition-all"
            >
              {{ pair.cityAName }} vs {{ pair.cityBName }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('compare')"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-white/30 hover:text-primary-400 transition-colors px-2"
            >
              {{ $t('compare.relatedComparisonsCta') }}
              <LucideArrowRight :size="12" />
            </NuxtLink>
          </div>
          <NuxtLink
            v-else
            :to="localePath('compare')"
            class="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            {{ $t('compare.relatedComparisonsCta') }}
          </NuxtLink>
        </template>
        <div v-else class="h-4 w-32 skeleton rounded" />
      </div>

      <!-- ─── Back to Explore ─── -->
      <div class="mt-4 pb-12">
        <template v-if="data">
          <NuxtLink
            :to="localePath('index')"
            class="inline-flex items-center gap-2 text-sm font-medium text-white/30 hover:text-primary-400 transition-colors"
          >
            <LucideArrowLeft :size="14" />
            {{ $t('nav.exploreCities') }}
          </NuxtLink>
        </template>
        <div v-else class="h-4 w-28 skeleton rounded" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Level } from '@prisma/client';
import { formatNumber } from '~/shared/global.utils';
import { buildCityFaqItems } from '~/utils/cityFaq';
import { getLocaleBcp47 } from '~/utils/i18n-content';
import { getElectricityTip } from '~/utils/electricityTip'
import { useCurrency } from '~/composables/useCurrency'

const { formatCost, rawConvert } = useCurrency()

defineI18nRoute({
  paths: {
    en: '/cities/[slug]',
    pl: '/miasta/[slug]',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()

const citySlug = computed(() => route.params.slug as string)

const queryParams = ref({
  slug: route.params.slug as string,
})

watch(
  () => route.params.slug as string,
  (slug) => {
    if (slug) {
      queryParams.value.slug = slug
    }
  },
  { immediate: true }
)

const { data } = await useCitiesBySlug(queryParams, {
  lazy: true,
})

const { data: relatedComparisons } = await useCompareRelated(citySlug, { lazy: true })

const heroImage = computed(() => data.value?.image ?? {
  ownerName: 'Tan Kaninthanond',
  ownerUsername: 'tankanin',
  url: '/photo-1535117399959-7df1714b4202?ixid=M3w3MjU5NzR8MHwxfHNlYXJjaHw1fHxCYW5na29rfGVufDB8fHx8MTc0MjYxMjM3Mnww&ixlib=rb-4.0.3&',
})

const months = computed(() => {
  const getMedian = (arr: number[]) => {
    const sorted = arr.slice().sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    return sorted.length % 2 !== 0
      ? sorted[mid]!
      : (sorted[mid - 1]! + sorted[mid]!) / 2
  }

  const low = getMedian(data.value?.monthSummary.map((item) => item.totalScore) ?? [])
  const middle = getMedian(data.value?.monthSummary.map((item) => item.totalScore).filter(value => value >= low) ?? [])

  return data.value?.monthSummary.map((item) => {
    const totalScore = item.totalScore
    const totalScoreLevel =
      totalScore < low ? 'LOW' :
      totalScore < middle ? 'MIDDLE' :
      'HIGH'

    return { ...item, totalScoreLevel }
  })
})

const sortedByScore = computed(() =>
  [...(data.value?.monthSummary ?? [])].sort((a, b) => b.totalScore - a.totalScore)
)
const bestMonthNumbers = computed(() => new Set(sortedByScore.value.slice(0, 3).map(m => m.month)))
const avoidMonthNumbers = computed(() => new Set(sortedByScore.value.slice(-3).map(m => m.month)))

const getMonthShort = (month: string) => {
  return new Date(2023, Number(month) - 1).toLocaleString(getLocaleBcp47(locale.value), { month: 'short' })
}

const bestMonthLabels = computed(() => sortedByScore.value.slice(0, 3).map(m => getMonthShort(m.month)).join(', '))
const avoidMonthLabels = computed(() => sortedByScore.value.slice(-3).map(m => getMonthShort(m.month)).join(', '))

const formatLevel = (level: Level | undefined | null) => {
  if (!level) return 'N/A'
  return t(`levels.${level.toLowerCase()}`)
}

const getLevelDotClass = (level: Level | undefined | null) => {
  if (!level) return 'bg-white/30'
  if (level === 'HIGH') return 'bg-emerald-400'
  if (level === 'MIDDLE') return 'bg-yellow-400'
  return 'bg-red-400'
}

const getLevelTextClass = (level: Level | undefined | null, inverted = false) => {
  if (!level) return 'text-white/40'
  const isGood = inverted ? level === 'LOW' : level === 'HIGH'
  const isMid = level === 'MIDDLE'
  if (isGood) return 'text-emerald-400'
  if (isMid) return 'text-yellow-400'
  return 'text-red-400'
}

const getLevelBadgeIconClass = (level: Level | undefined | null) => {
  if (!level) return 'text-white/40'
  if (level === 'HIGH') return 'text-emerald-400'
  if (level === 'MIDDLE') return 'text-amber-400'
  return 'text-red-400'
}

const getAirQualityClass = (score: number) => {
  if (score >= 4) return 'text-emerald-400'
  if (score >= 3) return 'text-yellow-400'
  return 'text-red-400'
}

const electricityTip = computed(() =>
  data.value ? getElectricityTip(data.value.plugTypes ?? null, data.value.voltage ?? null) : null
)

useHead(() => {
  if (!data.value) return {}

  const { name, country, costForNomadInUsd, internetSpeedCity, safety } = data.value
  const title = `${name}, ${country} — Digital Nomad Guide`
  const description = `Live and work in ${name}. Nomad cost ${formatCost(Number(costForNomadInUsd))}/mo, ${internetSpeedCity} Mbps internet, ${formatLevel(safety)} safety rating.`

  const imageUrl = data.value.image?.url
  const ogImage = imageUrl?.startsWith('https://')
    ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}w=1200&h=630&fit=crop&auto=format&q=80`
    : undefined

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      ...(ogImage ? [
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
      ] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }
})

useSchemaOrg(() => {
  if (!data.value) return []

  const schemas: Record<string, unknown>[] = [
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: '/' },
        { name: 'Cities', item: '/cities' },
        { name: data.value.name },
      ],
    }),
    {
      '@type': 'Place',
      'name': data.value.name,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': data.value.name,
        'addressCountry': data.value.country,
      },
    },
  ]

  const faqItems = buildCityFaqItems(data.value, t, getLocaleBcp47(locale.value))
  if (faqItems.length > 0) {
    schemas.push({ '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': faqItems })
  }

  return schemas
})
</script>
