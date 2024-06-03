export const SEARCH_PARAM_KEY_PAGINATION = 'page'

export const getSearchParam = (searchParams: URLSearchParams, paramKey: string) => {
    const params = new URLSearchParams(searchParams)
    return params.get(paramKey) ?? undefined
}

export const getCurrentPageNumber = (searchParams: URLSearchParams) => {
    return Number(getSearchParam(searchParams, SEARCH_PARAM_KEY_PAGINATION) ?? "1")
}

export const getNextSearchParams = (searchParams: URLSearchParams, paramKey: string, value: string | number) => {
    const params = new URLSearchParams(searchParams)
    params.set(paramKey, value.toString())

    if (paramKey !== SEARCH_PARAM_KEY_PAGINATION) {
        params.delete(SEARCH_PARAM_KEY_PAGINATION)
    }

    return `?${params.toString()}`
}

export const getNextSearchParamsWithoutSelectedKey = (searchParams: URLSearchParams, paramKey: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(paramKey)

    if (paramKey !== SEARCH_PARAM_KEY_PAGINATION) {
        params.delete(SEARCH_PARAM_KEY_PAGINATION)
    }

    return `?${params.toString()}`
}
