export const PICKER_MONTHS_KEY = 'month'

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const getMonth = () => MONTHS[new Date().getMonth()]

export const getCurrentMonth = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_MONTHS_KEY) ?? getMonth()
}
