<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="block text-sm font-medium text-gray-700">
      {{ $t('filters.temperatures') }}
    </label>
    <div class="flex items-center gap-2">
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="minValue"
          :min="-50"
          :max="50"
          class="w-full p-2 pl-4 pr-10 rounded-lg border bg-white text-gray-700 border-gray-300 focus:outline-none text-sm"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">°C</span>
      </div>
      <span>{{ $t('filters.to') }}</span>
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="maxValue"
          :min="-50"
          :max="50"
          class="w-full p-2 pl-4 pr-10 rounded-lg border bg-white text-gray-700 border-gray-300 focus:outline-none text-sm"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">°C</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRangesFromQuery } from '~/shared/global.utils';

const route = useRoute();
const router = useRouter();

const toStringArray = (val: string | string[] | undefined): string[] =>
  Array.isArray(val) ? val : val ? [val] : []

const temperatures = computed(() => getRangesFromQuery(-50, 50)(toStringArray(route.query['temperatures'] as string | string[] | undefined)))

const minValue = ref<number>(temperatures.value.min);
const maxValue = ref<number>(temperatures.value.max);

function validateRange() {
  if (minValue.value < -50) minValue.value = -50;
  if (maxValue.value > 50) maxValue.value = 50;
  if (minValue.value >= maxValue.value) minValue.value = maxValue.value - 1;

  router.push({
    query: {
      ...route.query,
      temperatures: [`gte:${minValue.value}`, `lte:${maxValue.value}`],
    },
  });
}

watch(
  () => route.query,
  () => {
    const updatedTemps = temperatures.value;
    minValue.value = updatedTemps.min;
    maxValue.value = updatedTemps.max;
  },
  { immediate: true }
);
</script>
