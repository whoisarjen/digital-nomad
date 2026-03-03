<template>
  <div class="min-h-screen bg-[#060E1B] flex flex-col">
    <header class="px-4 h-14 flex items-center justify-center">
      <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5">
        <img
          src="/digital-nomad-logo.png"
          alt="Digital Nomad"
          class="h-8 w-8"
        />
        <span class="text-lg font-bold text-white">
          Digital<span class="text-primary-400">Nomad</span>
        </span>
      </NuxtLink>
    </header>
    <main class="flex-1 flex items-center justify-center px-4 pb-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
