<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1 pt-14">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
