export const PICKER_WIFI_KEY = 'wifi'
export const DEFAULT_WIFI = '0'
export const WIFI = [
    DEFAULT_WIFI,
    '10',
    '20',
    '30',
    '50',
    '80',
    '130',
]

export const getCurrentWifi = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_WIFI_KEY) ?? DEFAULT_WIFI
}