<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#060E1B]">
    <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5 flex-shrink-0">
        <img src="/digital-nomad-logo.png" alt="Digital Nomad" class="h-8 w-8" />
        <span class="hidden sm:inline text-lg font-bold text-white">
          Digital<span class="text-primary-400">Nomad</span>
        </span>
      </NuxtLink>

      <!-- Desktop nav — mega groups -->
      <nav class="hidden lg:flex items-center gap-1 flex-1">
        <!-- Discover group -->
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
            {{ $t('nav.discover') }}
            <svg class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-64 bg-[#0d1b2e] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 -translate-y-1 group-hover:translate-y-0">
            <NuxtLink v-for="link in discoverLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm flex-shrink-0">{{ link.icon }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ link.label }}</div>
                <div class="text-xs text-white/40">{{ link.desc }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Rankings group -->
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
            {{ $t('nav.rankings') }}
            <svg class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-56 bg-[#0d1b2e] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 -translate-y-1 group-hover:translate-y-0">
            <NuxtLink v-for="link in rankingsLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm flex-shrink-0">{{ link.icon }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ link.label }}</div>
                <div class="text-xs text-white/40">{{ link.desc }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Tools group -->
        <div class="relative group">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
            {{ $t('nav.tools') }}
            <svg class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-72 bg-[#0d1b2e] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 -translate-y-1 group-hover:translate-y-0">
            <NuxtLink v-for="link in toolsLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-sm flex-shrink-0">{{ link.icon }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ link.label }}</div>
                <div class="text-xs text-white/40">{{ link.desc }}</div>
              </div>
            </NuxtLink>
            <div class="h-px bg-white/10 mx-2 my-1" />
            <NuxtLink :to="localePath('tools')" class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div class="text-xs font-medium text-white/50">{{ $t('nav.seeAllTools') }} &rarr;</div>
            </NuxtLink>
          </div>
        </div>

        <!-- Blog — standalone -->
        <NuxtLink :to="localePath('blog')" class="px-3 py-1.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/[0.06] transition-colors">
          {{ $t('nav.blog') }}
        </NuxtLink>
      </nav>

      <!-- Right actions -->
      <div class="hidden lg:flex items-center gap-2 flex-shrink-0">
        <!-- Search trigger -->
        <button
          class="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors"
          :class="searchOpen ? 'border-white/20 text-white bg-white/[0.04]' : ''"
          :aria-label="$t('search.placeholder')"
          @click="searchOpen = !searchOpen"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <CurrencyPicker />
        <LanguagePicker />

        <!-- Auth -->
        <NuxtLink
          v-if="isLoggedIn"
          :to="localePath('dashboard')"
          class="text-sm text-white/70 hover:text-white font-medium transition-colors px-3"
        >
          {{ $t('dashboard.title') }}
        </NuxtLink>
        <NuxtLink
          v-else
          :to="localePath('join')"
          class="text-sm bg-accent-500 hover:bg-accent-400 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          {{ $t('auth.signUp') }}
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        :aria-label="mobileOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="sr-only">{{ mobileOpen ? 'Close' : 'Menu' }}</span>
        <span class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300" :class="mobileOpen ? 'rotate-45' : '-translate-y-1.5'" />
        <span class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300" :class="mobileOpen ? 'opacity-0 scale-x-0' : ''" />
        <span class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300" :class="mobileOpen ? '-rotate-45' : 'translate-y-1.5'" />
      </button>
    </div>

    <!-- Search panel (desktop) -->
    <AppSearchPanel :open="searchOpen" @close="searchOpen = false" />

    <!-- Mobile overlay -->
    <Transition name="mobile-menu">
      <nav
        v-if="mobileOpen"
        class="lg:hidden fixed inset-0 top-14 bg-[#060E1B]/[0.98] backdrop-blur-sm overflow-y-auto"
      >
        <div class="max-w-screen-sm mx-auto px-6 py-6 flex flex-col gap-1">
          <!-- Mobile search -->
          <button
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200 mb-2"
            @click="mobileOpen = false; searchOpen = true"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span class="text-base font-medium">{{ $t('search.placeholder') }}</span>
          </button>

          <NuxtLink
            v-for="(link, i) in allMobileLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-nav-link group flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            :style="{ animationDelay: `${i * 50}ms` }"
            @click="mobileOpen = false"
          >
            <span class="w-1 h-1 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span class="text-base font-medium">{{ link.label }}</span>
          </NuxtLink>

          <NuxtLink
            v-if="isLoggedIn"
            :to="localePath('dashboard')"
            class="mobile-nav-link group flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            :style="{ animationDelay: `${allMobileLinks.length * 50}ms` }"
            @click="mobileOpen = false"
          >
            <span class="w-1 h-1 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span class="text-base font-medium">{{ $t('dashboard.title') }}</span>
          </NuxtLink>

          <div class="my-3 h-px bg-white/10" />

          <NuxtLink
            v-if="!isLoggedIn"
            :to="localePath('join')"
            class="mobile-nav-link flex items-center justify-center px-4 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold text-base transition-colors"
            @click="mobileOpen = false"
          >
            {{ $t('auth.signUp') }}
          </NuxtLink>

          <div class="mobile-nav-link flex items-center gap-3 px-4 py-3">
            <CurrencyPicker />
            <LanguagePicker />
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { status } = useAuth()
const isLoggedIn = computed(() => status.value === 'authenticated')
const mobileOpen = ref(false)
const searchOpen = ref(false)

const discoverLinks = computed(() => [
  { to: localePath('index'), icon: '\u{1F5FA}\uFE0F', label: t('nav.exploreCities'), desc: t('nav.exploreCitiesDesc') },
  { to: localePath('regions'), icon: '\u{1F310}', label: t('nav.regions'), desc: t('nav.regionsDesc') },
  { to: localePath('countries'), icon: '\u{1F3F3}\uFE0F', label: t('nav.countries'), desc: t('nav.countriesDesc') },
])

const rankingsLinks = computed(() => [
  { to: localePath('best-cities'), icon: '\u{1F3C6}', label: t('nav.bestCities'), desc: t('nav.bestCitiesDesc') },
  { to: '/safe-cities', icon: '\u{1F6E1}\uFE0F', label: t('nav.safeCities'), desc: t('nav.safeCitiesDesc') },
])

const toolsLinks = computed(() => [
  { to: localePath('compare'), icon: '\u2696\uFE0F', label: t('nav.compare'), desc: t('nav.compareDesc') },
  { to: localePath('tools-schengen-calculator'), icon: '\u{1F4C5}', label: t('tools.schengenName'), desc: t('nav.schengenNavDesc') },
  { to: localePath('tools-runway-calculator'), icon: '\u{1F4B0}', label: t('tools.runwayName'), desc: t('nav.runwayNavDesc') },
  { to: localePath('tools-day-in-the-life'), icon: '\u2615', label: t('tools.dayInLifeName'), desc: t('nav.dayInLifeNavDesc') },
  { to: localePath('tools-quiz'), icon: '\u{1F9ED}', label: t('quiz.title'), desc: t('nav.quizNavDesc') },
])

const allMobileLinks = computed(() => [
  ...discoverLinks.value,
  ...rankingsLinks.value,
  ...toolsLinks.value,
  { to: localePath('blog'), icon: '\u{1F4DD}', label: t('nav.blog'), desc: '' },
])

watch(() => route.fullPath, () => {
  mobileOpen.value = false
  searchOpen.value = false
})
</script>

<style scoped>
.mobile-menu-enter-active { transition: opacity 0.2s ease; }
.mobile-menu-leave-active { transition: opacity 0.15s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}
.mobile-nav-link { animation: slideIn 0.25s ease both; }
</style>
