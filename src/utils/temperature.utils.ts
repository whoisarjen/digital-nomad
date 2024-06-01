import { type ReadonlyURLSearchParams } from "next/navigation"

export const PICKER_TEMPERATURE_MIN_KEY = 'temperatureMin'
export const PICKER_TEMPERATURE_MAX_KEY = 'temperatureMax'

// Also affect the range of slider
export const DEFAULT_TEMPERATURE_MIN = -30
export const DEFAULT_TEMPERATURE_MAX = 100

export const getCurrentTemperatureMin = (searchParams: ReadonlyURLSearchParams | URLSearchParams): number => {
    const result = new URLSearchParams(searchParams)
    return Number(result.get(PICKER_TEMPERATURE_MIN_KEY) ?? DEFAULT_TEMPERATURE_MIN) 
}

export const getCurrentTemperatureMax = (searchParams: ReadonlyURLSearchParams | URLSearchParams): number => {
    const result = new URLSearchParams(searchParams)
    return Number(result.get(PICKER_TEMPERATURE_MAX_KEY) ?? DEFAULT_TEMPERATURE_MAX) 
}
