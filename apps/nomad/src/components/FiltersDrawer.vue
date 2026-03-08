<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="drawer-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
        @click="close"
      />
    </Transition>

    <!-- Bottom Sheet -->
    <Transition name="drawer-sheet">
      <div
        v-if="modelValue"
        role="dialog"
        aria-modal="true"
        class="fixed inset-x-0 bottom-0 z-[61] flex flex-col bg-[#FAFAF8] rounded-t-[20px] shadow-[0_-4px_30px_rgba(0,0,0,0.10)]"
        :style="{ maxHeight: '85dvh' }"
      >
        <!-- Drag handle -->
        <div class="flex justify-center pt-3 pb-2 shrink-0">
          <div class="w-9 h-[5px] rounded-full bg-gray-300/80" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pb-3 shrink-0">
          <div class="flex items-center gap-2.5">
            <h3 class="text-[17px] font-bold text-gray-900 tracking-[-0.01em]">
              {{ $t('filters.title') }}
            </h3>
            <span
              v-if="activeFilterCount"
              class="min-w-5 h-5 rounded-full bg-accent-500 text-white text-[11px] font-bold flex items-center justify-center px-1.5 tabular-nums"
            >
              {{ activeFilterCount }}
            </span>
          </div>
          <button
            @click="close"
            class="size-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LucideX :size="18" />
          </button>
        </div>

        <div class="h-px bg-gray-200/70 shrink-0" />

        <!-- Scrollable filter content -->
        <div class="flex-1 overflow-y-auto overscroll-contain" style="-webkit-overflow-scrolling: touch">
          <div class="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Favorites toggle -->
            <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
              <div class="text-sm font-medium text-gray-700">{{ $t('filters.favorites') }}</div>
              <AuthGate :message="$t('favorites.signInRequired')" position="bottom" align="left" v-slot="{ isLocked }">
                <button
                  @click="$emit('toggleFavorites')"
                  :disabled="isLocked"
                  class="w-full flex items-center justify-between gap-2 px-4 h-9 rounded-lg border text-sm transition-all"
                  :class="isLocked
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                    : isFavoritesActive
                      ? 'bg-rose-50 border-rose-200 text-rose-700 cursor-pointer'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer'"
                >
                  <span class="flex items-center gap-2">
                    <LucideHeart :size="14" :class="isFavoritesActive && !isLocked ? 'text-rose-500 fill-rose-500' : ''" />
                    {{ $t('favorites.onlyFavorites') }}
                  </span>
                  <span
                    v-if="!isLocked"
                    class="size-4 rounded border flex items-center justify-center transition-colors"
                    :class="isFavoritesActive ? 'bg-rose-500 border-rose-500' : 'border-gray-300'"
                  >
                    <LucideCheck v-if="isFavoritesActive" :size="10" class="text-white" />
                  </span>
                  <LucideLock v-else :size="12" class="text-gray-400" />
                </button>
              </AuthGate>
            </div>

            <!-- Weather -->
            <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
              <WeathersPicker />
            </div>

            <!-- Months (full width on desktop) -->
            <div class="md:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
              <MonthsPicker />
            </div>

            <!-- Temperature -->
            <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
              <TemperaturesPicker />
            </div>

            <!-- Budget -->
            <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
              <BudgetFilter />
            </div>

            <!-- Regions (full width on desktop) -->
            <div v-if="!hideRegions" class="md:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
              <RegionsPicker />
            </div>

            <!-- Dynamic pickers from API -->
            <template v-if="pickers">
              <div v-for="key of Object.keys(pickers)" :key="key" class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
                <SinglePicker
                  :name="key"
                  :operation="(pickers as any)[key].operation"
                  :options="(pickers as any)[key].options"
                  isLabel
                />
              </div>
            </template>
          </div>
        </div>

        <!-- Footer with safe area -->
        <div class="shrink-0 border-t border-gray-200/70 drawer-footer-safe">
          <div class="px-5 py-3 flex items-center gap-3">
            <button
              @click="clearAndClose"
              :disabled="!activeFilterCount"
              class="px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors"
              :class="activeFilterCount
                ? 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'"
            >
              {{ $t('filters.clear') }}
            </button>
            <button
              @click="close"
              class="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
            >
              Show results
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  pickers: any
  activeFilterCount: number
  isFavoritesActive: boolean
  hideRegions?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'toggleFavorites': []
  'clearFilters': []
}>()

function close() {
  emit('update:modelValue', false)
}

function clearAndClose() {
  emit('clearFilters')
  close()
}

// Lock body scroll when drawer is open
watch(() => props.modelValue, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

// Close on Escape key + cleanup
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
