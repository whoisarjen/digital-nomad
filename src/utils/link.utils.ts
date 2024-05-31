export const getSearchParam = (searchParams: URLSearchParams, paramKey: string) => {
    const result = new URLSearchParams(searchParams)
    return result.get(paramKey)
}

export const getCurrentPageNumber = (searchParams: URLSearchParams, paramKey = 'page') => {
    return Number(getSearchParam(searchParams, paramKey) ?? "1")
}

export const getNextSearchParams = (searchParams: URLSearchParams, paramKey: string, value: string | number) => {
    const result = new URLSearchParams(searchParams)
    result.set(paramKey, value.toString())
    return `?${result.toString()}`
}
