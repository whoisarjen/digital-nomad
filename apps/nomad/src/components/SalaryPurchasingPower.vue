<template>
  <div v-if="salary !== null && nomadCost !== null" data-testid="salary-power" class="mt-4 pt-4 border-t border-white/[0.05]">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-3">
      <div class="size-5 rounded-md bg-amber-500/[0.15] flex items-center justify-center shrink-0">
        <LucideTrendingUp :size="11" class="text-amber-400" />
      </div>
      <span class="text-[11px] font-semibold text-white/50 uppercase tracking-wide">{{ $t('salaryPower.title') }}</span>
    </div>

    <!-- Three stat columns -->
    <div class="grid grid-cols-3 gap-3 mb-3">
      <!-- Local salary -->
      <div class="flex flex-col gap-0.5">
        <span class="text-[10px] font-medium text-white/40 uppercase tracking-wide leading-none">{{ $t('salaryPower.localSalary') }}</span>
        <span class="text-sm font-bold text-white/80 tabular-nums">{{ formatCost(salary) }}<span class="text-xs font-normal text-white/40">/mo</span></span>
      </div>

      <!-- Nomad cost -->
      <div class="flex flex-col gap-0.5">
        <span class="text-[10px] font-medium text-white/40 uppercase tracking-wide leading-none">{{ $t('salaryPower.nomadCost') }}</span>
        <span class="text-sm font-bold text-emerald-400 tabular-nums">{{ formatCost(nomadCost) }}<span class="text-xs font-normal text-white/40">/mo</span></span>
      </div>

      <!-- Ratio -->
      <div class="flex flex-col gap-0.5">
        <span class="text-[10px] font-medium text-white/40 uppercase tracking-wide leading-none">{{ $t('salaryPower.ratio') }}</span>
        <span class="text-sm font-bold tabular-nums" :class="ratioClass">{{ ratioDisplay }}×</span>
      </div>
    </div>

    <!-- Progress bar: salary fills to cover nomad cost -->
    <div class="relative h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
      <div
        class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
        :class="ratio <= 1 ? 'bg-amber-400' : 'bg-emerald-400'"
        :style="{ width: `${Math.min(salaryFillPct, 100)}%` }"
      />
      <!-- Nomad cost marker at 100% -->
      <div class="absolute inset-y-0 right-0 w-px bg-white/30" />
    </div>

    <!-- Insight sentence -->
    <p class="text-[11px] text-white/40 leading-relaxed mt-2">
      {{ insightText }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useCurrency } from '~/composables/useCurrency'

const props = defineProps<{
  salary: number | null
  nomadCost: number | null
}>()

const { t } = useI18n()
const { formatCost } = useCurrency()

// ratio = nomadCost / salary; >1 means cost exceeds salary
const ratio = computed(() => {
  if (props.salary === null || props.nomadCost === null || props.salary === 0) return 0
  return props.nomadCost / props.salary
})

const ratioDisplay = computed(() => ratio.value.toFixed(1))

// Fill = salary as % of nomad cost (capped at 150% for visual clarity)
const salaryFillPct = computed(() => {
  if (props.salary === null || props.nomadCost === null || props.nomadCost === 0) return 0
  return (props.salary / props.nomadCost) * 100
})

const ratioClass = computed(() => {
  if (ratio.value <= 0.8) return 'text-emerald-400' // salary well covers cost
  if (ratio.value <= 1) return 'text-amber-400'     // salary slightly covers cost
  return 'text-red-400'                              // cost exceeds salary
})

const insightText = computed(() => {
  if (props.salary === null || props.nomadCost === null) return ''
  const salaryFmt = formatCost(props.salary)
  const costFmt = formatCost(props.nomadCost)
  const r = ratio.value

  if (r > 1) {
    return t('salaryPower.insightAbove', { salary: salaryFmt, cost: costFmt, ratio: ratio.value.toFixed(1) })
  }
  return t('salaryPower.insightBelow', { salary: salaryFmt, cost: costFmt, pct: Math.round((1 - r) * 100) })
})
</script>
