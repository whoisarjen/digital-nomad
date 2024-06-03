import type { Weather } from "@prisma/client"
import type { ReadonlyURLSearchParams } from "next/navigation"

export const SUN_CODES = [0, 1, 2, 3]
export const CLOUDY_CODES = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49
]
export const WIND_CODES = [18, 19]
export const RAIN_CODES = [
    20, 21, 23, 24, 25, 27, 29, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 80, 81, 82, 83, 84, 87, 88, 89, 90, 91, 92,
    95, 96, 97, 98, 99
]
export const SNOW_CODES = [22, 26, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 85, 86, 93, 94]

export const PICKER_WEATHER_KEY = 'weather'
export const DEFAULT_WEATHER = {
    label: 'All weathers',
    value: 'all',
    codes: [
        ...SUN_CODES,
        ...CLOUDY_CODES,
        ...WIND_CODES,
        ...RAIN_CODES,
        ...SNOW_CODES,
    ],
}

export const WEATHERS = [
    DEFAULT_WEATHER,
    {
        label: 'Sunny',
        value: 'sunny',
        codes: SUN_CODES,
    },
    {
        label: 'Cloudy',
        value: 'cloudy',
        codes: CLOUDY_CODES,
    },
    {
        label: 'Windy',
        value: 'windy',
        codes: WIND_CODES,
    },
    {
        label: 'Rainy',
        value: 'rainy',
        codes: RAIN_CODES,
    },
    {
        label: 'Snowy',
        value: 'snowy',
        codes: SNOW_CODES,
    },
]

export const getCurrentWeatherCodes = (searchParams: ReadonlyURLSearchParams | URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return WEATHERS.find(({ value }) => value === params.get(PICKER_WEATHER_KEY)) ?? DEFAULT_WEATHER
}

export const getMostCommonWeatherCode = (weathers: Weather[]) => {
    const weatherCodes = weathers.map(({ weatherCode }) => weatherCode);
    const counts = {
        SUN: 0,
        CLOUDY: 0,
        WIND: 0,
        RAIN: 0,
        SNOW: 0
    };
    const codeCounts: Record<number, number> = {};

    weatherCodes.forEach(code => {
        if (code !== null && code !== undefined) {
            codeCounts[code] = (codeCounts[code] || 0) + 1;

            if (SUN_CODES.includes(code)) {
                counts.SUN += 1;
            } else if (CLOUDY_CODES.includes(code)) {
                counts.CLOUDY += 1;
            } else if (WIND_CODES.includes(code)) {
                counts.WIND += 1;
            } else if (RAIN_CODES.includes(code)) {
                counts.RAIN += 1;
            } else if (SNOW_CODES.includes(code)) {
                counts.SNOW += 1;
            }
        }
    });

    const mostCommonGroup = Object.keys(counts).reduce((a, b) => counts[a as unknown as keyof typeof counts] > counts[b as unknown as keyof typeof counts] ? a : b);

    if (counts[mostCommonGroup as unknown as keyof typeof counts] === 0) {
        return null;
    }

    const groupCodes = {
        SUN: SUN_CODES,
        CLOUDY: CLOUDY_CODES,
        WIND: WIND_CODES,
        RAIN: RAIN_CODES,
        SNOW: SNOW_CODES
    };

    return groupCodes[mostCommonGroup as unknown as keyof typeof groupCodes][0]
};
