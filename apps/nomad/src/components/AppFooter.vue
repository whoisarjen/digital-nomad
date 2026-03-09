<template>
  <footer class="bg-[#060E1B] border-t border-white/10">
    <div class="max-w-screen-2xl mx-auto px-6 py-10">
      <div class="flex flex-col gap-8">
        <!-- Top row: logo + nav -->
        <div class="flex flex-col sm:flex-row sm:items-start gap-8">
          <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/digital-nomad-logo.png"
              alt="Digital Nomad"
              class="h-7 w-7"
            />
            <span class="text-base font-bold text-white">
              Digital<span class="text-primary-400">Nomad</span>
            </span>
          </NuxtLink>

          <nav class="flex flex-wrap gap-x-6 gap-y-3">
            <NuxtLink
              :to="localePath('index')"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('footer.exploreCities') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('regions')"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('footer.regions') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('countries')"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('footer.countries') }}
            </NuxtLink>
            <NuxtLink
              to="/safe-cities"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('footer.safeCities') }}
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
              :to="localePath('tools-schengen-calculator')"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('schengen.toolsNav') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('tools-day-in-the-life')"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('tools.dayInLifeName') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('join')"
              class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {{ $t('footer.joinCommunity') }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Bottom row: copyright + pickers -->
        <div class="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p class="text-xs text-white/30">
            &copy; {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}
          </p>
          <div class="flex items-center gap-1">
            <CurrencyPicker direction="above" />
            <LanguagePicker direction="above" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
