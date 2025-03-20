<template>
  <div class="block text-sm font-medium text-gray-700">Months</div>
  <div class="flex flex-wrap gap-1 justify-between">
    <div
      v-for="month in months"
      :key="month.value"
      @click="selectMonth(month.value)"
      :class="[
        'px-4 py-2 rounded-xl border transition-all cursor-pointer text-center text-sm min-w-16',
        selectedOption === month.value
          ? 'bg-blue-500 text-white border-blue-500'
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
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
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
