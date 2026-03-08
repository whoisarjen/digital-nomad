<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums"
    :class="colorClass"
  >
    {{ score }} ★
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ score: number }>()

const colorClass = computed(() => {
  if (props.score >= 4) return 'bg-green-500/20 text-green-400'
  if (props.score === 3) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
})
</script>
