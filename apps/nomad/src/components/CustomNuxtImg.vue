<template>
  <NuxtImg
    class="custom-img"
    provider="unsplash"
    :src="unsplashPath"
    :loading="loading"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  src: string
  loading?: 'lazy' | 'eager'
}>(), {
  loading: 'lazy',
})

const UNSPLASH_BASE = 'https://images.unsplash.com'

const unsplashPath = computed(() =>
  props.src.startsWith(UNSPLASH_BASE)
    ? props.src.slice(UNSPLASH_BASE.length)
    : props.src
)
</script>

<style scoped>
.custom-img {
  opacity: 1;
  transition: opacity 0.4s ease;
}

@starting-style {
  .custom-img {
    opacity: 0;
  }
}
</style>
