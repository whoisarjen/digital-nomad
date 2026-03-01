<template>
  <div class="bg-gray-100">
    <!-- ══════════════════════════════════════════ -->
    <!-- PART 1 — LANDING / MARKETING              -->
    <!-- ══════════════════════════════════════════ -->

    <!-- Hero + Features (continuous dark zone) -->
    <div class="bg-[#060E1B] text-white">

      <!-- Hero -->
      <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6">
        <!-- Animated gradient orbs -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-1/4 -left-[10%] w-[55%] h-[55%] rounded-full bg-primary-500/[0.07] blur-[120px] animate-float" />
          <div class="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full bg-accent-500/[0.05] blur-[100px] animate-float-reverse" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-cyan-400/[0.04] blur-[80px] animate-float-slow" />
        </div>

        <!-- Dot grid -->
        <div
          class="absolute inset-0 opacity-30"
          style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.035)'/%3E%3C/svg%3E&quot;);"
        />

        <!-- Content -->
        <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-7 py-12">
          <!-- Tagline pill -->
          <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400">
            <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {{ $t('landing.tagline') }}
          </div>

          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.08]">
            {{ $t('hero.titleLine1') }}<br />
            <span class="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
              {{ $t('hero.titleLine2') }}
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            {{ $t('hero.subtitle') }}
          </p>

          <!-- Feature badges -->
          <div class="flex flex-wrap justify-center gap-3">
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideWallet :size="15" class="text-emerald-400" />
              {{ $t('hero.badgeCost') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideThermometer :size="15" class="text-amber-400" />
              {{ $t('hero.badgeWeather') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideWifi :size="15" class="text-cyan-400" />
              {{ $t('hero.badgeInternet') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-gray-300">
              <LucideShieldCheck :size="15" class="text-emerald-400" />
              {{ $t('hero.badgeSafety') }}
            </span>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap justify-center gap-4">
            <a
              href="#explore"
              class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-accent-500/25"
            >
              {{ $t('hero.cta') }}
              <LucideChevronDown :size="18" />
            </a>
            <NuxtLink
              :to="localePath(isLoggedIn ? 'dashboard' : 'join')"
              class="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all"
            >
              {{ isLoggedIn ? $t('dashboard.title') : $t('landing.ctaJoin') }}
              <LucideArrowRight :size="18" />
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap justify-center gap-6 sm:gap-10 mt-2">
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold">500+</span>
              <span class="text-xs text-gray-500">{{ $t('landing.statCitiesLabel') }}</span>
            </div>
            <div class="hidden sm:block w-px h-12 bg-white/10" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold">12+</span>
              <span class="text-xs text-gray-500">{{ $t('landing.statDataLabel') }}</span>
            </div>
            <div class="hidden sm:block w-px h-12 bg-white/10" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold text-emerald-400">{{ $t('landing.free') }}</span>
              <span class="text-xs text-gray-500">{{ $t('landing.statAccessLabel') }}</span>
            </div>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce">
          <LucideChevronDown :size="22" />
        </div>
      </section>

      <!-- Features + Roadmap (combined) -->
      <section class="py-20 sm:py-28 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-14">
            <h2 class="text-3xl md:text-4xl font-bold mb-3">{{ $t('landing.featuresTitle') }}</h2>
            <p class="text-gray-400 max-w-xl mx-auto text-base">{{ $t('landing.featuresSubtitle') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Cost -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <LucideWallet :size="20" class="text-emerald-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureCostTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureCostDesc') }}</p>
            </div>
            <!-- Weather -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <LucideCloudSun :size="20" class="text-amber-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureWeatherTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureWeatherDesc') }}</p>
            </div>
            <!-- Internet -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <LucideWifi :size="20" class="text-cyan-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureInternetTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureInternetDesc') }}</p>
            </div>
            <!-- Safety -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <LucideShieldCheck :size="20" class="text-emerald-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureSafetyTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureSafetyDesc') }}</p>
            </div>
            <!-- 12+ Data Points -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
              <div class="size-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <LucideBarChart3 :size="20" class="text-primary-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureDataTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureDataDesc') }}</p>
            </div>
            <!-- Updated Monthly (soon) -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative">
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-accent-500/15 text-accent-400">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                <LucideCalendar :size="20" class="text-accent-400" />
              </div>
              <h3 class="font-semibold mb-1.5">{{ $t('landing.featureUpdatedTitle') }}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">{{ $t('landing.featureUpdatedDesc') }}</p>
            </div>
            <!-- Saved cities (new) -->
            <NuxtLink
              :to="localePath(isLoggedIn ? 'dashboard' : 'join')"
              class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative block"
            >
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400">{{ $t('landing.new') }}</span>
              <div class="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                <LucideHeart :size="20" class="text-rose-400" />
              </div>
              <h3 class="font-semibold mb-1.5">Saved cities</h3>
              <p class="text-sm text-gray-400 leading-relaxed">Save cities to your personal list for quick access</p>
            </NuxtLink>
            <!-- City comparison (soon) -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative">
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-accent-500/15 text-accent-400">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <LucideSparkles :size="20" class="text-gray-400" />
              </div>
              <h3 class="font-semibold mb-1.5">City vs City comparison</h3>
              <p class="text-sm text-gray-400 leading-relaxed">Compare two cities side by side across all metrics</p>
            </div>
            <!-- Monthly cost alerts (soon) -->
            <div class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] transition-colors relative">
              <span class="absolute top-4 right-4 text-[10px] font-semibold rounded-full px-2.5 py-0.5 bg-accent-500/15 text-accent-400">{{ $t('landing.soon') }}</span>
              <div class="size-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <LucideBell :size="20" class="text-gray-400" />
              </div>
              <h3 class="font-semibold mb-1.5">Monthly cost alerts</h3>
              <p class="text-sm text-gray-400 leading-relaxed">Get notified when cost of living changes in your saved cities</p>
            </div>
          </div>

          <!-- Join to vote -->
          <div v-if="!isLoggedIn" class="mt-8 text-center">
            <NuxtLink
              :to="localePath('join')"
              class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {{ $t('roadmap.joinToVote') }}
              <LucideArrowRight :size="14" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>

    <!-- Top Cities Showcase -->
    <section v-if="highlights?.topCities?.length" class="bg-gray-50 py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('landing.topCitiesTitle') }}</h2>
          <p class="text-gray-500">{{ $t('landing.topCitiesSubtitle') }}</p>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          <div
            v-for="city in highlights.topCities"
            :key="city.slug"
            class="relative flex-shrink-0 w-[220px] lg:w-auto aspect-[3/4] rounded-2xl overflow-hidden group"
          >
            <NuxtLink
              :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
              class="absolute inset-0 z-10"
            >
              <img
                v-if="city.imageUrl"
                :src="unsplashUrl(city.imageUrl, 440, 586)"
                :alt="city.name"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div v-else class="absolute inset-0 bg-gray-200" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-white font-semibold text-base leading-tight">{{ city.name }}</h3>
                <p class="text-white/60 text-sm">{{ city.country }}</p>
                <div class="flex items-center gap-3 mt-2 text-xs text-white/80">
                  <span class="flex items-center gap-1">
                    <LucideStar :size="11" class="text-amber-400 fill-amber-400" />
                    {{ city.totalScore }}
                  </span>
                  <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
                </div>
              </div>
            </NuxtLink>
            <!-- Photo credit -->
            <div v-if="city.imageOwnerName" class="absolute top-0 left-0 right-0 z-20 text-[10px] text-white/60 text-center py-1 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <a target="_blank" :href="`https://unsplash.com/@${city.imageOwnerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`" class="hover:text-white">{{ city.imageOwnerName }}</a> / <a target="_blank" href="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral" class="hover:text-white">Unsplash</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- PART 2 — APP FUNCTIONALITY                -->
    <!-- ══════════════════════════════════════════ -->

    <section class="bg-gray-100 px-6 pt-16 pb-10" id="explore">
      <!-- Section header -->
      <div class="text-center mb-10 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('landing.exploreAllTitle') }}</h2>
        <p class="text-gray-500">{{ $t('landing.exploreAllSubtitle') }}</p>
      </div>

      <div class="flex flex-col gap-6">
        <!-- Search + Sort -->
        <section class="flex gap-6 justify-end flex-col md:flex-row items-center">
          <div class="flex-1 bg-white">
            <SearchBar />
          </div>
          <div class="flex gap-1 max-md:w-full">
            <SinglePicker
              name="orderBy"
              operation="equals"
              :options="translatedOrderByOptions"
              :customDefaultOption="translatedOrderByOptions[0]"
            />
            <SortPicker />
          </div>
        </section>

        <!-- Filters + Cards -->
        <section class="flex max-md:flex-col gap-6 max-md:items-center">
          <aside class="rounded-2xl flex flex-col gap-3 w-full md:max-w-[268px]">
            <h3 class="text-xl font-bold">{{ $t('filters.title') }}</h3>
            <div
              @click="() => isClearFilter && router.push({ query: {} })"
              class="px-4 py-2 rounded-xl border text-center text-sm text-white"
              :class="{
                'bg-red-600 hover:bg-red-700 cursor-pointer': isClearFilter,
                'cursor-not-allowed opacity-50 bg-gray-400 hover:bg-gray-400': !isClearFilter,
              }"
            >
              {{ $t('filters.clear') }}
            </div>
            <!-- Favorites only toggle -->
            <AuthGate :message="$t('favorites.signInRequired')" position="bottom" align="left" v-slot="{ isLocked }">
              <button
                @click="toggleFavoritesFilter"
                :disabled="isLocked"
                class="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all"
                :class="isLocked
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  : isFavoritesFilterActive
                    ? 'bg-rose-50 border-rose-200 text-rose-700 cursor-pointer'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer'"
              >
                <span class="flex items-center gap-2">
                  <LucideHeart :size="14" :class="isFavoritesFilterActive && !isLocked ? 'text-rose-500 fill-rose-500' : ''" />
                  {{ $t('favorites.onlyFavorites') }}
                </span>
                <span
                  v-if="!isLocked"
                  class="size-4 rounded border flex items-center justify-center transition-colors"
                  :class="isFavoritesFilterActive ? 'bg-rose-500 border-rose-500' : 'border-gray-300'"
                >
                  <LucideCheck v-if="isFavoritesFilterActive" :size="10" class="text-white" />
                </span>
                <LucideLock v-else :size="12" class="text-gray-400" />
              </button>
            </AuthGate>

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
              <b>{{ $t('filters.filtersLabel') }}</b>
              <span>{{ Object.entries(queryParams).map(([key, value]) =>
                `${key.split('_').map(upperFirst).join(' ')} (${key === 'months'
                  ? new Date(2025, Number(value) - 1).toLocaleString(locale === 'pl' ? 'pl-PL' : 'en-US', { month: 'long' }).toLowerCase()
                  : `${filters?.pickers[key as keyof typeof filters['pickers']]?.operation === 'lte' ? '≤' : ''}${value}`.toLowerCase().split(',').join(', ').replace('gte:', '').replace('lte:', '')}${filters?.pickers[key as keyof typeof filters['pickers']]?.operation === 'gte' ? '≤' : ''})`).join(', ') }}
                </span>
            </div>

            <!-- Cards Grid -->
            <div class="gap-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <!-- Skeleton Loading -->
              <template v-if="status === 'pending'">
                <div v-for="city in 12" :key="city" class="aspect-[3/4] rounded-2xl skeleton" />
              </template>

              <!-- City Cards -->
              <template v-else>
                <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group" v-for="city in cities?.data" :key="city.slug">
                  <NuxtLink
                    :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
                    class="absolute inset-0 z-10"
                  >
                    <img
                      v-if="city.image?.url"
                      :src="unsplashUrl(city.image.url, 400, 530)"
                      :alt="city.name"
                      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <!-- Weather pill (top left) -->
                    <div class="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1 text-sm font-medium text-white">
                      <WeatherIcon :weather-icon="city.weatherIcon" />
                      <span>{{ Number(city.temperature).toFixed(0) }}&deg;</span>
                    </div>

                    <!-- Bottom info -->
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                      <h3 class="text-white font-semibold text-base leading-tight truncate">
                        {{ city.name }}, {{ city.country }}
                      </h3>
                      <span class="text-white/50 text-xs mt-0.5 block">
                        {{ city.region?.replace(/([A-Z])/g, ' $1').trim() }}
                      </span>
                      <div class="flex items-center gap-3 mt-2.5 text-xs text-white/70">
                        <div class="flex items-center gap-1.5">
                          <span
                            class="size-2 rounded-full flex-shrink-0"
                            :class="getSafetyDotColor(city.safety)"
                          />
                          <span>{{ formatSafetyLabel(city.safety) }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <LucideWifi :size="11" class="text-white/50" />
                          <span>{{ city.internetSpeedCity }} Mbps</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <LucideStar :size="11" class="text-amber-400 fill-amber-400" />
                          <span class="font-semibold text-white">{{ city.totalScore }}</span>
                        </div>
                      </div>
                    </div>
                  </NuxtLink>
                  <!-- Price + Favorite (top right, above link) -->
                  <div class="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <div class="bg-black/50 rounded-full px-2.5 py-1 text-sm font-semibold text-emerald-400 tabular-nums pointer-events-none">
                      ${{ city.costForNomadInUsd }}<span class="text-[11px] font-normal text-white/60">/mo</span>
                    </div>
                    <AuthContainer>
                      <FavoriteButton :city-slug="city.slug" />
                      <template #fallback>
                        <div class="size-9 rounded-full bg-white/10 animate-pulse" />
                      </template>
                    </AuthContainer>
                  </div>

                  <!-- Photo credit -->
                  <div v-if="city.image" class="absolute top-0 left-0 right-0 z-20 text-[10px] text-white/60 text-center py-1 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a target="_blank" :href="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`" class="hover:text-white">{{ city.image.ownerName }}</a> / <a target="_blank" href="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral" class="hover:text-white">Unsplash</a>
                  </div>
                </div>
              </template>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center">
              <section
                v-if="status === 'pending'"
                class="flex items-center justify-center mt-5 gap-1"
              >
                <div class="skeleton rounded-xl size-11"></div>
                <div v-for="n in 5" :key="n" class="skeleton rounded-xl size-11" />
                <div class="skeleton rounded-xl size-11"></div>
              </section>
              <Pagination v-else :pages-count="cities?.pagesCount ?? 0" />
            </div>
          </div>
        </section>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@prisma/client';
import upperFirst from 'lodash/upperFirst';
import type { GetCitiesSchema } from '~/shared/global.schema';
import { getUserCurrentMonthString, OPTIONS_ORDER_BY } from '~/shared/global.utils';

defineI18nRoute({
  paths: {
    en: '/',
    pl: '/',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()

const route = useRoute()
const router = useRouter()

const { status: authStatus } = useAuth()
const isLoggedIn = computed(() => authStatus.value === 'authenticated')

const unsplashUrl = (raw: string, w: number, h: number) => {
  if (!raw) return ''
  const sep = raw.includes('?') ? '&' : '?'
  return `${raw}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`
}

const hasFilters = computed(() => Object.keys(route.query).length > 0)

useHead({
  meta: computed(() => hasFilters.value ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
  script: [
    { src: 'https://beamback.whoisarjen.com/widget.js', 'data-api-key': 'ak_ED-ioa4wqla6_w1VdE6Hs', defer: true },
  ],
})

const translatedOrderByOptions = computed(() =>
  OPTIONS_ORDER_BY.map(opt => ({ ...opt, label: t(`orderBy.${opt.value}`) }))
)

const isClearFilter = computed(() => Object.keys(route.query).length)
const isFavoritesFilterActive = computed(() => route.query.favoritesOnly === 'true')

function toggleFavoritesFilter() {
  if (!isLoggedIn.value) return
  const query = { ...route.query }
  if (isFavoritesFilterActive.value) {
    delete query.favoritesOnly
  } else {
    query.favoritesOnly = 'true'
  }
  router.push({ query })
}
const queryParams = computed(() => ({
  ...route.query,
  months: route.query.months ?? getUserCurrentMonthString(),
})) as Ref<Partial<GetCitiesSchema>>

const { data: cities, status } = await useCities(queryParams)
const { data: filters } = await useCitiesFilters()
const { data: highlightsData } = await useLandingHighlights({ lazy: true })

const highlights = computed(() => highlightsData.value as any)

watch(() => queryParams.value.page, () => {
  window?.scrollTo({ top: 0 });
}, { immediate: true })

const getSafetyDotColor = (level: Level | undefined | null) => {
  if (!level) return 'bg-gray-300'
  if (level === 'HIGH') return 'bg-emerald-500'
  if (level === 'MIDDLE') return 'bg-amber-400'
  return 'bg-red-400'
}

const formatSafetyLabel = (level: Level | undefined | null) => {
  if (!level) return 'N/A'
  const labels: Record<string, string> = {
    HIGH: t('safety.safe'),
    MIDDLE: t('safety.moderate'),
    LOW: t('safety.caution'),
  }
  return labels[level] ?? level.toLowerCase()
}
</script>
