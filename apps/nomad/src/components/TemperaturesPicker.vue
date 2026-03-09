<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="block text-sm font-medium text-white/60">
      {{ $t('filters.temperatures') }}
    </label>
    <div class="flex items-center gap-2">
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="minValue"
          :min="-50"
          :max="50"
          class="w-full p-2 pl-4 pr-10 rounded-lg border bg-white/[0.06] text-white/70 border-white/[0.1] focus:outline-none focus:border-white/25 text-sm placeholder:text-white/30"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">°C</span>
      </div>
      <span class="text-white/40">{{ $t('filters.to') }}</span>
      <div class="relative w-full">
        <input
          type="number"
          v-model.number="maxValue"
          :min="-50"
          :max="50"
          class="w-full p-2 pl-4 pr-10 rounded-lg border bg-white/[0.06] text-white/70 border-white/[0.1] focus:outline-none focus:border-white/25 text-sm placeholder:text-white/30"
          @input="validateRange"
        />
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">°C</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRangesFromQuery } from '~/shared/global.utils';

const props = defineProps<{
  modelValue?: string[]
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>();

const isControlled = computed(() => props.modelValue !== undefined);

const route = useRoute();
const router = useRouter();

const toStringArray = (val: string | string[] | undefined): string[] =>
  Array.isArray(val) ? val : val ? [val] : []

const parseRanges = getRangesFromQuery(-50, 50);

const temperatures = computed(() =>
  isControlled.value
    ? parseRanges(props.modelValue ?? [])
    : parseRanges(toStringArray(route.query['temperatures'] as string | string[] | undefined))
);

const minValue = ref<number>(temperatures.value.min);
const maxValue = ref<number>(temperatures.value.max);

function validateRange() {
  if (minValue.value < -50) minValue.value = -50;
  if (maxValue.value > 50) maxValue.value = 50;
  if (minValue.value >= maxValue.value) minValue.value = maxValue.value - 1;

  if (isControlled.value) {
    emit('update:modelValue', [`gte:${minValue.value}`, `lte:${maxValue.value}`]);
  } else {
    router.push({
      query: {
        ...route.query,
        temperatures: [`gte:${minValue.value}`, `lte:${maxValue.value}`],
      },
    });
  }
}

watch(
  () => isControlled.value ? props.modelValue : route.query,
  () => {
    const updatedTemps = temperatures.value;
    minValue.value = updatedTemps.min;
    maxValue.value = updatedTemps.max;
  },
  { immediate: true }
);
</script>
