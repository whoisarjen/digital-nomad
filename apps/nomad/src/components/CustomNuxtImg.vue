<template>
  <img
    ref="imgRef"
    class="custom-img"
    :class="{ 'is-loaded': isLoaded }"
    :loading="loading"
    v-bind="$attrs"
    @load="onLoad"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  loading?: 'lazy' | 'eager'
}>(), {
  loading: 'lazy',
})

const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)

const onLoad = () => { isLoaded.value = true }

onMounted(() => {
  if (imgRef.value?.complete) isLoaded.value = true
})
</script>

<style scoped>
.custom-img {
  opacity: 0;
  transition: opacity 0.4s ease;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.custom-img.is-loaded {
  opacity: 1;
  animation: none;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
