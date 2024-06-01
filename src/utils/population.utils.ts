import { type ReadonlyURLSearchParams } from "next/navigation"

export const PICKER_POPULATION_MIN_KEY = 'populationMin'
export const PICKER_POPULATION_MAX_KEY = 'populationMax'

// Also affect the range of slider
export const DEFAULT_POPULATION_MIN = 0
export const DEFAULT_POPULATION_MAX = 1000000000

export const checkPopulationMin = (number: number): number => {
    if (number <= DEFAULT_POPULATION_MIN) {
        return DEFAULT_POPULATION_MIN
    }

    if (number >= DEFAULT_POPULATION_MAX) {
        return DEFAULT_POPULATION_MAX - 1 // 1 less as the second picker need to adjust
    }

    return number
}

export const getCurrentPopulationMin = (searchParams: ReadonlyURLSearchParams | URLSearchParams): number => {
    const params = new URLSearchParams(searchParams)
    const result = Number(params.get(PICKER_POPULATION_MIN_KEY) ?? DEFAULT_POPULATION_MIN)
    return checkPopulationMin(result)
}

export const checkPopulationMax = (number: number): number => {
    if (number <= DEFAULT_POPULATION_MIN) {
        return DEFAULT_POPULATION_MIN + 1 // 1 more as the second picker need to adjust
    }

    if (number >= DEFAULT_POPULATION_MAX) {
        return DEFAULT_POPULATION_MAX
    }

    return number
}

export const getCurrentPopulationMax = (searchParams: ReadonlyURLSearchParams | URLSearchParams): number => {
    const params = new URLSearchParams(searchParams)
    const result = Number(params.get(PICKER_POPULATION_MAX_KEY) ?? DEFAULT_POPULATION_MAX)
    return checkPopulationMax(result)
}

export const formatPopulationNumber = (number: number) => {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(number)
}
