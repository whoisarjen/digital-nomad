<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="size-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <LucideUser :size="22" class="text-primary-500" />
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ $t('dashboard.identity') }}</p>
          <p class="text-2xl font-bold text-gray-900 tracking-tight">#{{ number }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-400">
        <LucideUsers :size="15" />
        <span>{{ $t('dashboard.memberCount', { count: memberCount }) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: number
  memberCount: number
}>()
</script>
