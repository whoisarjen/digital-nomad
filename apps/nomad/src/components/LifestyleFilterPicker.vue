<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-white/60">{{ $t('lifestyle.title') }}</span>
      <span
        v-if="modelValue.length"
        class="text-[11px] font-semibold text-amber-400 bg-amber-500/[0.12] border border-amber-500/30 rounded-full px-2 py-0.5 tabular-nums"
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
          : 'bg-white/[0.06] border-white/[0.1] text-white/50 hover:border-white/20 hover:bg-white/[0.09]'"
      >
        <component :is="presetConfig[preset].icon" :size="13" />
        {{ $t(`lifestyle.presets.${preset}`) }}
      </button>
    </div>

    <p class="text-[11px] text-white/30 leading-snug">
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
    activeClass: 'bg-orange-500/[0.15] border-orange-500/40 text-orange-300',
  },
  cheap_beer: {
    icon: LucideBeer,
    activeClass: 'bg-yellow-500/[0.15] border-yellow-500/40 text-yellow-300',
  },
  fast_internet: {
    icon: LucideWifi,
    activeClass: 'bg-cyan-500/[0.15] border-cyan-500/40 text-cyan-300',
  },
  affordable_gym: {
    icon: LucideDumbbell,
    activeClass: 'bg-violet-500/[0.15] border-violet-500/40 text-violet-300',
  },
  budget_rent: {
    icon: LucideHome,
    activeClass: 'bg-emerald-500/[0.15] border-emerald-500/40 text-emerald-300',
  },
  nomad_bundle: {
    icon: LucidePackage,
    activeClass: 'bg-amber-500/[0.15] border-amber-500/40 text-amber-300',
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
