import { Level, Prisma, WeatherIcon } from '@prisma/client';
import _ from 'lodash';
import { z } from 'zod';
import { DEFAULT_SORT_VALUE, formatNumber, OPTIONS_ORDER_BY, OPTIONS_LEVEL_LTE, OPTIONS_RANKS, SEARCH_BAR_MAXIMUM_Q_LENGTH, OPTIONS_LEVEL_GTE, getTemperaturesFromQuery } from '~/shared/global.utils';

const MAX_LIMIT_OF_ITEMS_TO_LOAD = 100

const mapLevelToQuery = (level: string, option: 'lte' | 'gte'): Level[] => {
    switch (option) {
        case 'lte':
            return level === 'LOW'
                ? [Level.LOW]
                : [Level.LOW, Level.MIDDLE];
        case 'gte':
            return level === 'HIGH'
                ? [Level.HIGH]
                : [Level.MIDDLE, Level.HIGH];
        default:
            console.warn(`Unexpected value in mapLevelToQuery: ${level} - ${option}`);
            return [];
    }
};

const getCitiesSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional().default(1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().max(MAX_LIMIT_OF_ITEMS_TO_LOAD).optional().default(40)),
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
        .default(OPTIONS_ORDER_BY[0].value),    
    months: z
        .string(),
    weathers: z
        .union([
            z.enum(Object.values(WeatherIcon) as [WeatherIcon, ...WeatherIcon[]]),
            z.array(z.enum(Object.values(WeatherIcon) as [WeatherIcon, ...WeatherIcon[]])),
        ])
        .optional(),
    regions: z
        .union([
            z.string(),
            z.array(z.string()),
        ])
        .optional(),
    total_scores: z
        .enum(OPTIONS_RANKS.map(({ value }) => value) as [string, ...string[]])
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    costs: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    temperatures: z
        .array(z.string())
        .transform(getTemperaturesFromQuery)
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

const getCityPrismaQuery = (query: z.infer<typeof getCitiesSchema>) => {
    const AND: Prisma.CityWhereInput[] = []

    if (query.q) {
        AND.push({
            OR: [
                {
                    name: {
                        contains: query.q,
                        mode: 'insensitive',
                    },
                },
                {
                    nameChinese: {
                        contains: query.q,
                        mode: 'insensitive',
                    },
                },
                {
                    country: {
                        contains: query.q,
                        mode: 'insensitive',
                    },
                },
                {
                    countryChinese: {
                        contains: query.q,
                        mode: 'insensitive',
                    },
                },
            ]
        })
    }

    if (query.regions) {
        AND.push({ region: { in: _.concat(query.regions) } })
    }

    if (query.total_scores) {
        AND.push({ totalScore: { gte: query.total_scores } })
    }

    if (query.costs) {
        AND.push({
            costForNomadInUsd: { lte: query.costs }
        })
    }

    if (query.internets) {
        AND.push({
            internetSpeedCity: { gte: query.internets }
        })
    }

    if (query.populations) {
        AND.push({
            population: { gte: query.populations }
        })
    }

    if (query.months) {
        if (query.weathers) {
            AND.push({
                weathersAverage: {
                    some: {
                        weatherIcon: {
                            in: [..._.concat(query.weathers) as WeatherIcon[], 'NULL']
                        },
                        month: query.months,
                    }
                }
            })
        }

        if (query.temperatures) {
            AND.push({
                weathersAverage: {
                    some: {
                        temperature2mMax: { 
                            gte: query.temperatures.min,
                            lte: query.temperatures.max,
                        },
                        month: query.months
                    }
                }
            })
        }
    }

    if (query.pollutions) {
        AND.push({
            pollution: {
                in: query.pollutions
            }
        })
    }

    if (query.safety) {
        AND.push({
            safety: {
                in: query.safety
            }
        })
    }

    if (AND.length) {
        return { AND }
    }

    return undefined
}

export default defineEventHandler(async (event) => {
    const validatedQuery = await getValidatedQuery(event, (body) => getCitiesSchema.parse(body));
    const where = getCityPrismaQuery(validatedQuery)
  
    const {
      page,
      limit,
      sort,
      orderBy,
    } = validatedQuery;

    const [cities, count] = await Promise.all([
        prisma.city.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                [orderBy]: sort,
            },
            select: {
                slug: true,
                name: true,
                country: true,
                costForNomadInUsd: true,
                population: true,
                image: true,
                internetSpeed: true,
                pollution: true,
                safety: true,
                weathersAverage: {
                    select: {
                        weatherIcon: true,
                        temperature2mMax: true,
                    },
                    where: {
                        month: validatedQuery.months,
                    },
                    take: 1,
                },
            },
        }),
        prisma.city.count({
            where,
        }),
    ])

    return {
        data: cities.map(({ weathersAverage, ...city }) => ({
            ...city,
            population: formatNumber(city.population),
            weatherIcon: weathersAverage[0]?.weatherIcon,
            temperature: weathersAverage[0]?.temperature2mMax,
        })),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
