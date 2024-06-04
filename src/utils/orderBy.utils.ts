export const PICKER_ORDER_BY_KEY = 'orderBy'

export const PICKER_ORDER_BY_DEFAULT = {
    label: 'Score',
    value: 'totalScore',
}

export const PICKER_ORDER_BY_OPTIONS = [
    PICKER_ORDER_BY_DEFAULT,
    {
        label: 'Cost',
        value: 'cost',
    },
    {
        label: 'WiFi',
        value: 'wifi',
    },
    {
        label: 'Name',
        value: 'name',
    },
]

export const getCurrentOrderBy = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_ORDER_BY_KEY) ?? PICKER_ORDER_BY_DEFAULT.value
}
