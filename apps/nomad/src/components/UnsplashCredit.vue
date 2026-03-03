<template>
  <div
    class="absolute z-20 flex items-center rounded-full cursor-default
           max-w-6 opacity-60 bg-black/35 backdrop-blur text-white/55
           hover:max-w-72 hover:opacity-100 hover:bg-black/55 hover:text-white/75
           transition-all duration-300 group/credit"
    :class="positionClasses"
  >
    <div class="flex items-center gap-0 overflow-hidden" :class="{ 'flex-row-reverse': isRightSide }">
      <!-- Camera icon — always visible -->
      <div class="shrink-0 size-6 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      </div>

      <!-- Credit text — revealed on hover -->
      <div
        class="whitespace-nowrap text-[10px] leading-none opacity-0 group-hover/credit:opacity-100 transition-opacity duration-200 delay-75"
        :class="isRightSide ? 'pl-1' : 'pr-2'"
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="`https://unsplash.com/@${ownerUsername}?utm_source=Digital%20Nomad&utm_medium=referral`"
          class="hover:text-white transition-colors"
          @click.stop
        >{{ ownerName }}</a>
        <span class="opacity-50 mx-0.5">/</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://unsplash.com/?utm_source=Digital%20Nomad&utm_medium=referral"
          class="hover:text-white transition-colors"
          @click.stop
        >Unsplash</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  ownerName: string
  ownerUsername?: string | null
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}>(), {
  position: 'bottom-left',
})

const isRightSide = computed(() => props.position.includes('right'))

const positionClasses = computed(() => {
  const map: Record<string, string> = {
    'bottom-right': 'bottom-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'top-right': 'top-3 right-3',
    'top-left': 'top-3 left-3',
  }
  return map[props.position]
})
</script>
