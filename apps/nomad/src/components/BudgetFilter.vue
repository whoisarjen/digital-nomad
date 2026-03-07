<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700">{{ $t('budget.filterLabel') }}</span>
      <button
        v-if="budget !== null"
        @click="clearBudget"
        class="text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        {{ $t('budget.clearBudget') }}
      </button>
    </div>

    <!-- Slider -->
    <input
      type="range"
      :value="sliderValue"
      min="300"
      max="15000"
      step="100"
      class="w-full accent-primary-600"
      @input="onSliderInput"
    />

    <!-- Value display -->
    <div class="flex items-center justify-between text-xs text-gray-500">
      <span>$300</span>
      <span class="font-semibold text-gray-800 tabular-nums">
        {{ budget !== null ? `$${budget}` : `$${sliderValue}` }}/mo
      </span>
      <span>$15,000</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { budget, setBudget } = useBudget()

const sliderValue = ref<number>(budget.value ?? 3000)

function onSliderInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  sliderValue.value = v
  setBudget(v)
}

function clearBudget() {
  setBudget(null)
  sliderValue.value = 3000
}
</script>
