export const PICKER_MONTH_KEY = 'month'

export const PICKER_MONTH_OPTIONS = [
    {
        label: 'January',
        value: '1',
    },
    {
        label: 'February',
        value: '2',
    },
    {
        label: 'March',
        value: '3',
    },
    {
        label: 'April',
        value: '4',
    },
    {
        label: 'May',
        value: '5',
    },
    {
        label: 'June',
        value: '6',
    },
    {
        label: 'July',
        value: '7',
    },
    {
        label: 'August',
        value: '8',
    },
    {
        label: 'September',
        value: '9',
    },
    {
        label: 'October',
        value: '10',
    },
    {
        label: 'November',
        value: '11',
    },
    {
        label: 'December',
        value: '12',
    },
] as const

export type MonthOption = typeof PICKER_MONTH_OPTIONS[number]['value']

export const PICKER_MONTH_DEFAULT = PICKER_MONTH_OPTIONS[new Date().getMonth()]

export const getCurrentMonth = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_MONTH_KEY) ?? PICKER_MONTH_DEFAULT.value
}

export const isToday = (date = '') => {
    const today = new Date();

    if (today.toDateString() === new Date(date)?.toDateString()) {
        return true;
    }
  
    return false;
}
