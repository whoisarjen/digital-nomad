<template>
  <div class="flex flex-col gap-2">
    <div class="text-sm font-medium text-gray-700">{{ $t('filters.weathers') }}</div>
    <div class="flex flex-wrap gap-1">
      <div
        v-for="icon in (Object.keys(WEATHERS_ICONS) as WeatherIcon[])"
        :key="icon"
        @click="selectWeather(icon)"
        class="px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors flex flex-grow items-center justify-center h-9"
        :class="selectedOptions.includes(icon)
          ? 'bg-primary-50 border-primary-300 text-primary-800 hover:bg-primary-100'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
      >
        <WeatherIcon :weather-icon="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherIcon } from '@prisma/client';

const props = defineProps<{
  modelValue?: string[]
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>();

const route = useRoute();
const router = useRouter();

const isControlled = computed(() => props.modelValue !== undefined);

const WEATHERS_ICONS = {
  SUN: true,
  CLOUDY: true,
  WIND: true,
  RAIN: true,
  SNOW: true,
} as const satisfies { [key in Exclude<WeatherIcon, 'NULL'>]: boolean }

const toStringArray = (val: string | string[] | undefined): string[] =>
  Array.isArray(val) ? val : val ? [val] : []

const selectedOptions = ref<string[]>(
  isControlled.value
    ? [...(props.modelValue ?? [])]
    : toStringArray(route.query.weathers as string | string[] | undefined)
);

function selectWeather(value: string) {
  const index = selectedOptions.value.indexOf(value);

  let newSelections = []
  if (index !== -1) {
    newSelections = selectedOptions.value.filter(option => option !== value);
  } else {
    newSelections = [...selectedOptions.value, value];
  }

  if (isControlled.value) {
    emit('update:modelValue', newSelections);
  } else {
    router.push({
      query: {
        ...route.query,
        page: undefined,
        weathers: newSelections.length ? newSelections : undefined,
      },
    });
  }
}

watch(() => props.modelValue, (newVal) => {
  if (isControlled.value) {
    selectedOptions.value = newVal ? [...newVal] : [];
  }
});

watch(() => route.query.weathers, (newVal) => {
  if (!isControlled.value) {
    selectedOptions.value = Array.isArray(newVal)
      ? (newVal as string[])
      : newVal ? [newVal] : [];
  }
}, {
  immediate: true,
});
</script>
