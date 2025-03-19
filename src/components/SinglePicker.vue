<template>
    <div>
        <label :for="name" class="block text-sm font-medium text-gray-700">{{ upperFirst(props.name) }}</label>
        <select
            :id="name"
            v-model="selectedOption"
            @change="updateQuery"
            class="w-full p-3 mt-2 border rounded-lg"
        >
            <option v-for="option of preparedOptions" :value="option">{{ option }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import upperFirst from 'lodash/upperFirst'

type Option = string | number
const props = defineProps<{
  name: string
  options: Option[]
}>()

const defaultOption = computed(() => `All ${props.name}`)

const preparedOptions = computed(() => {
    return [
        defaultOption.value,
        ...props.options,
    ]
})

const route = useRoute()
const router = useRouter()

const selectedOption = ref<string | number>(route.query[props.name as keyof typeof route['query']] as Option ?? defaultOption.value)

function updateQuery(event: Event) {
    const value = (event.target as HTMLSelectElement).value as Option

    router.push({
        query: {
            ...route.query,
            [props.name]: defaultOption.value === value ? undefined : value,
        }
    })
}

watch(() => route.query[props.name], (newVal) => {
    selectedOption.value = newVal as Option ?? defaultOption.value
}, {
    immediate: true,
})
</script>
  