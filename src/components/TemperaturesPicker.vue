<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="block text-sm font-medium text-gray-700">
      Temperatures
    </label>
    <div class="flex items-center gap-2">
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="minValue"
          :min="-50"
          :max="50"
          class="w-full p-2 pl-4 pr-10 rounded-lg focus:outline-none custom-button"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">°C</span>
      </div>
      <span>to</span>
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="maxValue"
          :min="-50"
          :max="50"
          class="w-full p-2 pl-4 pr-10 rounded-lg focus:outline-none custom-button"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">°C</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import concat from 'lodash/concat'
import compact from 'lodash/compact'
import { getRangesFromQuery } from '~/shared/global.utils';

const route = useRoute();
const router = useRouter();

const temperatures = computed(() => getRangesFromQuery(-50, 50)(compact(concat(route.query['temperatures'])) as string[]))

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
