<template>
  <div class="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
    <!-- Label -->
    <div class="flex items-center gap-3 min-w-0">
      <span class="text-xl leading-none flex-shrink-0">{{ item.emoji }}</span>
      <div class="min-w-0">
        <p class="text-sm font-medium text-white/80 truncate">{{ $t(item.labelKey) }}</p>
        <p v-if="price !== null" class="text-xs text-white/40 tabular-nums mt-0.5">
          {{ formatCost(price) }} each
        </p>
        <p v-else class="text-xs text-white/30 mt-0.5">—</p>
      </div>
    </div>

    <!-- Stepper -->
    <div class="flex items-center gap-0 flex-shrink-0 ml-4">
      <button
        class="size-8 rounded-l-lg flex items-center justify-center transition-all text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        :class="item.qty === 0 ? 'bg-white/[0.04]' : 'bg-white/[0.08] hover:bg-white/[0.12]'"
        :disabled="item.qty <= item.min"
        @click="$emit('decrement')"
      >
        <LucideMinus :size="13" />
      </button>

      <div
        class="w-9 text-center text-sm font-bold tabular-nums py-1.5 bg-white/[0.06]"
        :class="item.qty > 0 ? 'text-amber-400' : 'text-white/30'"
      >
        {{ item.qty }}
      </div>

      <button
        class="size-8 rounded-r-lg bg-white/[0.08] hover:bg-white/[0.12] flex items-center justify-center transition-all text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="item.qty >= item.max"
        @click="$emit('increment')"
      >
        <LucidePlus :size="13" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

interface DayItemConfig {
  key: string
  emoji: string
  labelKey: string
  qty: number
  min: number
  max: number
}

defineProps<{
  item: DayItemConfig
  price: number | null
}>()

defineEmits<{
  increment: []
  decrement: []
}>()

const { formatCost } = useCurrency()
</script>
