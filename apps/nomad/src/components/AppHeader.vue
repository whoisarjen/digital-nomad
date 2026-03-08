<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-[#060E1B]"
  >
    <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5">
        <img
          src="/digital-nomad-logo.png"
          alt="Digital Nomad"
          class="h-8 w-8"
        />
        <span class="hidden sm:inline text-lg font-bold text-white">
          Digital<span class="text-primary-400">Nomad</span>
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm text-white/70 hover:text-white font-medium transition-colors"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          v-if="isLoggedIn"
          :to="localePath('dashboard')"
          class="text-sm text-white/70 hover:text-white font-medium transition-colors"
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
        <LanguagePicker />
      </nav>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        :aria-label="mobileOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="sr-only">{{ mobileOpen ? 'Close' : 'Menu' }}</span>
        <span
          class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300"
          :class="mobileOpen ? 'rotate-45' : '-translate-y-1.5'"
        />
        <span
          class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300"
          :class="mobileOpen ? 'opacity-0 scale-x-0' : ''"
        />
        <span
          class="absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300"
          :class="mobileOpen ? '-rotate-45' : 'translate-y-1.5'"
        />
      </button>
    </div>

    <!-- Mobile overlay -->
    <Transition name="mobile-menu">
      <nav
        v-if="mobileOpen"
        class="lg:hidden fixed inset-0 top-14 bg-[#060E1B]/[0.98] backdrop-blur-sm overflow-y-auto"
      >
        <div class="max-w-screen-sm mx-auto px-6 py-6 flex flex-col gap-1">
          <NuxtLink
            v-for="(link, i) in navLinks"
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
            :style="{ animationDelay: `${navLinks.length * 50}ms` }"
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
            :style="{ animationDelay: `${(navLinks.length + 1) * 50}ms` }"
            @click="mobileOpen = false"
          >
            {{ $t('auth.signUp') }}
          </NuxtLink>

          <div
            class="mobile-nav-link flex items-center gap-3 px-4 py-3"
            :style="{ animationDelay: `${(navLinks.length + 2) * 50}ms` }"
          >
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

const navLinks = computed(() => [
  { to: localePath('index'), label: t('nav.exploreCities') },
  { to: localePath('regions'), label: t('nav.regions') },
  { to: localePath('countries'), label: t('nav.countries') },
  { to: localePath('best-cities'), label: t('nav.bestCities') },
  { to: localePath('compare'), label: t('nav.compare') },
  { to: localePath('blog'), label: t('nav.blog') },
  { to: localePath('tools-schengen-calculator'), label: t('schengen.toolsNav') },
])

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})
</script>

<style scoped>
.mobile-menu-enter-active {
  transition: opacity 0.2s ease;
}
.mobile-menu-leave-active {
  transition: opacity 0.15s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-nav-link {
  animation: slideIn 0.25s ease both;
}
</style>
