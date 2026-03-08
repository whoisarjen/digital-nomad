<template>
  <section class="bg-white rounded-2xl border border-gray-100 p-6">
    <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
      <div class="size-8 rounded-xl bg-violet-50 flex items-center justify-center">
        <LucideCalculator :size="16" class="text-violet-600" />
      </div>
      {{ $t('affordability.widgetTitle') }}
    </h2>

    <!-- Budget input (when not set) -->
    <template v-if="budget === null">
      <div class="flex flex-col gap-3">
        <!-- Mode toggle -->
        <div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
          <button
            class="flex-1 py-2 transition-colors"
            :class="mode === 'income' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
            @click="mode = 'income'"
          >
            {{ $t('affordability.monthlyIncome') }}
          </button>
          <button
            class="flex-1 py-2 transition-colors"
            :class="mode === 'savings' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
            @click="mode = 'savings'"
          >
            {{ $t('affordability.totalSavings') }}
          </button>
        </div>

        <!-- Input -->
        <div class="flex gap-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              v-model.number="inputValue"
              type="number"
              min="300"
              max="15000"
              step="100"
              class="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :placeholder="mode === 'income' ? '3000' : '10000'"
              @keydown.enter="applyBudget"
            />
          </div>
          <button
            @click="applyBudget"
            :disabled="!inputValue"
            class="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ $t('affordability.calculate') }}
          </button>
        </div>
      </div>
    </template>

    <!-- Results (when budget is set) -->
    <template v-else>
      <!-- Lifestyle tier tabs -->
      <div class="flex gap-1 mb-4 rounded-lg bg-gray-100 p-1 text-xs font-medium">
        <button
          v-for="tier in tiers"
          :key="tier.key"
          class="flex-1 py-1.5 rounded-md transition-colors"
          :class="activeTier === tier.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTier = tier.key"
        >
          {{ $t(tier.label) }}
        </button>
      </div>

      <!-- Mode toggle (compact) -->
      <div class="flex rounded-md border border-gray-200 overflow-hidden text-xs font-medium mb-4">
        <button
          class="flex-1 py-1.5 transition-colors"
          :class="mode === 'income' ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          @click="mode = 'income'"
        >
          {{ $t('affordability.monthlyIncome') }}
        </button>
        <button
          class="flex-1 py-1.5 transition-colors"
          :class="mode === 'savings' ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          @click="mode = 'savings'"
        >
          {{ $t('affordability.totalSavings') }}
        </button>
      </div>

      <!-- Result card -->
      <div class="rounded-xl border p-4 mb-4" :class="resultCardClass">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium" :class="resultLabelClass">{{ $t(resultLabel) }}</span>
          <span class="text-2xl font-bold tabular-nums" :class="resultAmountClass">
            ${{ Math.abs(resultAmount) }}
          </span>
        </div>
        <div class="text-xs text-gray-500">
          <template v-if="mode === 'income'">
            {{ $t('affordability.budgetVsCost', { budget: budget, cost: activeCost }) }}
          </template>
          <template v-else>
            {{ $t('affordability.runwayMonths', { months: runwayMonths }) }}
          </template>
        </div>
      </div>

      <!-- Status badge -->
      <div class="flex items-center gap-2 text-sm mb-4">
        <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" :class="statusBadgeClass">
          {{ $t(statusLabel) }}
        </span>
        <span class="text-xs text-gray-400">${{ activeCost }}/mo {{ $t('affordability.forLifestyle', { tier: $t(activeTierLabel) }) }}</span>
      </div>

      <!-- Budget info + clear -->
      <div class="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
        <span>{{ mode === 'income' ? $t('affordability.monthlyIncome') : $t('affordability.totalSavings') }}: <span class="font-semibold text-gray-600">${{ budget }}</span></span>
        <button
          @click="clearBudget"
          class="text-gray-400 hover:text-red-500 transition-colors"
        >
          {{ $t('budget.clearBudget') }}
        </button>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
  costNomad: number
  costExpat: number
  costLocal: number
  costFamily: number
}>()

const { budget, setBudget } = useBudget()

const mode = ref<'income' | 'savings'>('income')
const activeTier = ref<'nomad' | 'expat' | 'local' | 'family'>('nomad')
const inputValue = ref<number | null>(null)

const tiers = [
  { key: 'nomad' as const, label: 'city.nomad' },
  { key: 'expat' as const, label: 'city.expat' },
  { key: 'local' as const, label: 'city.local' },
  { key: 'family' as const, label: 'city.family' },
]

const activeCost = computed(() => {
  const costs = {
    nomad: Number(props.costNomad),
    expat: Number(props.costExpat),
    local: Number(props.costLocal),
    family: Number(props.costFamily),
  }
  return costs[activeTier.value]
})

const activeTierLabel = computed(() => tiers.find(t => t.key === activeTier.value)?.label ?? 'city.nomad')

const resultAmount = computed(() => {
  if (budget.value === null) return 0
  if (mode.value === 'income') {
    return budget.value - activeCost.value
  }
  return budget.value - activeCost.value
})

const runwayMonths = computed(() => {
  if (budget.value === null || activeCost.value === 0) return 0
  return Math.floor(budget.value / activeCost.value)
})

const isSurplus = computed(() => resultAmount.value >= 0)
const isTight = computed(() => !isSurplus.value && resultAmount.value > -200)

const resultLabel = computed(() => {
  if (mode.value === 'savings') return 'affordability.runwayMonths'
  return isSurplus.value ? 'affordability.surplus' : 'affordability.deficit'
})

const resultCardClass = computed(() => {
  if (isSurplus.value) return 'border-emerald-100 bg-emerald-50/50'
  if (isTight.value) return 'border-amber-100 bg-amber-50/50'
  return 'border-red-100 bg-red-50/50'
})

const resultLabelClass = computed(() => {
  if (isSurplus.value) return 'text-emerald-700'
  if (isTight.value) return 'text-amber-700'
  return 'text-red-700'
})

const resultAmountClass = computed(() => {
  if (isSurplus.value) return 'text-emerald-600'
  if (isTight.value) return 'text-amber-600'
  return 'text-red-600'
})

const statusLabel = computed(() => {
  if (isSurplus.value) return 'affordability.affordable'
  if (isTight.value) return 'affordability.tight'
  return 'affordability.overBudget'
})

const statusBadgeClass = computed(() => {
  if (isSurplus.value) return 'bg-emerald-100 text-emerald-700'
  if (isTight.value) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
})

function applyBudget() {
  if (inputValue.value && inputValue.value > 0) {
    setBudget(inputValue.value)
  }
}

function clearBudget() {
  setBudget(null)
  inputValue.value = null
}
</script>
