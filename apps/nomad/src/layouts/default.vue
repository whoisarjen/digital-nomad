<template>
  <div class="flex min-h-screen flex-col">
    <!-- Ambient gradient: single teal horizon glow, fixed, brand-consistent -->
    <div
      class="fixed inset-0 pointer-events-none"
      style="z-index: 0;
        background:
          radial-gradient(ellipse 120% 35% at 50% 100%, rgba(34, 208, 183, 0.09) 0%, transparent 65%),
          radial-gradient(ellipse 60% 25% at 50% 100%, rgba(34, 208, 183, 0.06) 0%, transparent 50%);"
    />
    <div class="relative flex min-h-screen flex-col" style="z-index: 1;">
      <AppHeader />
      <main class="flex-1 pt-14">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>
