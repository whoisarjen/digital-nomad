<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700">{{ $t('lifestyle.title') }}</span>
      <span
        v-if="modelValue.length"
        class="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 tabular-nums"
      >
        {{ modelValue.length }} {{ $t('lifestyle.activeCount') }}
      </span>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in LIFESTYLE_PRESETS"
        :key="preset"
        type="button"
        @click="toggle(preset)"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer"
        :class="isActive(preset)
          ? presetConfig[preset].activeClass
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'"
      >
        <component :is="presetConfig[preset].icon" :size="13" />
        {{ $t(`lifestyle.presets.${preset}`) }}
      </button>
    </div>

    <p class="text-[11px] text-gray-400 leading-snug">
      {{ $t('lifestyle.hint') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { LucideUtensils, LucideBeer, LucideWifi, LucideDumbbell, LucideHome, LucidePackage } from 'lucide-vue-next'
import { LIFESTYLE_PRESETS, type LifestylePreset } from '~/shared/global.utils'

const props = defineProps<{
  modelValue: LifestylePreset[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LifestylePreset[]]
}>()

const presetConfig: Record<LifestylePreset, { icon: unknown; activeClass: string }> = {
  budget_food: {
    icon: LucideUtensils,
    activeClass: 'bg-orange-50 border-orange-300 text-orange-700',
  },
  cheap_beer: {
    icon: LucideBeer,
    activeClass: 'bg-yellow-50 border-yellow-300 text-yellow-700',
  },
  fast_internet: {
    icon: LucideWifi,
    activeClass: 'bg-cyan-50 border-cyan-300 text-cyan-700',
  },
  affordable_gym: {
    icon: LucideDumbbell,
    activeClass: 'bg-violet-50 border-violet-300 text-violet-700',
  },
  budget_rent: {
    icon: LucideHome,
    activeClass: 'bg-emerald-50 border-emerald-300 text-emerald-700',
  },
  nomad_bundle: {
    icon: LucidePackage,
    activeClass: 'bg-amber-50 border-amber-300 text-amber-700',
  },
}

function isActive(preset: LifestylePreset): boolean {
  return props.modelValue.includes(preset)
}

function toggle(preset: LifestylePreset) {
  if (isActive(preset)) {
    emit('update:modelValue', props.modelValue.filter(p => p !== preset))
  } else {
    emit('update:modelValue', [...props.modelValue, preset])
  }
}
</script>
