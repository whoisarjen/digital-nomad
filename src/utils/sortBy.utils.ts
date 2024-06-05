import { City } from "@prisma/client"

export const PICKER_SORT_BY_KEY = 'sortBy'

export type SortByOption = {
    label: string
    value: keyof City
}

export const PICKER_SORT_BY_DEFAULT = {
    label: 'Score',
    value: 'totalScore',
} as const satisfies SortByOption

export const PICKER_SORT_BY_OPTIONS = [
    PICKER_SORT_BY_DEFAULT,
    {
        label: 'Cost',
        value: 'costForNomadInUSD',
    },
    {
        label: 'WiFi',
        value: 'wifi',
    },
    {
        label: 'Name',
        value: 'name',
    },
] as const satisfies SortByOption[]

export const getCurrentSortBy = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_SORT_BY_KEY) ?? PICKER_SORT_BY_DEFAULT.value
}
