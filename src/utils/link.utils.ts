export const SEARCH_PARAM_KEY_PAGINATION = 'page'

export const getSearchParam = (searchParams: URLSearchParams, paramKey: string) => {
    const result = new URLSearchParams(searchParams)
    return result.get(paramKey)
}

export const getCurrentPageNumber = (searchParams: URLSearchParams) => {
    return Number(getSearchParam(searchParams, SEARCH_PARAM_KEY_PAGINATION) ?? "1")
}

export const getNextSearchParams = (searchParams: URLSearchParams, paramKey: string, value: string | number) => {
    const result = new URLSearchParams(searchParams)
    result.set(paramKey, value.toString())
    return `?${result.toString()}`
}
