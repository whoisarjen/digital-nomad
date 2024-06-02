import type { Weather } from '@prisma/client'
import { isNil } from 'lodash'
import { Sun, Cloudy, Wind, CloudRain, Snowflake } from 'lucide-react'

const SUN_CODES = [0, 1, 2, 3]
const CLOUDY_CODES = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49
]
const WIND_CODES = [18, 19]
const RAIN_CODES = [
    20, 21, 23, 24, 25, 27, 29, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 80, 81, 82, 83, 84, 87, 88, 89, 90, 91, 92,
    95, 96, 97, 98, 99
]
const SNOW_CODES = [22, 26, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 85, 86, 93, 94]

type IconWeatherProps = {
    weatherCode: number | null
    size?: number
}

export const IconWeather = ({ weatherCode, ...props }: IconWeatherProps) => {
    if (isNil(weatherCode)) {
        return null
    }

    if (SUN_CODES.includes(weatherCode)) {
        return <Sun {...props} />
    }

    if (CLOUDY_CODES.includes(weatherCode)) {
        return <Cloudy {...props} />
    }

    if (WIND_CODES.includes(weatherCode)) {
        return <Wind {...props} />
    }

    if (RAIN_CODES.includes(weatherCode)) {
        return <CloudRain {...props} />
    }

    if (SNOW_CODES.includes(weatherCode)) {
        return <Snowflake {...props} />
    }

    return null
}

export const getTheMostCommonWeatherCode = (weathers: Weather[]) => {
    const weatherCodes = weathers.map(({ weatherCode }) => weatherCode)
    const counts: Record<string, number> = {};

    weatherCodes.forEach(code => {
        if (code !== null && code !== undefined) {
            const key = code.toString();
            counts[key] = (counts[key] || 0) + 1;
        }
    });

    const mostCommonCode = Object.keys(counts).reduce((a, b) => {
        const countA = counts[a];
        const countB = counts[b];
        return countA > countB ? a : b;
    }, '');

    return mostCommonCode !== '' ? Number(mostCommonCode) : null;
}
