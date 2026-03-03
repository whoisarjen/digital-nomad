<template>
  <div class="block text-sm font-medium text-gray-700">{{ $t('filters.months') }}</div>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="month in months"
      :key="month.value"
      @click="selectMonth(month.value)"
      class="custom-button min-w-16 flex-grow"
      :class="{
        'custom-button-active': selectedOption === month.value,
      }"
    >
      {{ month.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserCurrentMonthString } from '~/shared/global.utils';

const { t } = useCustomI18n()
const route = useRoute();
const router = useRouter();

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const months = computed(() => MONTH_KEYS.map((key, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: t(`months.${key}`),
})));

const currentMonthString = computed(() => getUserCurrentMonthString())
const selectedOption = ref<string | null>(route.query.months as string || currentMonthString.value);

function selectMonth(value: string) {
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

watch(() => route.query.months, (newVal) => {
  selectedOption.value = newVal as string || currentMonthString.value;
}, {
  immediate: true,
});
</script>
