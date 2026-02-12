

import type { Level, Region, WeatherIcon } from '@prisma/client';
import { z } from 'zod';
import { DEFAULT_SORT_VALUE, OPTIONS_ORDER_BY, OPTIONS_LEVEL_LTE, OPTIONS_RANKS, SEARCH_BAR_MAXIMUM_Q_LENGTH, OPTIONS_LEVEL_GTE, getRangesFromQuery, type OrderByOptionValue, OPTIONS_REGIONS } from '~/shared/global.utils';

const MAX_LIMIT_OF_ITEMS_TO_LOAD = 100

const LEVEL = {
    LOW: 'LOW',
    MIDDLE: 'MIDDLE',
    HIGH: 'HIGH',
} satisfies Record<Level, Level>

const WEATHER_ICON = {
    SUN: 'SUN',
    CLOUDY: 'CLOUDY',
    WIND: 'WIND',
    RAIN: 'RAIN',
    SNOW: 'SNOW',
    NULL: 'NULL',
} satisfies Record<WeatherIcon, WeatherIcon>

const mapLevelToQuery = (level: string, option: 'lte' | 'gte'): Level[] => {
    switch (option) {
        case 'lte':
            return level === 'LOW'
                ? [LEVEL.LOW]
                : [LEVEL.LOW, LEVEL.MIDDLE];
        case 'gte':
            return level === 'HIGH'
                ? [LEVEL.HIGH]
                : [LEVEL.MIDDLE, LEVEL.HIGH];
        default:
            return [];
    }
};

export const getCitiesSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional().default(1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().max(MAX_LIMIT_OF_ITEMS_TO_LOAD).optional().default(20)),
    q: z
        .string()
        .max(SEARCH_BAR_MAXIMUM_Q_LENGTH)
        .optional(),
    sort: z
        .enum(['desc', 'asc'])
        .optional()
        .default(DEFAULT_SORT_VALUE),
    orderBy: z
        .enum(OPTIONS_ORDER_BY.map(option => option.value) as [string, ...string[]])
        .optional()
        .transform(value => value as OrderByOptionValue)
        .default(OPTIONS_ORDER_BY[0].value),
    months: z
        .string(),
    weathers: z
        .union([
            z.enum(Object.values(WEATHER_ICON) as [WeatherIcon, ...WeatherIcon[]]),
            z.array(z.enum(Object.values(WEATHER_ICON) as [WeatherIcon, ...WeatherIcon[]])),
        ])
        .optional(),
    regions: z
        .union([
            z
                .enum(OPTIONS_REGIONS.map(option => option.value) as [string, ...string[]])
                .optional()
                .transform(value => value as Region),
            z.array(
                z
                    .enum(OPTIONS_REGIONS.map(option => option.value) as [string, ...string[]])
                    .optional()
                    .transform(value => value as Region)
            ),
        ])
        .optional(),
    totalScore: z
        .enum(OPTIONS_RANKS.map(({ value }) => value) as [string, ...string[]])
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    costs: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    prices: z
        .array(z.string())
        .transform(getRangesFromQuery(-Infinity, Infinity))
        .optional(),
    temperatures: z
        .array(z.string())
        .transform(getRangesFromQuery(-50, 50))
        .optional(),
    internets: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    populations: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    pollutions: z
        .enum(OPTIONS_LEVEL_LTE.map(({ value }) => value) as [string, ...string[]])
        .transform(value => mapLevelToQuery(value, 'lte'))
        .optional(),
    safety: z
        .enum(OPTIONS_LEVEL_GTE.map(({ value }) => value) as [string, ...string[]])
        .transform(value => mapLevelToQuery(value, 'gte'))
        .optional(),
});

export type GetCitiesSchema = z.infer<typeof getCitiesSchema>;

export const getCitiesBySlugSchema = z.object({
    slug: z
        .string(),
});

export type GetCitiesBySlugSchema = z.infer<typeof getCitiesBySlugSchema>;
