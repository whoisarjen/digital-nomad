<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <img
          src="/digital-nomad-logo.png"
          alt="Digital Nomad"
          class="h-10 w-10"
        />
        <span class="text-lg font-bold text-gray-900">
          Digital<span class="text-primary-600">Nomad</span>
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="text-sm text-gray-500 hover:text-gray-900 font-medium"
        >
          Explore Cities
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
