<template>
  <div class="bg-white/[0.04] rounded-xl border border-white/[0.1] p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="size-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <LucideUser :size="22" class="text-primary-500" />
        </div>
        <div>
          <p class="text-sm text-white/50">{{ $t('dashboard.identity') }}</p>
          <p class="text-2xl font-bold text-white tracking-tight">#{{ number }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-white/40">
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
