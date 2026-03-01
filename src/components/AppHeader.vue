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

      <nav class="flex items-center gap-4">
        <NuxtLink
          :to="localePath('index')"
          class="text-sm text-white/70 hover:text-white font-medium"
        >
          {{ $t('nav.exploreCities') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('blog')"
          class="text-sm text-white/70 hover:text-white font-medium"
        >
          {{ $t('nav.blog') }}
        </NuxtLink>
        <NuxtLink
          v-if="isLoggedIn"
          :to="localePath('dashboard')"
          class="text-sm text-white/70 hover:text-white font-medium"
        >
          {{ $t('dashboard.title') }}
        </NuxtLink>
        <NuxtLink
          v-else
          :to="localePath('join')"
          class="text-sm bg-accent-500 hover:bg-accent-400 text-white font-medium px-4 py-1.5 rounded-lg"
        >
          {{ $t('auth.signUp') }}
        </NuxtLink>
        <LanguagePicker />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { status } = useAuth()
const isLoggedIn = computed(() => status.value === 'authenticated')
</script>
