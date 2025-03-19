<template>
  <div class="block text-sm font-medium text-gray-700">Months</div>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="month in months"
      :key="month.value"
      @click="selectMonth(month.value)"
      :class="[
        'px-4 py-2 rounded-xl border transition-all cursor-pointer text-center text-sm',
        selectedOption === month.value
          ? 'bg-blue-500 text-white border-blue-500 scale-105'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      ]"
    >
      {{ month.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserCurrentMonthString } from '~/shared/global.utils';

const route = useRoute();
const router = useRouter();

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

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
