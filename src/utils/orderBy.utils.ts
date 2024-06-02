export const PICKER_ORDER_BY_KEY = 'orderBy'

export const DEFAULT_ORDER_BY = {
    label: 'Score DESC',
    value: 'score_desc',
}

export const OPTIONS_ORDER_BY = [
    DEFAULT_ORDER_BY,
    {
        label: 'Score ASC',
        value: 'score_asc',
    },
    {
        label: 'Cost DESC',
        value: 'cost_desc',
    },
    {
        label: 'Cost ASC',
        value: 'cost_asc',
    },
    {
        label: 'WiFi DESC',
        value: 'wifi_desc',
    },
    {
        label: 'WiFi ASC',
        value: 'wifi_asc',
    },
    {
        label: 'Name DESC',
        value: 'name_desc',
    },
    {
        label: 'Name ASC',
        value: 'name_asc',
    },
]

export const getCurrentOrderBy = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_ORDER_BY_KEY) ?? DEFAULT_ORDER_BY.value
}
