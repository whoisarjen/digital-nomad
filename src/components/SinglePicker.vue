<template>
    <div>
        <label :for="name" class="block text-sm font-medium text-gray-700">{{ upperFirst(props.name) }}</label>
        <select
            :id="name"
            v-model="selectedOption"
            @change="updateQuery"
            class="w-full p-3 mt-2 border rounded-lg"
        >
            <option v-for="option of preparedOptions" :value="option.value">{{ option.label }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import upperFirst from 'lodash/upperFirst'

type Option = {
    label: string
    value: string
}
const props = defineProps<{
  name: string
  options: Option[]
}>()

const defaultOption = computed(() => ({
    label: `All ${props.name}`,
    value: '-1',
}))

const preparedOptions = computed(() => {
    return [
        defaultOption.value,
        ...props.options,
    ]
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
  