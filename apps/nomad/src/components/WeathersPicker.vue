<template>
  <div class="flex flex-col gap-2">
    <div class="text-sm font-medium text-white/60">{{ $t('filters.weathers') }}</div>
    <div class="flex flex-wrap gap-1">
      <div
        v-for="icon in (Object.keys(WEATHERS_ICONS) as WeatherIcon[])"
        :key="icon"
        @click="selectWeather(icon)"
        class="px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors flex flex-grow items-center justify-center h-9"
        :class="selectedOptions.includes(icon)
          ? 'bg-primary-500/[0.15] border-primary-500/40 text-primary-300 hover:bg-primary-500/[0.22]'
          : 'bg-white/[0.06] text-white/60 border-white/[0.1] hover:bg-white/[0.09]'"
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
