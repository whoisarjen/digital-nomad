<template>
  <div class="flex items-start justify-between gap-4 py-4 group">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h4 class="text-sm font-semibold text-gray-900">{{ feature.name }}</h4>
        <span
          class="text-[11px] font-medium px-2 py-0.5 rounded-full leading-tight"
          :class="statusClasses"
        >
          {{ statusLabel }}
        </span>
      </div>
      <p class="text-sm text-gray-500 leading-relaxed">{{ feature.description }}</p>
    </div>
    <button
      @click="$emit('vote', feature.id)"
      :disabled="(!canVote && !feature.hasVoted) || loading"
      class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 flex-shrink-0 min-w-[56px]"
      :class="feature.hasVoted
        ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100'
        : canVote
          ? 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
          : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'"
    >
      <LucideChevronUp
        :size="14"
        :class="feature.hasVoted ? 'text-primary-500' : canVote ? 'text-gray-400' : 'text-gray-300'"
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
    researching: 'bg-gray-100 text-gray-500',
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
