<template>
  <div class="">
    <!-- ══════════════════════════════════════════ -->
    <!-- PART 1 — LANDING / MARKETING              -->
    <!-- ══════════════════════════════════════════ -->

    <!-- Hero + Features (continuous dark zone) -->
    <div class="text-white">

      <!-- Hero -->
      <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6">
        <!-- Animated gradient orbs -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-1/4 -left-[10%] w-[55%] h-[55%] rounded-full bg-primary-500/[0.07] blur-[120px] animate-float" />
          <div class="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full bg-accent-500/[0.05] blur-[100px] animate-float-reverse" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-cyan-400/[0.04] blur-[80px] animate-float-slow" />
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-7 py-12">
          <!-- Tagline pill -->
          <div class="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-white/50">
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
          <p class="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
            {{ $t('hero.subtitle') }}
          </p>

          <!-- Feature badges -->
          <div class="flex flex-wrap justify-center gap-3">
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/60">
              <LucideWallet :size="15" class="text-emerald-400" />
              {{ $t('hero.badgeCost') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/60">
              <LucideThermometer :size="15" class="text-amber-400" />
              {{ $t('hero.badgeWeather') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/60">
              <LucideWifi :size="15" class="text-cyan-400" />
              {{ $t('hero.badgeInternet') }}
            </span>
            <span class="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white/60">
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
              <span class="text-xs text-white/50">{{ $t('landing.statCitiesLabel') }}</span>
            </div>
            <div class="hidden sm:block w-px h-12 bg-white/10" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold">12+</span>
              <span class="text-xs text-white/50">{{ $t('landing.statDataLabel') }}</span>
            </div>
            <div class="hidden sm:block w-px h-12 bg-white/10" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-2xl sm:text-3xl font-bold text-emerald-400">{{ $t('landing.free') }}</span>
              <span class="text-xs text-white/50">{{ $t('landing.statAccessLabel') }}</span>
            </div>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <LucideChevronDown :size="22" />
        </div>
      </section>

      <!-- Features Bento Grid -->
      <section class="py-20 sm:py-28 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-14">
            <h2 class="text-3xl md:text-4xl font-bold mb-3">{{ $t('landing.featuresTitle') }}</h2>
            <p class="text-white/50 max-w-xl mx-auto text-base">{{ $t('landing.featuresSubtitle') }}</p>
          </div>

          <!-- Row 1: Quiz (2/3) + Compare (1/3) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

            <!-- 1. City Quiz — spans 2 cols -->
            <NuxtLink
              :to="localePath('tools-quiz')"
              class="group sm:col-span-2 relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300 bg-gradient-to-br from-amber-500/[0.09] via-amber-500/[0.03] to-transparent p-7 flex flex-col"
            >
              <div class="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <!-- top row -->
              <div class="flex items-start justify-between mb-6">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400/70">
                  <span class="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {{ $t('landing.categoryTool') }}
                </span>
                <div class="size-11 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <LucideSparkles :size="22" class="text-amber-400" />
                </div>
              </div>
              <!-- mock quiz preview -->
              <div class="mb-5 space-y-2.5">
                <div class="flex items-center gap-3">
                  <div class="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div class="h-full w-1/5 bg-amber-400/50 rounded-full" />
                  </div>
                  <span class="text-[11px] text-amber-400/60 font-medium tabular-nums flex-shrink-0">1 / 5</span>
                </div>
                <div class="rounded-xl bg-white/[0.05] border border-white/[0.07] px-4 py-3 text-sm text-white/50 leading-relaxed">
                  "What matters most — budget, weather, or internet speed?"
                </div>
              </div>
              <!-- footer -->
              <div class="mt-auto">
                <h3 class="font-bold text-lg text-white mb-1.5">{{ $t('landing.featureQuizTitle') }}</h3>
                <p class="text-sm text-white/50 leading-relaxed mb-4">{{ $t('landing.featureQuizDesc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                  {{ $t('landing.featureQuizCta') }}
                  <LucideArrowRight :size="14" class="transition-transform group-hover:translate-x-1 duration-200" />
                </span>
              </div>
            </NuxtLink>

            <!-- 2. Compare Cities — 1 col -->
            <NuxtLink
              :to="localePath('compare')"
              class="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-primary-500/30 transition-all duration-300 bg-gradient-to-br from-primary-500/[0.09] via-primary-500/[0.03] to-transparent p-7 flex flex-col"
            >
              <div class="absolute -bottom-12 -right-12 w-40 h-40 bg-primary-500/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div class="flex items-start justify-between mb-5">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-400/70">
                  <span class="size-1.5 rounded-full bg-primary-400" />
                  {{ $t('landing.categoryFeature') }}
                </span>
                <div class="size-11 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                  <LucideArrowLeftRight :size="22" class="text-primary-400" />
                </div>
              </div>
              <!-- A vs B preview -->
              <div class="mb-5 flex items-center gap-2">
                <span class="flex-1 text-center text-xs font-bold bg-white/[0.05] rounded-lg py-2.5 text-white/60 border border-white/[0.07]">Bangkok</span>
                <span class="text-[11px] font-black text-primary-400 flex-shrink-0">VS</span>
                <span class="flex-1 text-center text-xs font-bold bg-white/[0.05] rounded-lg py-2.5 text-white/60 border border-white/[0.07]">Lisbon</span>
              </div>
              <div class="mt-auto">
                <h3 class="font-bold text-base text-white mb-1.5">{{ $t('landing.featureCompareTitle') }}</h3>
                <p class="text-sm text-white/50 leading-relaxed mb-4">{{ $t('landing.featureCompareDesc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400">
                  {{ $t('landing.featureOpenCta') }}
                  <LucideArrowRight :size="14" class="transition-transform group-hover:translate-x-1 duration-200" />
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Row 2: Schengen + Runway + Day in Life -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

            <!-- 3. Schengen Calculator -->
            <NuxtLink
              :to="localePath('tools-schengen-calculator')"
              class="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-violet-500/30 transition-all duration-300 bg-gradient-to-br from-violet-500/[0.09] via-violet-500/[0.03] to-transparent p-6 flex flex-col"
            >
              <div class="absolute -top-10 -left-10 w-36 h-36 bg-violet-500/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div class="flex items-start justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
                  <span class="size-1.5 rounded-full bg-violet-400" />
                  {{ $t('landing.categoryTool') }}
                </span>
                <div class="size-10 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <LucideCalendarDays :size="19" class="text-violet-400" />
                </div>
              </div>
              <!-- days counter preview -->
              <div class="mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center justify-between">
                <span class="text-xs text-white/40">Days remaining</span>
                <span class="text-2xl font-black text-violet-300 tabular-nums">47</span>
              </div>
              <div class="mt-auto">
                <h3 class="font-bold text-base text-white mb-1">{{ $t('landing.featureSchengenTitle') }}</h3>
                <p class="text-sm text-white/50 leading-relaxed mb-3">{{ $t('landing.featureSchengenDesc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                  {{ $t('landing.featureOpenCta') }}
                  <LucideArrowRight :size="13" class="transition-transform group-hover:translate-x-1 duration-200" />
                </span>
              </div>
            </NuxtLink>

            <!-- 4. Runway Calculator -->
            <NuxtLink
              :to="localePath('tools-runway-calculator')"
              class="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 bg-gradient-to-br from-emerald-500/[0.09] via-emerald-500/[0.03] to-transparent p-6 flex flex-col"
            >
              <div class="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div class="flex items-start justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
                  <span class="size-1.5 rounded-full bg-emerald-400" />
                  {{ $t('landing.categoryTool') }}
                </span>
                <div class="size-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <LucidePiggyBank :size="19" class="text-emerald-400" />
                </div>
              </div>
              <!-- runway stat preview -->
              <div class="mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center justify-between">
                <div>
                  <div class="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">At $2,400/mo</div>
                  <div class="text-xl font-black text-emerald-300 tabular-nums">8 months</div>
                </div>
                <LucideTrendingUp :size="22" class="text-emerald-400/40" />
              </div>
              <div class="mt-auto">
                <h3 class="font-bold text-base text-white mb-1">{{ $t('landing.featureRunwayTitle') }}</h3>
                <p class="text-sm text-white/50 leading-relaxed mb-3">{{ $t('landing.featureRunwayDesc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  {{ $t('landing.featureOpenCta') }}
                  <LucideArrowRight :size="13" class="transition-transform group-hover:translate-x-1 duration-200" />
                </span>
              </div>
            </NuxtLink>

            <!-- 5. Day in the Life -->
            <NuxtLink
              :to="localePath('tools-day-in-the-life')"
              class="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300 bg-gradient-to-br from-orange-500/[0.09] via-orange-500/[0.03] to-transparent p-6 flex flex-col"
            >
              <div class="absolute -bottom-10 -left-10 w-36 h-36 bg-orange-500/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div class="flex items-start justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400/70">
                  <span class="size-1.5 rounded-full bg-orange-400" />
                  {{ $t('landing.categoryTool') }}
                </span>
                <div class="size-10 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                  <LucideSunrise :size="19" class="text-orange-400" />
                </div>
              </div>
              <!-- day items preview -->
              <div class="mb-4 flex items-center gap-2">
                <div class="flex-1 flex flex-col items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] py-2.5">
                  <LucideCoffee :size="14" class="text-orange-400/60" />
                  <span class="text-[9px] text-white/30 uppercase tracking-wide">Coffee</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] py-2.5">
                  <LucideMonitor :size="14" class="text-orange-400/60" />
                  <span class="text-[9px] text-white/30 uppercase tracking-wide">Cowork</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] py-2.5">
                  <LucideUtensilsCrossed :size="14" class="text-orange-400/60" />
                  <span class="text-[9px] text-white/30 uppercase tracking-wide">Meals</span>
                </div>
              </div>
              <div class="mt-auto">
                <h3 class="font-bold text-base text-white mb-1">{{ $t('landing.featureDayInLifeTitle') }}</h3>
                <p class="text-sm text-white/50 leading-relaxed mb-3">{{ $t('landing.featureDayInLifeDesc') }}</p>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                  {{ $t('landing.featureOpenCta') }}
                  <LucideArrowRight :size="13" class="transition-transform group-hover:translate-x-1 duration-200" />
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Row 3: Rankings — full width -->
          <NuxtLink
            :to="localePath('best-cities')"
            class="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-cyan-500/25 transition-all duration-300 bg-gradient-to-r from-cyan-500/[0.07] via-transparent to-primary-500/[0.05] p-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
          >
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_70%_50%,rgba(6,182,212,0.05),transparent_60%)]" />
            <!-- icon + label -->
            <div class="flex items-center gap-4 flex-shrink-0">
              <div class="size-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center">
                <LucideTrophy :size="26" class="text-cyan-400" />
              </div>
              <div>
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400/70 mb-1">
                  <span class="size-1.5 rounded-full bg-cyan-400" />
                  {{ $t('landing.categoryFeature') }}
                </span>
                <h3 class="font-bold text-lg text-white">{{ $t('landing.featureRankingsTitle') }}</h3>
              </div>
            </div>
            <!-- mini ranking preview -->
            <div class="flex-1 flex flex-wrap items-center gap-2">
              <div v-for="(city, i) in ['Bangkok', 'Chiang Mai', 'Lisbon', 'Tbilisi']" :key="city" class="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1.5">
                <span class="text-xs font-black text-cyan-400/60">#{{ i + 1 }}</span>
                <span class="text-xs text-white/60 font-medium">{{ city }}</span>
              </div>
              <span class="text-xs text-white/25">+ more</span>
            </div>
            <!-- desc + CTA -->
            <div class="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
              <p class="text-sm text-white/50 sm:text-right max-w-[200px]">{{ $t('landing.featureRankingsDesc') }}</p>
              <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 mt-1">
                {{ $t('landing.featureRankingsCta') }}
                <LucideArrowRight :size="14" class="transition-transform group-hover:translate-x-1 duration-200" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- PART 2 — APP FUNCTIONALITY                -->
    <!-- ══════════════════════════════════════════ -->

    <section class="px-6 pt-16 pb-10" id="explore">
      <!-- Section header -->
      <div class="text-center mb-10 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-white mb-2">{{ $t('landing.exploreAllTitle') }}</h2>
        <p class="text-white/50">{{ $t('landing.exploreAllSubtitle') }}</p>
      </div>

      <div class="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        <!-- Search + Sort + Filter trigger -->
        <section ref="toolbarRef" class="flex gap-1.5 flex-col md:flex-row items-center">
          <div class="flex-1 max-md:w-full">
            <SearchBar />
          </div>
          <div class="flex gap-2 max-md:w-full">
            <Tooltip :message="$t('tooltip.orderBy')">
              <SinglePicker
                name="orderBy"
                operation="equals"
                :options="translatedOrderByOptions"
                :customDefaultOption="translatedOrderByOptions[0]"
              />
            </Tooltip>
            <Tooltip :message="$t('tooltip.sort')">
              <SortPicker />
            </Tooltip>
            <Tooltip :message="$t('tooltip.filters')" align="right">
              <button
                @click="filtersOpen = true"
                class="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer max-md:flex-1"
                :class="activeFilterCount
                  ? 'bg-primary-500/[0.15] text-primary-300 border-primary-500/40 hover:bg-primary-500/[0.22]'
                  : 'bg-white/[0.06] text-white/70 border-white/[0.1] hover:bg-white/[0.09]'"
              >
                <LucideSlidersHorizontal :size="15" />
                <span>{{ $t('filters.title') }}</span>
                <span
                  class="min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 tabular-nums"
                  :class="activeFilterCount
                    ? 'bg-accent-500 text-white'
                    : 'invisible'"
                >
                  {{ activeFilterCount || '0' }}
                </span>
              </button>
            </Tooltip>
            <Tooltip :message="$t('tooltip.favorites')" :disabled="!isLoggedIn">
              <AuthGate :message="$t('favorites.signInRequired')" position="bottom" align="center" v-slot="{ isLocked }">
                <button
                  @click="toggleFavoritesFilter"
                  :disabled="isLocked"
                  class="px-4 py-2.5 flex items-center justify-center rounded-lg border transition-all duration-200"
                  :class="isLocked
                    ? 'bg-white/[0.03] border-white/[0.06] text-white/20 cursor-not-allowed'
                    : isFavoritesFilterActive
                      ? 'bg-rose-500/[0.15] border-rose-500/40 text-rose-400 hover:bg-rose-500/[0.22] cursor-pointer'
                      : 'bg-white/[0.06] border-white/[0.1] text-white/40 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/[0.08] cursor-pointer'"
                  :aria-label="$t('favorites.onlyFavorites')"
                >
                  <LucideHeart
                    :size="16"
                    :class="[
                      'transition-all duration-200',
                      isFavoritesFilterActive && !isLocked && 'fill-rose-500 scale-110',
                    ]"
                  />
                </button>
              </AuthGate>
            </Tooltip>
            <Tooltip :message="$t('tooltip.resetFilters')" align="right">
              <button
                @click="clearAllFilters"
                :disabled="!activeFilterCount"
                class="px-3 py-2.5 flex items-center justify-center rounded-lg border transition-colors"
                :class="activeFilterCount
                  ? 'bg-white/[0.06] border-white/[0.1] text-white/50 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/[0.08] cursor-pointer'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/20 cursor-not-allowed'"
                :aria-label="$t('tooltip.resetFilters')"
              >
                <LucideRotateCcw :size="15" />
              </button>
            </Tooltip>
          </div>
        </section>

        <!-- Active month indicator -->
        <div v-if="!isMonthDefault" class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 bg-primary-500/[0.12] border border-primary-500/30 text-primary-300 rounded-full px-3 py-1.5 text-sm font-medium">
            <LucideCalendar :size="13" />
            {{ $t('explore.showingForMonth', { month: activeMonthName }) }}
            <button @click="clearMonthFilter" class="ml-1 text-primary-400 hover:text-primary-700 cursor-pointer transition-colors">
              <LucideX :size="13" />
            </button>
          </div>
        </div>

        <!-- Cards + Pagination -->
            <!-- Cards Grid -->
            <div class="gap-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <!-- Skeleton Loading -->
              <template v-if="status === 'pending'">
                <CityCardSkeleton v-for="city in skeletonCount" :key="city" />
              </template>

              <!-- City Cards -->
              <template v-else>
                <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group" v-for="city in cities?.data" :key="city.slug">
                  <NuxtLink
                    :to="localePath({ name: 'cities-slug', params: { slug: city.slug } })"
                    class="absolute inset-0 z-10"
                  >
                    <CustomNuxtImg
                      v-if="city.image?.url"
                      :src="city.image.url"
                      :alt="city.name"
                      width="400"
                      height="530"
                      sizes="sm:50vw md:33vw lg:25vw xl:20vw 100vw"
                      quality="75"
                      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                          <LucideStar :size="11" class="text-amber-400 fill-amber-400" />
                          <span class="font-semibold text-white">{{ city.totalScore }}</span>
                        </div>
                        <!-- Budget delta inline after score -->
                        <Tooltip
                          :message="budget - Number(city.costForNomadInUsd) >= 0
                            ? `${formatCost(budget - Number(city.costForNomadInUsd))} left over from ${formatCost(budget)}`
                            : `${formatCost(Math.abs(budget - Number(city.costForNomadInUsd)))} over from ${formatCost(budget)}`"
                          position="top"
                          align="left"
                        >
                          <span
                            class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums cursor-default"
                            :class="budget - Number(city.costForNomadInUsd) >= 0 ? 'bg-emerald-500/60' : 'bg-red-500/60'"
                          >
                            <LucideThumbsUp v-if="budget - Number(city.costForNomadInUsd) >= 0" :size="9" />
                            <LucideThumbsDown v-else :size="9" />
                            {{ formatCost(Math.abs(budget - Number(city.costForNomadInUsd))) }}
                          </span>
                        </Tooltip>
                        <!-- Photo credit camera -->
                        <Tooltip
                          v-if="city.image"
                          :message="`Photo by ${city.image.ownerName} / Unsplash`"
                          position="top"
                          align="right"
                          class="ml-auto"
                        >
                          <a
                            :href="`https://unsplash.com/@${city.image.ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center text-white/40 hover:text-white/70 transition-colors"
                            @click.stop
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3">
                              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                              <circle cx="12" cy="13" r="3" />
                            </svg>
                          </a>
                        </Tooltip>
                      </div>
                    </div>
                  </NuxtLink>
                  <!-- Price + Favorite (top right, above link) -->
                  <div class="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <div class="bg-black/50 rounded-full px-2.5 py-1 text-sm font-semibold text-emerald-400 tabular-nums pointer-events-none">
                      {{ formatCost(Number(city.costForNomadInUsd)) }}<span class="text-[11px] font-normal text-white/60">/mo</span>
                    </div>
                    <AuthContainer>
                      <FavoriteButton :city-slug="city.slug" />
                      <template #fallback>
                        <div class="size-9 rounded-full bg-white/10 animate-pulse" />
                      </template>
                    </AuthContainer>
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

    <!-- Filters Drawer -->
    <FiltersDrawer
      v-model="filtersOpen"
      :pickers="filters?.pickers"
      :active-filter-count="activeFilterCount"
      :is-favorites-active="isFavoritesFilterActive"
      @toggle-favorites="toggleFavoritesFilter"
      @clear-filters="clearAllFilters"
    />

    <!-- Floating filter pill (appears when toolbar scrolls out of view) -->
    <Transition name="floating-pill">
      <div
        v-if="showFloatingFilter"
        class="fixed inset-x-0 z-50 flex justify-center pointer-events-none"
        style="bottom: max(1.5rem, calc(0.5rem + env(safe-area-inset-bottom, 0px)))"
      >
        <button
          @click="filtersOpen = true"
          class="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full text-white shadow-xl shadow-black/40 bg-[#0d1c34] border border-white/[0.12] hover:bg-[#112240] transition-colors cursor-pointer"
        >
          <LucideSlidersHorizontal :size="15" />
          <span class="text-sm font-medium">{{ $t('filters.title') }}</span>
          <span
            v-if="activeFilterCount"
            class="min-w-[18px] h-[18px] rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center px-1 tabular-nums"
          >
            {{ activeFilterCount }}
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@prisma/client';
import type { GetCitiesSchema } from '~/shared/global.schema';
import { DEFAULT_CITIES_LIMIT } from '~/shared/global.schema';
import { getUserCurrentMonthString, OPTIONS_ORDER_BY } from '~/shared/global.utils';
import { useCurrency } from '~/composables/useCurrency'

defineI18nRoute({
  paths: {
    en: '/',
    pl: '/',
  },
})

const { locale, t } = useCustomI18n()
const localePath = useLocalePath()
const { budget } = useBudget()
const { formatCost, rawConvert } = useCurrency()

const route = useRoute()
const router = useRouter()


const { status: authStatus } = useAuth()
const isLoggedIn = computed(() => authStatus.value === 'authenticated')


const hasFilters = computed(() => Object.keys(route.query).length > 0)

useSeoMeta({
  title: 'Find Your Next Nomad City',
  description: 'Compare 500+ cities by cost, weather, internet, safety & more. Find the perfect city for your digital nomad lifestyle.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  meta: computed(() => hasFilters.value ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home' },
    ],
  }),
])

const translatedOrderByOptions = computed(() =>
  OPTIONS_ORDER_BY.map(opt => ({ ...opt, label: t(`orderBy.${opt.value}`) }))
)

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

watch(() => queryParams.value.page, () => {
  window?.scrollTo({ top: 0 });
}, { immediate: true })

const getSafetyDotColor = (level: Level | undefined | null) => {
  if (!level) return 'bg-white/40'
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

// Filters drawer
const filtersOpen = ref(false)

const FILTER_EXCLUDE_PARAMS = ['page', 'q', 'orderBy', 'sort']
const activeFilterCount = computed(() =>
  Object.keys(route.query).filter(k => !FILTER_EXCLUDE_PARAMS.includes(k)).length
)

function clearAllFilters() {
  router.push({ query: {} })
}

const activeMonth = computed(() => (route.query.months as string) ?? getUserCurrentMonthString())
const activeMonthName = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'long' }).format(new Date(2024, parseInt(activeMonth.value) - 1, 1)))
const isMonthDefault = computed(() => !route.query.months)

function clearMonthFilter() {
  const query = { ...route.query }
  delete query.months
  router.push({ query })
}

// Floating filter pill — appears only when toolbar has scrolled above the viewport
const toolbarRef = ref<HTMLElement | null>(null)
const isToolbarAboveViewport = ref(false)

onMounted(() => {
  if (!toolbarRef.value) return
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry) return
    if (!entry.isIntersecting) {
      isToolbarAboveViewport.value = entry.boundingClientRect.bottom < 0
    } else {
      isToolbarAboveViewport.value = false
    }
  })
  observer.observe(toolbarRef.value)
  onUnmounted(() => observer.disconnect())
})

const showFloatingFilter = computed(() =>
  isToolbarAboveViewport.value && !filtersOpen.value
)

const skeletonCount = computed(() => Number(route.query.limit) || DEFAULT_CITIES_LIMIT)
</script>

