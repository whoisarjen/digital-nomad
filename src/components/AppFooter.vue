<template>
  <footer class="bg-[#060E1B] border-t border-white/10">
    <div class="max-w-screen-2xl mx-auto px-6 py-10">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5">
          <img
            src="/digital-nomad-logo.png"
            alt="Digital Nomad"
            class="h-7 w-7"
          />
          <span class="text-base font-bold text-white">
            Digital<span class="text-primary-400">Nomad</span>
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-6">
          <NuxtLink
            :to="localePath('index')"
            class="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            {{ $t('footer.exploreCities') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('compare')"
            class="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            {{ $t('footer.compare') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('blog')"
            class="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            {{ $t('footer.blog') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('join')"
            class="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            {{ $t('footer.joinCommunity') }}
          </NuxtLink>
        </nav>
      </div>

      <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <p class="text-xs text-white/30">
          &copy; {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}
        </p>
        <LanguagePicker />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
