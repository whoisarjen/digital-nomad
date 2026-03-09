<template>
  <div class="flex flex-col gap-2">
    <div class="text-sm font-medium text-white/60">{{ $t('filters.months') }}</div>
    <div class="flex flex-wrap gap-1">
      <div
        v-for="month in months"
        :key="month.value"
        @click="selectMonth(month.value)"
        class="px-4 py-2 rounded-lg border cursor-pointer text-center text-sm transition-colors min-w-16 flex-grow"
        :class="selectedOption === month.value
          ? 'bg-primary-500/[0.15] border-primary-500/40 text-primary-300 hover:bg-primary-500/[0.22]'
          : 'bg-white/[0.06] text-white/60 border-white/[0.1] hover:bg-white/[0.09]'"
      >
        {{ month.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserCurrentMonthString } from '~/shared/global.utils';

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isControlled = computed(() => props.modelValue !== undefined)

const { t } = useCustomI18n()
const route = useRoute();
const router = useRouter();

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const months = computed(() => MONTH_KEYS.map((key, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: t(`months.${key}`),
})));

const currentMonthString = computed(() => getUserCurrentMonthString())
const selectedOption = ref<string | null>(
  isControlled.value
    ? props.modelValue!
    : (route.query.months as string || currentMonthString.value)
);

function selectMonth(value: string) {
  if (isControlled.value) {
    selectedOption.value = value;
    emit('update:modelValue', value);
    return;
  }

  if (selectedOption.value !== value) {
    selectedOption.value = value;
  }

  router.push({
    query: {
      ...route.query,
      page: undefined,
      months: value === currentMonthString.value ? undefined : selectedOption.value,
    }
  });
}

watch(() => props.modelValue, (newVal) => {
  if (isControlled.value && newVal !== undefined) {
    selectedOption.value = newVal;
  }
});

watch(() => route.query.months, (newVal) => {
  if (!isControlled.value) {
    selectedOption.value = newVal as string || currentMonthString.value;
  }
}, {
  immediate: true,
});
</script>
