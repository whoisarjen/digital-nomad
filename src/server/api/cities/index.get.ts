import { Prisma, WeatherIcon } from '@prisma/client';
import _ from 'lodash';
import { z } from 'zod';
import { RANGE_BREAK_SYMBOL } from './filters.get'; 
import { DEFAULT_SORT_VALUE, formatNumber, ORDER_BY_OPTIONS, SEARCH_BAR_MAXIMUM_Q_LENGTH } from '~/shared/global.utils';

const MAX_LIMIT_OF_ITEMS_TO_LOAD = 100

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
        .enum(ORDER_BY_OPTIONS.map(option => option.value) as [string, ...string[]])
        .optional()
        .default(ORDER_BY_OPTIONS[0].value),    
    months: z
        .string(),
    weathers: z
        .union([
            z.enum(Object.values(WeatherIcon) as [WeatherIcon, ...WeatherIcon[]]),
            z.array(z.enum(Object.values(WeatherIcon) as [WeatherIcon, ...WeatherIcon[]])),
        ])
        .optional(),
    regions: z
        .string()
        .optional(),
    costs: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    temperatures: z
        .string()
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
        AND.push({ region: query.regions })
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
            const [gte, lte] = query.temperatures.split(RANGE_BREAK_SYMBOL)

            AND.push({
                weathersAverage: {
                    some: {
                        temperature2mMax: { 
                            gte: Number(gte), 
                            lte: Number(lte) 
                        },
                        month: query.months
                    }
                }
            })
        }
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
                temperatureC: true,
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
        data: cities.map(({ temperatureC, weathersAverage, ...city }) => ({
            ...city,
            population: formatNumber(city.population),
            weathersAverage,
            temperature: weathersAverage[0]?.temperature2mMax ?? temperatureC,
        })),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
