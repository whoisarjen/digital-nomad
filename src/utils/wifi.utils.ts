export const PICKER_WIFI_KEY = 'wifi'

export const getCurrentWifi = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return Number(params.get(PICKER_WIFI_KEY) ?? "0")
}