<template>
    <div class="flex flex-col gap-2">
      <label v-if="isLabel" :for="name" class="block text-sm font-medium text-gray-700">{{ props.name.split('_').map(upperFirst).join(' ') }}</label>
      <div class="relative">
        <select
          :id="name"
          v-model="selectedOption"
          @change="updateQuery"
          class="w-full p-2 pl-4 pr-10 rounded-lg focus:outline-none custom-button text-left"
          :class="{
            'custom-button-active': selectedOption !== defaultOption.value,
          }"
        >
          <option
            v-for="option of preparedOptions"
            :key="option.value"
            :value="option.value"
            class="text-sm text-gray-700"
          >
            {{ getLabel(option) }}
          </option>
        </select>
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <lucideChevronDown
            class="w-5 h-5"
            :class="{
              'text-white': selectedOption !== defaultOption.value,
              'text-gray-500': selectedOption === defaultOption.value,
            }"
          />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst'

type Option = {
    label: string
    value: string
}
const props = defineProps<{
  name: string
  operation: 'lte' | 'gte' | 'range' | 'equals'
  options: Option[]
  isLabel?: boolean
  customDefaultOption?: Option
}>()

const defaultOption = computed(() => props.customDefaultOption ?? ({
    label: `All ${props.name.split('_').join(' ')}`,
    value: '-1',
}))

const getLabel = (option: Option) => {
    if (option.value === defaultOption.value.value) {
        return option.label
    }

    if (props.operation === 'lte') {
        return `≤ ${option.label}`
    }

    if (props.operation === 'gte') {
        return `${option.label} ≤`
    }

    return option.label
}

const preparedOptions = computed(() => {
    return uniqBy([
        defaultOption.value,
        ...props.options,
    ], option => option.value)
})

const route = useRoute()
const router = useRouter()

const selectedOption = ref<string | number>(route.query[props.name as keyof typeof route['query']] as string | number | undefined ?? defaultOption.value.value)

function updateQuery(event: Event) {
    const value = (event.target as HTMLSelectElement).value as string | number

    router.push({
        query: {
            ...route.query,
            page: undefined,
            [props.name]: defaultOption.value.value === value ? undefined : value,
        }
    })
}

watch(() => route.query[props.name], (newVal) => {
    selectedOption.value = newVal as string | number | undefined ?? defaultOption.value.value
}, {
    immediate: true,
})
</script>
  