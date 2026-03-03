<template>
  <div class="relative group/tooltip">
    <slot />
    <!-- Desktop-only informational tooltip -->
    <div
      v-if="!disabled"
      class="hidden md:block absolute z-30 whitespace-nowrap text-[11px] font-medium pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200"
      :class="[
        position === 'bottom'
          ? 'top-full mt-2'
          : 'bottom-full mb-2',
        align === 'left'
          ? 'left-0'
          : align === 'right'
            ? 'right-0'
            : 'left-1/2 -translate-x-1/2',
      ]"
    >
      <div class="bg-gray-900 text-white rounded-lg px-3 py-1.5 shadow-lg">
        {{ message }}
        <!-- Arrow -->
        <div
          class="absolute border-[5px] border-transparent"
          :class="[
            position === 'bottom'
              ? 'bottom-full -mb-px border-b-gray-900'
              : 'top-full -mt-px border-t-gray-900',
            align === 'left'
              ? 'left-3'
              : align === 'right'
                ? 'right-3'
                : 'left-1/2 -translate-x-1/2',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message: string
  position?: 'top' | 'bottom'
  align?: 'left' | 'center' | 'right'
  disabled?: boolean
}>(), {
  position: 'bottom',
  align: 'center',
  disabled: false,
})
</script>
