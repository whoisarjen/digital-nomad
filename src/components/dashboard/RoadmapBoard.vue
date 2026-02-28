<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-gray-900">{{ $t('dashboard.roadmap') }}</h3>
      <span class="text-sm text-gray-400">
        {{ $t('dashboard.votesUsed', { used: votesUsed, total: 3 }) }}
      </span>
    </div>

    <!-- Loading skeleton -->
    <template v-if="status === 'pending'">
      <div v-for="n in 4" :key="n" class="py-4 flex items-start justify-between gap-4" :class="{ 'border-t border-gray-100': n > 1 }">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <div class="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            <div class="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div class="h-3 w-48 bg-gray-50 rounded animate-pulse" />
        </div>
        <div class="h-14 w-14 bg-gray-50 rounded-lg animate-pulse" />
      </div>
    </template>

    <!-- Features list -->
    <template v-else>
      <div
        v-for="(feature, i) in sortedFeatures"
        :key="feature.id"
        :class="{ 'border-t border-gray-100': i > 0 }"
      >
        <DashboardFeatureCard
          :feature="feature"
          :can-vote="canVote"
          :loading="votingId === feature.id"
          @vote="handleVote"
        />
      </div>
      <p v-if="!sortedFeatures.length" class="py-8 text-center text-sm text-gray-400">
        No features yet
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

interface Feature {
  id: string
  name: string
  description: string
  status: string
  voteCount: number
  hasVoted: boolean
}

const props = defineProps<{
  features: Feature[]
  status: string
}>()

const queryClient = useQueryClient()
const votingId = ref<string | null>(null)

const statusOrder: Record<string, number> = { building: 0, next: 1, researching: 2, shipped: 3 }

const sortedFeatures = computed(() =>
  [...props.features].sort((a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99))
)

const votesUsed = computed(() => props.features.filter(f => f.hasVoted).length)
const canVote = computed(() => votesUsed.value < 3)

async function handleVote(featureId: string) {
  votingId.value = featureId
  try {
    await $fetch('/api/features/vote', { method: 'POST', body: { featureId } })
    await queryClient.invalidateQueries({ queryKey: ['/api/features'] })
  } finally {
    votingId.value = null
  }
}
</script>
