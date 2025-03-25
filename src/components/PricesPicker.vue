<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="block text-sm font-medium text-gray-700">
      Prices
    </label>
    <div class="flex items-center gap-2">
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="minValue"
          :min="props.min"
          :max="props.max"
          class="w-full rounded-lg focus:outline-none custom-button p-2 pl-4 pr-5"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">$</span>
      </div>
      <span>to</span>
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="maxValue"
          :min="props.min"
          :max="props.max"
          class="w-full rounded-lg focus:outline-none custom-button p-2 pl-4 pr-5"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">$</span>
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

const props = defineProps<{ min: number; max: number }>()

const prices = computed(() => getRangesFromQuery(props.min, props.max)(compact(concat(route.query['prices'])) as string[]))

const minValue = ref<number>(prices.value.min);
const maxValue = ref<number>(prices.value.max);

function validateRange() {
  if (minValue.value < props.min) minValue.value = props.min;
  if (maxValue.value > props.max) maxValue.value = props.max;
  if (minValue.value >= maxValue.value) minValue.value = maxValue.value - 1;

  router.push({
    query: {
      ...route.query,
      prices: [`gte:${minValue.value}`, `lte:${maxValue.value}`],
    },
  });
}

watch(
  () => route.query,
  () => {
    const updatedPrices = prices.value;
    minValue.value = updatedPrices.min;
    maxValue.value = updatedPrices.max;
  },
  { immediate: true }
);
</script>
