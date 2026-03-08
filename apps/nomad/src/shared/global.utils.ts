import type { Level, Prisma, Region } from "@prisma/client";

export const DEFAULT_SORT_VALUE = 'desc'
export const SEARCH_BAR_MAXIMUM_Q_LENGTH = 120

export const OPTIONS_RANKS = [
  { value: '2', label: '⭐⭐' }, 
  { value: '3', label: '⭐⭐⭐' }, 
  { value: '4', label: '⭐⭐⭐⭐' },
]

export const OPTIONS_LEVEL_LTE = [
  { label: 'Low', value: 'LOW' }, 
  { label: 'Middle', value: 'MIDDLE' }, 
] satisfies { label: string; value: Level }[]

export const OPTIONS_LEVEL_GTE = [
  { label: 'Middle', value: 'MIDDLE' }, 
  { label: 'High', value: 'HIGH' }, 
] satisfies { label: string; value: Level }[]

const OPTIONS_ORDER_BY_MONTH_SUMMARY = [
  'costForNomadInUsd',
  'internetSpeedCity',
  'safety',
  'pollution',
  'healthCare',
  'purchasingPower',
  'propertyPriceToIncome',
  'costOfLiving',
  'trafficCommuteTime',
  'population',
  'totalScore',
] satisfies Partial<keyof Prisma.MonthSummaryOrderByWithRelationInput>[]

export type OrderByOptionValue = typeof OPTIONS_ORDER_BY_MONTH_SUMMARY[number]

export const OPTIONS_ORDER_BY = [
  { label: 'Total Score', value: 'totalScore' },
  { label: 'Cost of Living (Nomad)', value: 'costForNomadInUsd' },
  { label: 'Internet Speed', value: 'internetSpeedCity' },
  { label: 'Safety Level', value: 'safety' },
  { label: 'Pollution Level', value: 'pollution' },
  { label: 'Healthcare Quality', value: 'healthCare' },
  { label: 'Purchasing Power', value: 'purchasingPower' },
  { label: 'Property Affordability', value: 'propertyPriceToIncome' },
  { label: 'Cost of Living (Local)', value: 'costOfLiving' },
  { label: 'Traffic & Commute Time', value: 'trafficCommuteTime' },
  { label: 'Population Size', value: 'population' },
] satisfies { label: string; value: OrderByOptionValue }[]

export const REGION_SLUG_MAP = {
  'europe': 'Europe',
  'asia': 'Asia',
  'latin-america': 'LatinAmerica',
  'middle-east': 'MiddleEast',
  'north-america': 'NorthAmerica',
  'africa': 'Africa',
  'oceania': 'Oceania',
} as const satisfies Record<string, Region>

export const REGION_SLUGS = Object.keys(REGION_SLUG_MAP) as Array<keyof typeof REGION_SLUG_MAP>

export const OPTIONS_REGIONS = REGION_SLUGS.map(slug => ({
  value: REGION_SLUG_MAP[slug],
})) satisfies { value: Region }[]

export const getUserCurrentMonthString = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthString = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;

    return currentMonthString
}

export const formatNumber = (number: number) => {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'b';
    }

    if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'm';
    }

    if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'k';
    }

    return number.toString();
}

export const getRangesFromQuery = (defaultMin: number, defaultMax: number) => (tempValues: string[]) => {
  const min = tempValues.find((val) => val.startsWith('gte:'))?.split(':')[1];
  const max = tempValues.find((val) => val.startsWith('lte:'))?.split(':')[1];

  return {
    min: Number(min ?? defaultMin),
    max: Number(max ?? defaultMax),
  };
}

export const buildCompareSlug = (slugA: string, slugB: string) => {
  const [first, second] = slugA < slugB ? [slugA, slugB] : [slugB, slugA];
  return `${first}-vs-${second}`;
}

// 26 Schengen Area member country codes (ISO 3166-1 alpha-2)
export const SCHENGEN_COUNTRY_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT',
  'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH',
])

// Locale-specific path segments for the /regions/ prefix
export const REGION_PATH_BY_LOCALE: Partial<Record<string, string>> = {
  pl: 'regiony',
  es: 'regiones',
  de: 'regionen',
  pt: 'regioes',
  tr: 'bolgeler',
  it: 'regioni',
}

// 'all' is reserved for the index page (/safe-cities), not a [context] route
export const SAFE_CITIES_SLUG_MAP = {
  'all': null,
  'women': null,
  'europe': 'Europe',
  'asia': 'Asia',
  'latin-america': 'LatinAmerica',
  'middle-east': 'MiddleEast',
  'north-america': 'NorthAmerica',
  'africa': 'Africa',
  'oceania': 'Oceania',
} as const

// Slugs used for /safe-cities/[context] routes (excludes 'all' — that's the index page)
export const SAFE_CITIES_CONTEXT_SLUGS = (
  Object.keys(SAFE_CITIES_SLUG_MAP) as Array<keyof typeof SAFE_CITIES_SLUG_MAP>
).filter((s) => s !== 'all')

export const SAFE_CITIES_PATH_BY_LOCALE: Partial<Record<string, string>> = {
  pl: 'bezpieczne-miasta',
  es: 'ciudades-seguras',
  de: 'sichere-staedte',
  pt: 'cidades-seguras',
  fr: 'villes-sures',
  tr: 'guvenli-sehirler',
  it: 'citta-sicure',
}

// Locale-specific path segments for the /countries/ prefix
export const COUNTRY_PATH_BY_LOCALE: Partial<Record<string, string>> = {
  pl: 'kraje',
  es: 'paises',
  de: 'laender',
  pt: 'paises',
  fr: 'pays',
  tr: 'ulkeler',
  it: 'paesi',
}
