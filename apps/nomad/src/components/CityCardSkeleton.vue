<template>
  <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200/60">
    <!-- Full-card shimmer (mimics the photo background) -->
    <div class="absolute inset-0 skeleton" />
    <!-- Bottom gradient to mimic the dark gradient overlay on real cards -->
    <div class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-gray-300/50 to-transparent" />
    <!-- Top-left: weather pill (icon + temperature) -->
    <div class="absolute top-3 left-3 h-7 w-[4.5rem] bg-gray-300/90 rounded-full" />
    <!-- Top-right: price pill -->
    <div class="absolute top-3 right-3 h-7 w-20 bg-gray-300/90 rounded-full" />
    <!-- Bottom content: city name, region, stats row -->
    <div class="absolute bottom-0 inset-x-0 p-4">
      <div class="h-4 bg-gray-300/80 rounded mb-1.5 w-3/4" />
      <div class="h-3 bg-gray-300/60 rounded mb-3 w-1/3" />
      <div class="h-3 bg-gray-300/60 rounded w-full" />
    </div>
  </div>
</template>
