export const PICKER_CONTINENT_KEY = 'continent'
export const PICKER_CONTINENT_DEFAULT = 'All Continents'

export const PICKER_CONTINENT_OPTIONS = [
    PICKER_CONTINENT_DEFAULT,
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Latin America',
    'Middle East',
    'North America',
    'Oceania',
]

export type ContinentOption = typeof PICKER_CONTINENT_OPTIONS[number]
