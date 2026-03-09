<template>
  <div class="relative group">
    <div
      class="p-2 rounded-xl hover:bg-white/20 focus:bg-white/20 focus:outline-none transition-all duration-300 cursor-pointer flex items-center justify-center min-w-11 min-h-11"
      tabindex="0"
    >
      <span class="text-sm font-semibold text-white/80 tabular-nums">
        {{ currencySymbol }}
      </span>
    </div>

    <div
      class="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-200 z-[9999] right-0"
      :class="direction === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'"
    >
      <div class="bg-[#0d1b2e] min-w-48 shadow-xl py-2 rounded-xl border border-white/[0.1]">
        <h3 class="px-3 font-medium mb-2 block text-center text-white text-sm">
          {{ $t('currency.selectCurrency') }}
        </h3>
        <div class="divide-y max-h-80 overflow-y-auto">
          <button
            v-for="curr in SUPPORTED_CURRENCIES"
            :key="curr.code"
            @click="setCurrency(curr.code)"
            class="w-full py-2.5 flex justify-between hover:bg-white/[0.08] focus:bg-white/[0.08] focus:outline-none transition-all cursor-pointer px-3 items-center min-h-11 text-sm"
            :class="currency === curr.code ? 'text-primary-400 font-semibold bg-primary-500/[0.15]' : 'text-white'"
          >
            <span class="flex items-center gap-2">
              <span class="w-6 text-center font-mono text-xs opacity-60">{{ curr.symbol }}</span>
              <span>{{ curr.name }}</span>
            </span>
            <span class="text-xs text-white/40 font-mono">{{ curr.code }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrency, SUPPORTED_CURRENCIES } from '~/composables/useCurrency'

withDefaults(defineProps<{
  direction?: 'above' | 'below'
}>(), {
  direction: 'below',
})

const { currency, currencySymbol, setCurrency } = useCurrency()
</script>
