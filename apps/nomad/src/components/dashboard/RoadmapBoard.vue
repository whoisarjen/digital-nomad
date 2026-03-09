<template>
  <div class="bg-white/[0.04] rounded-xl border border-white/[0.1] p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-white">{{ $t('dashboard.roadmap') }}</h3>
      <span class="text-sm text-white/40">
        {{ $t('dashboard.votesUsed', { used: votesUsed, total: 3 }) }}
      </span>
    </div>

    <!-- Loading skeleton -->
    <template v-if="status === 'pending'">
      <div v-for="n in 4" :key="n" class="py-4 flex items-start justify-between gap-4" :class="{ 'border-t border-white/[0.07]': n > 1 }">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <div class="h-4 w-32 skeleton rounded" />
            <div class="h-5 w-16 skeleton rounded-full" />
          </div>
          <div class="h-3 w-48 skeleton rounded" />
        </div>
        <div class="h-14 w-14 skeleton rounded-lg" />
      </div>
    </template>

    <!-- Features list -->
    <template v-else>
      <div
        v-for="(feature, i) in sortedFeatures"
        :key="feature.id"
        :class="{ 'border-t border-white/[0.07]': i > 0 }"
      >
        <DashboardFeatureCard
          :feature="feature"
          :can-vote="canVote"
          :loading="votingId === feature.id"
          @vote="handleVote"
        />
      </div>
      <p v-if="!sortedFeatures.length" class="py-8 text-center text-sm text-white/40">
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
