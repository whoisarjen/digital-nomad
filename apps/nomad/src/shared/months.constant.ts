export const MONTH_SLUG_MAP = {
  january:   '01',
  february:  '02',
  march:     '03',
  april:     '04',
  may:       '05',
  june:      '06',
  july:      '07',
  august:    '08',
  september: '09',
  october:   '10',
  november:  '11',
  december:  '12',
} as const

export type MonthSlug = keyof typeof MONTH_SLUG_MAP
export type MonthValue = (typeof MONTH_SLUG_MAP)[MonthSlug]

export const MONTH_SLUGS = Object.keys(MONTH_SLUG_MAP) as MonthSlug[]

export const MONTH_DISPLAY_NAMES: Record<MonthSlug, string> = {
  january:   'January',
  february:  'February',
  march:     'March',
  april:     'April',
  may:       'May',
  june:      'June',
  july:      'July',
  august:    'August',
  september: 'September',
  october:   'October',
  november:  'November',
  december:  'December',
}
