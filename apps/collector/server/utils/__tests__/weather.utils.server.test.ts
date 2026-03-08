import { describe, it, expect } from 'vitest'
import { WeatherIcon } from '@prisma/client'
import { getIconBasedOnWeatherCode } from '../weather.utils.server'

describe('getIconBasedOnWeatherCode', () => {
  it('returns SUN for clear sky codes', () => {
    expect(getIconBasedOnWeatherCode(0)).toBe(WeatherIcon.SUN)
    expect(getIconBasedOnWeatherCode(3)).toBe(WeatherIcon.SUN)
  })

  it('returns CLOUDY for overcast codes', () => {
    expect(getIconBasedOnWeatherCode(4)).toBe(WeatherIcon.CLOUDY)
    expect(getIconBasedOnWeatherCode(49)).toBe(WeatherIcon.CLOUDY)
  })

  it('returns RAIN for precipitation codes', () => {
    expect(getIconBasedOnWeatherCode(60)).toBe(WeatherIcon.RAIN)
    expect(getIconBasedOnWeatherCode(95)).toBe(WeatherIcon.RAIN)
  })

  it('returns SNOW for snow codes', () => {
    expect(getIconBasedOnWeatherCode(70)).toBe(WeatherIcon.SNOW)
    expect(getIconBasedOnWeatherCode(85)).toBe(WeatherIcon.SNOW)
  })

  it('returns NULL for unknown codes', () => {
    expect(getIconBasedOnWeatherCode(999)).toBe(WeatherIcon.NULL)
  })
})
