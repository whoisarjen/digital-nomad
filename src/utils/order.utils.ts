export const PICKER_ORDER_KEY = 'sort'

export type OrderOption = {
    label: string
    value: 'desc' | 'asc'
}

export const PICKER_ORDER_DEFAULT = {
    label: 'Shrinking',
    value: 'desc',
} as const satisfies OrderOption

export const PICKER_ORDER_OPTIONS = [
    PICKER_ORDER_DEFAULT,
    {
        label: 'Growing',
        value: 'asc',
    },
] as const satisfies OrderOption[]

export const getCurrentOrder = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_ORDER_KEY) ?? PICKER_ORDER_DEFAULT.value
}
