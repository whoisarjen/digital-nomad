export const PICKER_ORDER_KEY = 'sort'

export const PICKER_ORDER_DEFAULT = {
    label: 'Shrinking',
    value: 'desc',
}
export const PICKER_ORDER_OPTIONS = [
    PICKER_ORDER_DEFAULT,
    {
        label: 'Growing',
        value: 'asc',
    },
]

export const getCurrentOrder = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_ORDER_KEY) ?? PICKER_ORDER_DEFAULT.value
}
