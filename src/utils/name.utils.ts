export const PICKER_NAME_KEY = 'name'

export const getCurrentName = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_NAME_KEY) ?? undefined
}
