<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-[#060E1B]"
  >
    <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <img
          src="/digital-nomad-logo.png"
          alt="Digital Nomad"
          class="h-8 w-8"
        />
        <span class="text-lg font-bold text-white">
          Digital<span class="text-primary-400">Nomad</span>
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="text-sm text-white/70 hover:text-white font-medium"
        >
          Explore Cities
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
