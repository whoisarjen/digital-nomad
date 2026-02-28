<template>
  <div class="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-5">
    <DashboardNomadIdentity
      v-if="user"
      :number="user.number"
      :member-count="communityStats?.memberCount ?? 0"
    />

    <DashboardRoadmapBoard
      :features="features?.data ?? []"
      :status="featuresStatus"
    />

    <DashboardAccountDangerZone />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

defineI18nRoute({
  paths: {
    en: '/dashboard',
    pl: '/panel',
  },
})

const { user } = useAuth()
const { data: featuresData, status: featuresStatus } = await useFeatures()
const { data: communityData } = await useCommunityStats()

const features = computed(() => featuresData.value as any)
const communityStats = computed(() => communityData.value as any)
</script>
