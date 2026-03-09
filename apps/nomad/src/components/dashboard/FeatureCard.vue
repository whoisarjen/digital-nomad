<template>
  <div class="flex items-start justify-between gap-4 py-4 group">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h4 class="text-sm font-semibold text-white">{{ feature.name }}</h4>
        <span
          class="text-[11px] font-medium px-2 py-0.5 rounded-full leading-tight"
          :class="statusClasses"
        >
          {{ statusLabel }}
        </span>
      </div>
      <p class="text-sm text-white/50 leading-relaxed">{{ feature.description }}</p>
    </div>
    <button
      @click="$emit('vote', feature.id)"
      :disabled="(!canVote && !feature.hasVoted) || loading"
      class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 flex-shrink-0 min-w-[56px]"
      :class="feature.hasVoted
        ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100'
        : canVote
          ? 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:border-white/[0.18] hover:text-white/80'
          : 'bg-white/[0.02] border-white/[0.05] text-white/20 cursor-not-allowed'"
    >
      <LucideChevronUp
        :size="14"
        :class="feature.hasVoted ? 'text-primary-500' : canVote ? 'text-white/40' : 'text-white/20'"
      />
      <span class="tabular-nums text-xs">{{ feature.voteCount }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  id: string
  name: string
  description: string
  status: string
  voteCount: number
  hasVoted: boolean
}

const props = defineProps<{
  feature: Feature
  canVote: boolean
  loading: boolean
}>()

defineEmits<{
  vote: [featureId: string]
}>()

const { t } = useCustomI18n()

const statusClasses = computed(() => {
  const map: Record<string, string> = {
    building: 'bg-amber-50 text-amber-600',
    next: 'bg-primary-50 text-primary-600',
    researching: 'bg-white/[0.08] text-white/50',
    shipped: 'bg-emerald-50 text-emerald-600',
  }
  return map[props.feature.status] || map.researching
})

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    building: t('dashboard.statusBuilding'),
    next: t('dashboard.statusNext'),
    researching: t('dashboard.statusResearching'),
    shipped: t('dashboard.statusShipped'),
  }
  return map[props.feature.status] || props.feature.status
})
</script>
