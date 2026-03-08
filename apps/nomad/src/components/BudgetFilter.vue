<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700">{{ $t('budget.filterLabel') }}</span>
      <span class="text-sm font-semibold text-gray-900 tabular-nums">${{ budget.toLocaleString() }}/mo</span>
    </div>

    <input
      type="range"
      :value="budget"
      min="300"
      max="15000"
      step="100"
      class="w-full accent-primary-600"
      @input="onSliderInput"
    />

    <div class="flex items-center justify-between text-xs text-gray-400">
      <span>$300</span>
      <span>$15,000</span>
    </div>

    <label class="flex items-center gap-2.5 cursor-pointer mt-1">
      <input
        type="checkbox"
        :checked="isFilterActive"
        class="size-4 rounded accent-primary-600 cursor-pointer"
        @change="onToggleFilter"
      />
      <span class="text-sm text-gray-700">{{ $t('budget.onlyAffordable') }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const { budget, setBudget } = useBudget()
const route = useRoute()
const router = useRouter()

const instance = getCurrentInstance()
const isControlled = computed(
  () => instance?.vnode.props != null && 'modelValue' in instance.vnode.props,
)

const isFilterActive = computed(() =>
  isControlled.value ? !!props.modelValue : !!route.query.costs,
)

function onSliderInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  setBudget(val)
  if (isControlled.value) {
    if (isFilterActive.value) {
      emit('update:modelValue', String(val))
    }
  } else if (isFilterActive.value) {
    router.push({ query: { ...route.query, costs: String(val) } })
  }
}

function onToggleFilter(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  if (isControlled.value) {
    emit('update:modelValue', checked ? String(budget.value) : undefined)
  } else {
    const query = { ...route.query }
    if (checked) {
      query.costs = String(budget.value)
    } else {
      delete query.costs
    }
    router.push({ query })
  }
}
</script>
