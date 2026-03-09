<template>
  <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06]">
    <!-- Full-card shimmer (mimics the photo background) -->
    <div class="absolute inset-0 skeleton" />
    <!-- Bottom gradient to mimic the dark gradient overlay on real cards -->
    <div class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />
    <!-- Top-left: weather pill (icon + temperature) -->
    <div class="absolute top-3 left-3 h-7 w-[4.5rem] bg-white/[0.1] rounded-full" />
    <!-- Top-right: price pill -->
    <div class="absolute top-3 right-3 h-7 w-20 bg-white/[0.1] rounded-full" />
    <!-- Bottom content: city name, region, stats row -->
    <div class="absolute bottom-0 inset-x-0 p-4">
      <div class="h-4 bg-white/[0.1] rounded mb-1.5 w-3/4" />
      <div class="h-3 bg-white/[0.07] rounded mb-3 w-1/3" />
      <div class="h-3 bg-white/[0.07] rounded w-full" />
    </div>
  </div>
</template>
