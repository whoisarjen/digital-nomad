<template>
  <div class="min-h-screen bg-[#060E1B]">
    <!-- ─── Loading Skeleton ─── -->
    <template v-if="!data || status !== 'success'">
      <!-- Dark header skeleton -->
      <section class="pt-24 pb-20 px-6">
        <div class="max-w-screen-xl mx-auto flex flex-col gap-4">
          <!-- Breadcrumb: Home / Compare / City A vs City B -->
          <div class="flex items-center gap-3">
            <div class="h-3 skeleton w-20 rounded" />
            <div class="h-3 skeleton w-2 rounded" />
            <div class="h-3 skeleton w-16 rounded" />
            <div class="h-3 skeleton w-2 rounded" />
            <div class="h-3 skeleton w-40 rounded" />
          </div>
          <!-- H1: "City A vs City B" -->
          <div class="h-10 sm:h-12 md:h-14 skeleton w-3/4 rounded-lg" />
          <!-- Subtitle -->
          <div class="h-5 skeleton w-64 rounded" />
          <!-- 3 quick diff badges -->
          <div class="flex flex-wrap gap-2.5 mt-2">
            <div v-for="i in 3" :key="i" class="h-9 skeleton w-36 rounded-full" />
          </div>
        </div>
      </section>

      <!-- Light content skeleton -->
      <div class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10">
        <div class="max-w-screen-xl mx-auto px-6 py-12">

          <!-- Side-by-side hero images (aspect-16/9, overlaps dark zone) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-24 mb-10">
            <div class="aspect-[16/9] skeleton rounded-2xl" />
            <div class="aspect-[16/9] skeleton rounded-2xl" />
          </div>

          <!-- 6 metric cards: icon label + two city values -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 skeleton rounded-lg" />
                <div class="h-2.5 skeleton w-14 rounded" />
              </div>
              <div class="flex justify-between gap-1">
                <div class="flex-1 flex flex-col items-center gap-1.5">
                  <div class="h-6 skeleton w-10 rounded" />
                  <div class="h-2 skeleton w-8 rounded" />
                </div>
                <div class="flex-1 flex flex-col items-center gap-1.5">
                  <div class="h-6 skeleton w-10 rounded" />
                  <div class="h-2 skeleton w-8 rounded" />
                </div>
              </div>
            </div>
          </div>

          <!-- Auto-generated content (intro + cost + internet + safety + weather sections) -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-10">
            <div class="space-y-2 mb-6">
              <div class="h-4 skeleton w-full rounded" />
              <div class="h-4 skeleton w-full rounded" />
              <div class="h-4 skeleton w-3/4 rounded" />
            </div>
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 skeleton rounded-lg" />
                <div class="h-4 skeleton w-32 rounded" />
              </div>
              <div class="space-y-2">
                <div class="h-4 skeleton w-full rounded" />
                <div class="h-4 skeleton w-5/6 rounded" />
              </div>
            </div>
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 skeleton rounded-lg" />
                <div class="h-4 skeleton w-28 rounded" />
              </div>
              <div class="h-4 skeleton w-full rounded" />
            </div>
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 skeleton rounded-lg" />
                <div class="h-4 skeleton w-36 rounded" />
              </div>
              <div class="space-y-2">
                <div class="h-4 skeleton w-full rounded" />
                <div class="h-4 skeleton w-4/5 rounded" />
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 skeleton rounded-lg" />
                <div class="h-4 skeleton w-32 rounded" />
              </div>
              <div class="h-4 skeleton w-full rounded" />
            </div>
          </div>

          <!-- 4 detailed comparison tables (Cost, Internet, Environment, Quality) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 p-6">
              <div class="flex items-center gap-2.5 mb-5">
                <div class="size-8 skeleton rounded-xl" />
                <div class="h-4 skeleton w-36 rounded" />
              </div>
              <div class="flex justify-between items-center pb-2 mb-1 border-b border-gray-100">
                <div class="w-20" />
                <div class="h-3 skeleton flex-1 mx-2 rounded" />
                <div class="h-3 skeleton flex-1 rounded" />
              </div>
              <div
                v-for="j in (i % 2 === 0 ? 2 : 4)"
                :key="j"
                class="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0"
              >
                <div class="h-3.5 skeleton w-20 rounded" />
                <div class="h-3.5 skeleton flex-1 mx-2 rounded" />
                <div class="h-3.5 skeleton flex-1 rounded" />
              </div>
            </div>
          </div>

          <!-- Monthly weather comparison (12 rows) -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-10">
            <div class="flex items-center gap-2.5 mb-5">
              <div class="size-8 skeleton rounded-xl" />
              <div class="h-4 skeleton w-44 rounded" />
            </div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10" />
              <div class="h-3 skeleton flex-1 rounded" />
              <div class="h-3 skeleton flex-1 rounded" />
            </div>
            <div class="space-y-1.5">
              <div v-for="m in 12" :key="m" class="flex items-center gap-3">
                <div class="w-10 h-5 skeleton rounded" />
                <div class="flex-1 h-10 skeleton rounded-lg" />
                <div class="flex-1 h-10 skeleton rounded-lg" />
              </div>
            </div>
          </div>

          <!-- "Who should choose" (2 cards with bullet lists) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-100 p-6">
              <div class="h-5 skeleton w-3/4 rounded mb-4" />
              <div class="space-y-3">
                <div v-for="j in 4" :key="j" class="flex items-start gap-2.5">
                  <div class="size-4 skeleton rounded mt-0.5 flex-shrink-0" />
                  <div class="h-4 skeleton flex-1 rounded" />
                </div>
              </div>
            </div>
          </div>

          <!-- Overall verdict -->
          <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-10">
            <div class="flex items-center gap-2.5 mb-3">
              <div class="size-8 skeleton rounded-xl" />
              <div class="h-4 skeleton w-36 rounded" />
            </div>
            <div class="space-y-2">
              <div class="h-4 skeleton w-full rounded" />
              <div class="h-4 skeleton w-4/5 rounded" />
            </div>
          </div>

          <!-- Related comparisons -->
          <div class="mb-10">
            <div class="flex items-center justify-between mb-4">
              <div class="h-5 skeleton w-48 rounded" />
              <div class="h-4 skeleton w-24 rounded" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div v-for="i in 3" :key="i" class="h-14 skeleton rounded-2xl" />
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- ─── Loaded State ─── -->
    <template v-else>
      <!-- ─── Dark Header Zone ─── -->
      <section class="relative pt-24 pb-20 px-6 overflow-hidden">
        <div
          class="absolute inset-0 opacity-40"
          style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E&quot;);"
        />
        <div class="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.06] blur-[100px]" />
        <div class="absolute -bottom-[10%] -left-[15%] w-[30%] h-[30%] rounded-full bg-accent-500/[0.04] blur-[80px]" />

        <div class="relative max-w-screen-xl mx-auto">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-3 mb-6">
            <NuxtLink :to="localePath('index')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
              {{ $t('nav.exploreCities') }}
            </NuxtLink>
            <span class="text-white/20">/</span>
            <NuxtLink :to="localePath('compare')" class="text-sm text-white/40 hover:text-white/70 transition-colors">
              {{ $t('compare.title') }}
            </NuxtLink>
            <span class="text-white/20">/</span>
            <span class="text-sm text-primary-400 truncate max-w-[240px]">{{ data.cityA.name }} vs {{ data.cityB.name }}</span>
          </div>

          <!-- H1 -->
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.08] tracking-tight">
            {{ data.cityA.name }}
            <span class="text-white/30 mx-2 sm:mx-3 font-light">vs</span>
            {{ data.cityB.name }}
          </h1>

          <p class="text-lg text-white/50 mt-3">{{ $t('compare.subtitle') }}</p>

          <!-- Quick diff badges -->
          <div class="flex flex-wrap gap-2.5 mt-6">
            <!-- Cost diff -->
            <span
              v-if="costDiffLabel"
              class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70"
            >
              <LucideWallet :size="14" class="text-emerald-400" />
              {{ costDiffLabel }}
            </span>
            <!-- Speed diff -->
            <span
              v-if="speedDiffLabel"
              class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70"
            >
              <LucideWifi :size="14" class="text-cyan-400" />
              {{ speedDiffLabel }}
            </span>
            <!-- Safety -->
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/70">
              <LucideShieldCheck :size="14" class="text-blue-400" />
              {{ formatLevel(data.cityA.safety) }} / {{ formatLevel(data.cityB.safety) }}
            </span>
          </div>
        </div>
      </section>

      <!-- ─── Light Content Zone ─── -->
      <div class="bg-gray-50 rounded-t-[2rem] -mt-2 relative z-10">
        <div class="max-w-screen-xl mx-auto px-6 py-12">

          <!-- ─── Side-by-side Hero Images ─── -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-24 mb-10">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] group/img">
              <CustomNuxtImg
                v-if="imageA.url"
                :src="imageA.url"
                :alt="data.cityA.name"
                width="640"
                height="360"
                sizes="md:50vw 100vw"
                quality="75"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div class="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-md">{{ data.cityA.name }}</div>
              <UnsplashCredit :owner-name="imageA.ownerName" :owner-username="imageA.ownerUsername" position="bottom-right" />
            </div>
            <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] group/img">
              <CustomNuxtImg
                v-if="imageB.url"
                :src="imageB.url"
                :alt="data.cityB.name"
                width="640"
                height="360"
                sizes="md:50vw 100vw"
                quality="75"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div class="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-md">{{ data.cityB.name }}</div>
              <UnsplashCredit :owner-name="imageB.ownerName" :owner-username="imageB.ownerUsername" position="bottom-right" />
            </div>
          </div>

          <!-- ─── Key Metrics Comparison Strip ─── -->
          <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <!-- Nomad Cost -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <LucideWallet :size="14" class="text-emerald-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.nomadCost') }}</span>
              </div>
              <div class="flex items-end justify-between gap-1">
                <div class="text-center flex-1">
                  <p class="text-lg font-bold tabular-nums" :class="costWinner === 'cityA' ? 'text-emerald-600' : 'text-gray-400'">{{ formatCost(Number(data.cityA.costForNomadInUsd)) }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ data.cityA.name }}</p>
                </div>
                <div class="text-center flex-1">
                  <p class="text-lg font-bold tabular-nums" :class="costWinner === 'cityB' ? 'text-emerald-600' : 'text-gray-400'">{{ formatCost(Number(data.cityB.costForNomadInUsd)) }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ data.cityB.name }}</p>
                </div>
              </div>
            </div>

            <!-- Internet Speed -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <LucideWifi :size="14" class="text-cyan-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.internet') }}</span>
              </div>
              <div class="flex items-end justify-between gap-1">
                <div class="text-center flex-1">
                  <p class="text-lg font-bold tabular-nums" :class="speedWinner === 'cityA' ? 'text-cyan-600' : 'text-gray-400'">{{ data.cityA.internetSpeedCity }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Mbps</p>
                </div>
                <div class="text-center flex-1">
                  <p class="text-lg font-bold tabular-nums" :class="speedWinner === 'cityB' ? 'text-cyan-600' : 'text-gray-400'">{{ data.cityB.internetSpeedCity }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Mbps</p>
                </div>
              </div>
            </div>

            <!-- Safety -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <LucideShieldCheck :size="14" class="text-blue-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.safety') }}</span>
              </div>
              <div class="flex items-end justify-between gap-1">
                <div class="text-center flex-1">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" :class="getLevelDotClass(data.cityA.safety)" />
                    <p class="text-sm font-bold capitalize" :class="safetyWinner === 'cityA' ? getLevelTextClass(data.cityA.safety) : 'text-gray-400'">{{ formatLevel(data.cityA.safety) }}</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 truncate">{{ data.cityA.name }}</p>
                </div>
                <div class="text-center flex-1">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" :class="getLevelDotClass(data.cityB.safety)" />
                    <p class="text-sm font-bold capitalize" :class="safetyWinner === 'cityB' ? getLevelTextClass(data.cityB.safety) : 'text-gray-400'">{{ formatLevel(data.cityB.safety) }}</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 truncate">{{ data.cityB.name }}</p>
                </div>
              </div>
            </div>

            <!-- Air Quality -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <LucideLeaf :size="14" class="text-green-600" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.airQuality') }}</span>
              </div>
              <div class="flex items-end justify-between gap-1">
                <div class="text-center flex-1">
                  <p class="text-lg font-bold tabular-nums" :class="airWinner === 'cityA' ? getAirQualityClass(data.cityA.airQualityScore) : 'text-gray-400'">{{ data.cityA.airQualityScore }}<span class="text-xs font-normal text-gray-300">/5</span></p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ data.cityA.name }}</p>
                </div>
                <div class="text-center flex-1">
                  <p class="text-lg font-bold tabular-nums" :class="airWinner === 'cityB' ? getAirQualityClass(data.cityB.airQualityScore) : 'text-gray-400'">{{ data.cityB.airQualityScore }}<span class="text-xs font-normal text-gray-300">/5</span></p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ data.cityB.name }}</p>
                </div>
              </div>
            </div>

            <!-- Healthcare -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 rounded-lg bg-rose-50 flex items-center justify-center">
                  <LucideHeart :size="14" class="text-rose-500" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.healthcare') }}</span>
              </div>
              <div class="flex items-end justify-between gap-1">
                <div class="text-center flex-1">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" :class="getLevelDotClass(data.cityA.healthCare)" />
                    <p class="text-sm font-bold capitalize" :class="healthWinner === 'cityA' ? getLevelTextClass(data.cityA.healthCare) : 'text-gray-400'">{{ formatLevel(data.cityA.healthCare) }}</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 truncate">{{ data.cityA.name }}</p>
                </div>
                <div class="text-center flex-1">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" :class="getLevelDotClass(data.cityB.healthCare)" />
                    <p class="text-sm font-bold capitalize" :class="healthWinner === 'cityB' ? getLevelTextClass(data.cityB.healthCare) : 'text-gray-400'">{{ formatLevel(data.cityB.healthCare) }}</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 truncate">{{ data.cityB.name }}</p>
                </div>
              </div>
            </div>

            <!-- Population -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="size-7 rounded-lg bg-gray-50 flex items-center justify-center">
                  <LucideUsers :size="14" class="text-gray-500" />
                </div>
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{{ $t('city.population') }}</span>
              </div>
              <div class="flex items-end justify-between gap-1">
                <div class="text-center flex-1">
                  <p class="text-lg font-bold text-gray-900 tabular-nums">{{ formatNumber(data.cityA.population) }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ data.cityA.name }}</p>
                </div>
                <div class="text-center flex-1">
                  <p class="text-lg font-bold text-gray-900 tabular-nums">{{ formatNumber(data.cityB.population) }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ data.cityB.name }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── Auto-generated Content ─── -->
          <section class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-10">
            <!-- Intro -->
            <p v-if="contentSections.intro" class="text-gray-600 leading-relaxed text-[15px] mb-6">
              {{ $t(contentSections.intro.key, contentSections.intro.params) }}
            </p>

            <!-- Cost Section -->
            <div v-if="contentSections.cost.length" class="mb-6">
              <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
                <div class="size-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <LucideWallet :size="14" class="text-emerald-600" />
                </div>
                {{ $t('compare.costOfLiving') }}
              </h2>
              <div class="space-y-2">
                <p v-for="(section, i) in contentSections.cost" :key="i" class="text-gray-600 leading-relaxed text-[15px]">
                  {{ $t(section.key, section.params) }}
                </p>
              </div>
            </div>

            <!-- Internet Section -->
            <div v-if="contentSections.internet" class="mb-6">
              <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
                <div class="size-7 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <LucideWifi :size="14" class="text-cyan-600" />
                </div>
                {{ $t('compare.internetHeading') }}
              </h2>
              <p class="text-gray-600 leading-relaxed text-[15px]">
                {{ $t(contentSections.internet.key, contentSections.internet.params) }}
              </p>
            </div>

            <!-- Safety & Healthcare Section -->
            <div v-if="contentSections.safety || contentSections.healthcare" class="mb-6">
              <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
                <div class="size-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <LucideShieldCheck :size="14" class="text-blue-600" />
                </div>
                {{ $t('compare.qualityOfLife') }}
              </h2>
              <div class="space-y-2">
                <p v-if="contentSections.safety" class="text-gray-600 leading-relaxed text-[15px]">
                  {{ $t(contentSections.safety.key, contentSections.safety.params) }}
                </p>
                <p v-if="contentSections.healthcare" class="text-gray-600 leading-relaxed text-[15px]">
                  {{ $t(contentSections.healthcare.key, contentSections.healthcare.params) }}
                </p>
              </div>
            </div>

            <!-- Weather Section -->
            <div v-if="contentSections.weather" class="mb-0">
              <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
                <div class="size-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <LucideCloudSun :size="14" class="text-amber-600" />
                </div>
                {{ $t('compare.monthlyWeather') }}
              </h2>
              <p class="text-gray-600 leading-relaxed text-[15px]">
                {{ $t(contentSections.weather.key, contentSections.weather.params) }}
              </p>
            </div>
          </section>

          <!-- ─── Detailed Comparison Tables ─── -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <!-- Cost of Living -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <LucideWallet :size="16" class="text-emerald-600" />
                </div>
                {{ $t('compare.costOfLiving') }}
              </h2>
              <!-- Column headers -->
              <div class="flex justify-between items-center pb-2 mb-1 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide w-20" />
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityA.name }}</span>
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityB.name }}</span>
              </div>
              <div v-for="row in costRows" :key="row.label" class="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                <span class="text-sm text-gray-500 w-20">{{ row.label }}</span>
                <span class="text-sm font-semibold tabular-nums text-right flex-1" :class="row.winnerA ? 'text-emerald-600' : 'text-gray-700'">{{ formatCost(Number(row.valueA)) }}/mo</span>
                <span class="text-sm font-semibold tabular-nums text-right flex-1" :class="row.winnerB ? 'text-emerald-600' : 'text-gray-700'">{{ formatCost(Number(row.valueB)) }}/mo</span>
              </div>
            </section>

            <!-- Internet & Infrastructure -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <LucideWifi :size="16" class="text-cyan-600" />
                </div>
                {{ $t('compare.internetHeading') }}
              </h2>
              <div class="flex justify-between items-center pb-2 mb-1 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide w-24" />
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityA.name }}</span>
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityB.name }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.citySpeed') }}</span>
                <div class="flex items-center justify-end gap-1.5 flex-1">
                  <span class="text-sm font-semibold tabular-nums" :class="speedWinner === 'cityA' ? 'text-cyan-600' : 'text-gray-700'">{{ data.cityA.internetSpeedCity }} Mbps</span>
                  <span v-if="data.cityA.internetSpeedCityRanking" class="text-[10px] font-medium text-gray-400 bg-gray-50 rounded-full px-1.5 py-0.5 tabular-nums">#{{ data.cityA.internetSpeedCityRanking }}</span>
                </div>
                <div class="flex items-center justify-end gap-1.5 flex-1">
                  <span class="text-sm font-semibold tabular-nums" :class="speedWinner === 'cityB' ? 'text-cyan-600' : 'text-gray-700'">{{ data.cityB.internetSpeedCity }} Mbps</span>
                  <span v-if="data.cityB.internetSpeedCityRanking" class="text-[10px] font-medium text-gray-400 bg-gray-50 rounded-full px-1.5 py-0.5 tabular-nums">#{{ data.cityB.internetSpeedCityRanking }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-2.5">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.countrySpeed') }}</span>
                <span class="text-sm font-semibold text-gray-700 tabular-nums text-right flex-1">{{ data.cityA.internetSpeedCountry }} Mbps</span>
                <span class="text-sm font-semibold text-gray-700 tabular-nums text-right flex-1">{{ data.cityB.internetSpeedCountry }} Mbps</span>
              </div>
            </section>

            <!-- Environment & Health -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <LucideLeaf :size="16" class="text-green-600" />
                </div>
                {{ $t('compare.environmentHealth') }}
              </h2>
              <div class="flex justify-between items-center pb-2 mb-1 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide w-24" />
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityA.name }}</span>
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityB.name }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.airQualityScore') }}</span>
                <span class="text-sm font-semibold tabular-nums text-right flex-1" :class="airWinner === 'cityA' ? getAirQualityClass(data.cityA.airQualityScore) : 'text-gray-700'">{{ data.cityA.airQualityScore }}/5</span>
                <span class="text-sm font-semibold tabular-nums text-right flex-1" :class="airWinner === 'cityB' ? getAirQualityClass(data.cityB.airQualityScore) : 'text-gray-700'">{{ data.cityB.airQualityScore }}/5</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.pollution') }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityA.pollution, true)">{{ formatLevel(data.cityA.pollution) }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityB.pollution, true)">{{ formatLevel(data.cityB.pollution) }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.climate') }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityA.climate)">{{ formatLevel(data.cityA.climate) }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityB.climate)">{{ formatLevel(data.cityB.climate) }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.humidity') }}</span>
                <span class="text-sm font-semibold text-gray-700 text-right flex-1">{{ data.cityA.humidity }}</span>
                <span class="text-sm font-semibold text-gray-700 text-right flex-1">{{ data.cityB.humidity }}</span>
              </div>
            </section>

            <!-- Quality of Life -->
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <div class="size-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <LucideHeart :size="16" class="text-rose-500" />
                </div>
                {{ $t('compare.qualityOfLife') }}
              </h2>
              <div class="flex justify-between items-center pb-2 mb-1 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide w-24" />
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityA.name }}</span>
                <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-right flex-1 truncate">{{ data.cityB.name }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.safety') }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityA.safety)">{{ formatLevel(data.cityA.safety) }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityB.safety)">{{ formatLevel(data.cityB.safety) }}</span>
              </div>
              <div class="flex justify-between items-center py-2.5">
                <span class="text-sm text-gray-500 w-24">{{ $t('city.healthcare') }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityA.healthCare)">{{ formatLevel(data.cityA.healthCare) }}</span>
                <span class="text-sm font-semibold capitalize text-right flex-1" :class="getLevelTextClass(data.cityB.healthCare)">{{ formatLevel(data.cityB.healthCare) }}</span>
              </div>
            </section>
          </div>

          <!-- ─── Monthly Weather Comparison ─── -->
          <section class="bg-white rounded-2xl border border-gray-100 p-6 mb-10">
            <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
              <div class="size-8 rounded-xl bg-primary-50 flex items-center justify-center">
                <LucideCalendar :size="16" class="text-primary-600" />
              </div>
              {{ $t('compare.monthlyWeather') }}
            </h2>

            <!-- Column labels -->
            <div class="flex items-center gap-3 mb-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <div class="w-10" />
              <div class="flex-1 text-center">{{ data.cityA.name }}</div>
              <div class="flex-1 text-center">{{ data.cityB.name }}</div>
            </div>

            <div class="space-y-1.5">
              <div
                v-for="(pair, i) in weatherPairs"
                :key="i"
                class="flex items-center gap-3 rounded-xl py-2 px-2 transition-colors hover:bg-gray-50"
              >
                <!-- Month label -->
                <div class="w-10 text-[11px] font-semibold uppercase tracking-wide text-gray-500 text-center shrink-0">
                  {{ getMonthShort(pair.month) }}
                </div>

                <!-- City A weather -->
                <div
                  class="flex-1 flex items-center justify-between rounded-lg px-3 py-1.5 border"
                  :class="{
                    'bg-emerald-50/60 border-emerald-200': pair.levelA === 'HIGH',
                    'bg-amber-50/60 border-amber-200': pair.levelA === 'MIDDLE',
                    'bg-gray-50 border-gray-100': pair.levelA === 'LOW',
                  }"
                >
                  <div class="flex items-center gap-2">
                    <WeatherIcon :weather-icon="pair.iconA" />
                    <span class="text-sm font-bold text-gray-900 tabular-nums">{{ pair.tempA }}°</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-[10px] text-gray-400 tabular-nums">{{ pair.rainA }}mm</span>
                    <span
                      class="text-xs font-bold tabular-nums"
                      :class="{
                        'text-emerald-600': pair.levelA === 'HIGH',
                        'text-amber-600': pair.levelA === 'MIDDLE',
                        'text-gray-400': pair.levelA === 'LOW',
                      }"
                    >{{ pair.scoreA }}</span>
                  </div>
                </div>

                <!-- City B weather -->
                <div
                  class="flex-1 flex items-center justify-between rounded-lg px-3 py-1.5 border"
                  :class="{
                    'bg-emerald-50/60 border-emerald-200': pair.levelB === 'HIGH',
                    'bg-amber-50/60 border-amber-200': pair.levelB === 'MIDDLE',
                    'bg-gray-50 border-gray-100': pair.levelB === 'LOW',
                  }"
                >
                  <div class="flex items-center gap-2">
                    <WeatherIcon :weather-icon="pair.iconB" />
                    <span class="text-sm font-bold text-gray-900 tabular-nums">{{ pair.tempB }}°</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-[10px] text-gray-400 tabular-nums">{{ pair.rainB }}mm</span>
                    <span
                      class="text-xs font-bold tabular-nums"
                      :class="{
                        'text-emerald-600': pair.levelB === 'HIGH',
                        'text-amber-600': pair.levelB === 'MIDDLE',
                        'text-gray-400': pair.levelB === 'LOW',
                      }"
                    >{{ pair.scoreB }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── Who Should Choose ─── -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-4">
                {{ $t('compare.whoShouldChoose', { city: data.cityA.name }) }}
              </h2>
              <ul class="space-y-2.5">
                <li v-for="(bullet, i) in content.profileBulletsA" :key="i" class="flex items-start gap-2.5">
                  <LucideCheck :size="16" class="text-primary-500 mt-0.5 shrink-0" />
                  <span class="text-sm text-gray-600 leading-relaxed">{{ $t(bullet.key, bullet.params) }}</span>
                </li>
              </ul>
            </section>
            <section class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-base font-bold text-gray-900 mb-4">
                {{ $t('compare.whoShouldChoose', { city: data.cityB.name }) }}
              </h2>
              <ul class="space-y-2.5">
                <li v-for="(bullet, i) in content.profileBulletsB" :key="i" class="flex items-start gap-2.5">
                  <LucideCheck :size="16" class="text-primary-500 mt-0.5 shrink-0" />
                  <span class="text-sm text-gray-600 leading-relaxed">{{ $t(bullet.key, bullet.params) }}</span>
                </li>
              </ul>
            </section>
          </div>

          <!-- ─── Overall Verdict ─── -->
          <section
            class="rounded-2xl border p-6 md:p-8 mb-10"
            :class="{
              'bg-primary-50/50 border-primary-200': content.verdictWinner !== 'tied',
              'bg-white border-gray-100': content.verdictWinner === 'tied',
            }"
          >
            <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
              <div class="size-8 rounded-xl bg-primary-100 flex items-center justify-center">
                <LucideTrophy :size="16" class="text-primary-600" />
              </div>
              {{ $t('compare.overallVerdict') }}
            </h2>
            <p v-if="contentSections.verdict" class="text-gray-700 leading-relaxed text-[15px]">
              {{ $t(contentSections.verdict.key, contentSections.verdict.params) }}
            </p>
          </section>

          <!-- ─── Data Attribution ─── -->
          <p class="text-xs text-gray-400 mb-8">
            {{ $t('compare.dataAttribution') }}
          </p>

          <!-- ─── Related Comparisons ─── -->
          <section v-if="relatedData && relatedData.length" class="mb-10">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-bold text-gray-900">
                {{ $t('compare.relatedComparisons') }}
              </h2>
              <NuxtLink
                :to="localePath('compare')"
                class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {{ $t('compare.relatedComparisonsCta') }}
              </NuxtLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <NuxtLink
                v-for="pair in relatedData"
                :key="pair.slugs"
                :to="localePath({ name: 'compare-slugs', params: { slugs: pair.slugs } })"
                class="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-3 hover:border-primary-200 hover:shadow-sm transition-all group"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-sm font-semibold text-gray-900 truncate">{{ pair.cityAName }}</span>
                  <span class="text-xs text-gray-300 shrink-0">vs</span>
                  <span class="text-sm font-semibold text-gray-900 truncate">{{ pair.cityBName }}</span>
                </div>
                <LucideArrowRight :size="14" class="text-gray-300 group-hover:text-primary-500 transition-colors shrink-0" />
              </NuxtLink>
            </div>
          </section>

          <!-- ─── Navigation Links ─── -->
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4">
            <NuxtLink
              :to="localePath('compare')"
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary-600 transition-colors"
            >
              <LucideArrowLeft :size="14" />
              {{ $t('compare.title') }}
            </NuxtLink>
            <div class="flex items-center gap-4">
              <NuxtLink
                :to="localePath({ name: 'cities-slug', params: { slug: data.cityA.slug } })"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {{ data.cityA.name }}
                <LucideArrowRight :size="14" />
              </NuxtLink>
              <NuxtLink
                :to="localePath({ name: 'cities-slug', params: { slug: data.cityB.slug } })"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {{ data.cityB.name }}
                <LucideArrowRight :size="14" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Level } from '@prisma/client'
import { formatNumber, buildCompareSlug } from '~/shared/global.utils'
import { useCurrency } from '~/composables/useCurrency'

const { formatCost, rawConvert } = useCurrency()

defineI18nRoute({
  paths: {
    en: '/compare/[slugs]',
    pl: '/porownaj/[slugs]',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()
const route = useRoute()

// ─── Canonical redirect ───
const rawSlugs = computed(() => route.params.slugs as string)
const parts = rawSlugs.value.split('-vs-')
if (parts.length === 2) {
  const canonical = buildCompareSlug(parts[0]!, parts[1]!)
  if (canonical !== rawSlugs.value) {
    await navigateTo(localePath({ name: 'compare-slugs', params: { slugs: canonical } }), {
      redirectCode: 301,
      replace: true,
    })
  }
}

// ─── Data fetching ───
const slugsRef = ref(rawSlugs.value)

watch(rawSlugs, (val) => {
  if (val) slugsRef.value = val
})

const { data, status } = await useCompare(slugsRef, { lazy: true })

// ─── Related comparisons ───
const relatedSlug = ref(parts[0] ?? '')
const { data: relatedData } = await useCompareRelated(relatedSlug, { lazy: true })

// ─── Content engine ───
const content = computed(() => {
  if (!data.value) return { sections: [], profileBulletsA: [], profileBulletsB: [], verdictWinner: 'tied' as const }
  return useComparisonContent(data.value.cityA as any, data.value.cityB as any)
})

// Group sections by type for structured rendering
const contentSections = computed(() => {
  const s = content.value.sections
  return {
    intro: s.find(x => x.key.startsWith('compare.intro.')),
    cost: s.filter(x => x.key.startsWith('compare.cost.')),
    internet: s.find(x => x.key.startsWith('compare.internet.')),
    safety: s.find(x => x.key.startsWith('compare.safety.')),
    healthcare: s.find(x => x.key.startsWith('compare.healthcare.')),
    weather: s.find(x => x.key.startsWith('compare.weather.')),
    verdict: s.find(x => x.key.startsWith('compare.verdict.')),
  }
})

// ─── Winner helpers ───
const LEVEL_ORDER: Record<string, number> = { LOW: 0, MIDDLE: 1, HIGH: 2 }

const getWinner = (a: number | null, b: number | null, lowerIsBetter = false) => {
  if (!a || !b || a === b) return 'tie'
  if (lowerIsBetter) return a < b ? 'cityA' : 'cityB'
  return a > b ? 'cityA' : 'cityB'
}

const getLevelWinner = (a: Level | null, b: Level | null) => {
  if (!a || !b || a === b) return 'tie'
  return (LEVEL_ORDER[a] ?? 0) > (LEVEL_ORDER[b] ?? 0) ? 'cityA' : 'cityB'
}

const costWinner = computed(() => data.value ? getWinner(Number(data.value.cityA.costForNomadInUsd), Number(data.value.cityB.costForNomadInUsd), true) : 'tie')
const speedWinner = computed(() => data.value ? getWinner(data.value.cityA.internetSpeedCity, data.value.cityB.internetSpeedCity) : 'tie')
const safetyWinner = computed(() => data.value ? getLevelWinner(data.value.cityA.safety, data.value.cityB.safety) : 'tie')
const healthWinner = computed(() => data.value ? getLevelWinner(data.value.cityA.healthCare, data.value.cityB.healthCare) : 'tie')
const airWinner = computed(() => data.value ? getWinner(data.value.cityA.airQualityScore, data.value.cityB.airQualityScore) : 'tie')

// ─── Quick diff labels ───
const costDiffLabel = computed(() => {
  if (!data.value) return ''
  const a = Number(data.value.cityA.costForNomadInUsd ?? 0)
  const b = Number(data.value.cityB.costForNomadInUsd ?? 0)
  if (!a || !b) return ''
  const pct = Math.round(Math.abs(a - b) / Math.max(a, b) * 100)
  if (pct < 3) return ''
  const cheaper = a < b ? data.value.cityA.name : data.value.cityB.name
  return `${cheaper} ${pct}% ${t('compare.cheaper' as any) || 'cheaper'}`
})

const speedDiffLabel = computed(() => {
  if (!data.value) return ''
  const a = data.value.cityA.internetSpeedCity ?? 0
  const b = data.value.cityB.internetSpeedCity ?? 0
  if (!a || !b) return ''
  const diff = Math.abs(a - b)
  if (diff < 10) return ''
  const faster = a > b ? data.value.cityA.name : data.value.cityB.name
  return `${faster} +${diff} Mbps`
})


const defaultImage = { ownerName: '', ownerUsername: '', url: '' }
const imageA = computed(() => data.value?.cityA.image ?? defaultImage)
const imageB = computed(() => data.value?.cityB.image ?? defaultImage)

// ─── Cost comparison rows ───
const costRows = computed(() => {
  if (!data.value) return []
  const a = data.value.cityA
  const b = data.value.cityB
  return [
    { label: t('city.nomad'), valueA: a.costForNomadInUsd, valueB: b.costForNomadInUsd, winnerA: Number(a.costForNomadInUsd) < Number(b.costForNomadInUsd), winnerB: Number(b.costForNomadInUsd) < Number(a.costForNomadInUsd) },
    { label: t('city.expat'), valueA: a.costForExpatInUsd, valueB: b.costForExpatInUsd, winnerA: Number(a.costForExpatInUsd) < Number(b.costForExpatInUsd), winnerB: Number(b.costForExpatInUsd) < Number(a.costForExpatInUsd) },
    { label: t('city.local'), valueA: a.costForLocalInUsd, valueB: b.costForLocalInUsd, winnerA: Number(a.costForLocalInUsd) < Number(b.costForLocalInUsd), winnerB: Number(b.costForLocalInUsd) < Number(a.costForLocalInUsd) },
    { label: t('city.family'), valueA: a.costForFamilyInUsd, valueB: b.costForFamilyInUsd, winnerA: Number(a.costForFamilyInUsd) < Number(b.costForFamilyInUsd), winnerB: Number(b.costForFamilyInUsd) < Number(a.costForFamilyInUsd) },
  ]
})

// ─── Weather comparison ───
const getMedian = (arr: number[]) => {
  const sorted = arr.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
}

const getScoreLevel = (score: number, allScores: number[]) => {
  const low = getMedian(allScores)
  const middle = getMedian(allScores.filter(v => v >= low))
  if (score < low) return 'LOW'
  if (score < middle) return 'MIDDLE'
  return 'HIGH'
}

const weatherPairs = computed(() => {
  if (!data.value) return []
  const a = data.value.cityA.monthSummary
  const b = data.value.cityB.monthSummary
  const allScoresA = a.map(m => m.totalScore)
  const allScoresB = b.map(m => m.totalScore)

  return a.map((mA, i) => {
    const mB = b[i]
    return {
      month: mA.month,
      iconA: mA.weatherIcon,
      iconB: mB?.weatherIcon ?? 'NULL',
      tempA: Number(mA.apparentTemperatureMax).toFixed(0),
      tempB: mB ? Number(mB.apparentTemperatureMax).toFixed(0) : '-',
      rainA: Number(mA.rainSum).toFixed(0),
      rainB: mB ? Number(mB.rainSum).toFixed(0) : '-',
      scoreA: mA.totalScore,
      scoreB: mB?.totalScore ?? 0,
      levelA: getScoreLevel(mA.totalScore, allScoresA),
      levelB: mB ? getScoreLevel(mB.totalScore, allScoresB) : 'LOW',
    }
  })
})

// ─── Formatting helpers ───
const formatLevel = (level: Level | undefined | null) => {
  if (!level) return 'N/A'
  return t(`levels.${level.toLowerCase()}`)
}

const getLevelDotClass = (level: Level | undefined | null) => {
  if (!level) return 'bg-gray-400'
  if (level === 'HIGH') return 'bg-emerald-500'
  if (level === 'MIDDLE') return 'bg-yellow-500'
  return 'bg-red-500'
}

const getLevelTextClass = (level: Level | undefined | null, inverted = false) => {
  if (!level) return 'text-gray-500'
  const isGood = inverted ? level === 'LOW' : level === 'HIGH'
  const isMid = level === 'MIDDLE'
  if (isGood) return 'text-emerald-600'
  if (isMid) return 'text-yellow-600'
  return 'text-red-600'
}

const getAirQualityClass = (score: number | null) => {
  if (!score) return 'text-gray-500'
  if (score >= 4) return 'text-emerald-600'
  if (score >= 3) return 'text-yellow-600'
  return 'text-red-600'
}

const getMonthShort = (month: string) => {
  return new Date(2023, Number(month) - 1).toLocaleString(getLocaleBcp47(locale.value), { month: 'short' })
}

useHead(() => {
  if (!data.value) return {}
  const cityAName = data.value.cityA.name
  const cityBName = data.value.cityB.name
  const title = t('compare.metaTitle', { cityA: cityAName, cityB: cityBName })
  const description = t('compare.metaDesc', { cityA: cityAName, cityB: cityBName })

  const rawImageUrl = imageA.value.url
  const ogImage = rawImageUrl?.startsWith('https://')
    ? `${rawImageUrl}${rawImageUrl.includes('?') ? '&' : '?'}w=1200&h=630&fit=crop&auto=format&q=80`
    : undefined

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
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

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      'name': data.value.cityA.name,
      'url': `https://digitalnomad.guide/cities/${data.value.cityA.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      'name': data.value.cityB.name,
      'url': `https://digitalnomad.guide/cities/${data.value.cityB.slug}`,
    },
  ]
})
</script>
