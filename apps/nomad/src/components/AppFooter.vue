<template>
  <footer class="bg-[#060E1B] border-t border-white/10">
    <div class="max-w-screen-2xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-6">
        <NuxtLink :to="localePath('index')" class="flex items-center gap-2 flex-shrink-0">
          <img src="/digital-nomad-logo.png" alt="Digital Nomad" class="h-6 w-6" />
          <span class="text-sm font-bold text-white">Digital<span class="text-primary-400">Nomad</span></span>
        </NuxtLink>
        <p class="text-xs text-white/30">&copy; {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}</p>
      </div>
      <div class="flex items-center gap-1">
        <CurrencyPicker direction="above" />
        <LanguagePicker direction="above" />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
