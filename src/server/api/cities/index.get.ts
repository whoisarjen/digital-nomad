import { Prisma, WeatherIcon } from '@prisma/client';
import _ from 'lodash';
import { z } from 'zod';
import { getCitiesSchema } from '~/shared/global.schema';
import { formatNumber, OPTIONS_ORDER_BY_MONTH_SUMMARY } from '~/shared/global.utils';

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

    if (query.prices) {
        AND.push({
            costForNomadInUsd: {
                gte: query.prices.min,
                lte: query.prices.max,
            },
        })
    }

    if (query.totalScore) {
        AND.push({
            monthSummary: {
                some: {
                    totalScore: {
                        gte: query.totalScore,
                    },
                    month: query.months,
                }
            },
        })
    }

    if (query.weathers) {
        AND.push({
            monthSummary: {
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
            monthSummary: {
                some: {
                    temperature2mMean: { 
                        gte: query.temperatures.min,
                        lte: query.temperatures.max,
                    },
                    month: query.months
                }
            }
        })
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

    const select = {
        slug: true,
        name: true,
        country: true,
        costForNomadInUsd: true,
        population: true,
        image: true,
        internetSpeedCity: true,
        pollution: true,
        safety: true,
        monthSummary: {
            select: {
                weatherIcon: true,
                temperature2mMax: true,
                totalScore: true,
            },
            where: {
                month: validatedQuery.months,
            },
            take: 1,
        },
    } satisfies Prisma.CitySelect

    const [cities, count] = await (async () => {
        if (OPTIONS_ORDER_BY_MONTH_SUMMARY.includes(orderBy as unknown as typeof OPTIONS_ORDER_BY_MONTH_SUMMARY[number])) {
            const response = await Promise.all([
                prisma.monthSummary.findMany({
                    where: {
                        month: validatedQuery.months,
                    },
                    orderBy: {
                        [orderBy]: sort
                    },
                    select: {
                        city: {
                            select,
                        }
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.city.count({
                    where,
                }),
            ])

            return [response[0].flatMap(option => option.city), response[1]]
        }

        return await Promise.all([
            prisma.city.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [orderBy]: sort
                },
                select,
            }),
            prisma.city.count({
                where,
            }),
        ])
    })()

    return {
        data: cities.map(({ monthSummary, ...city }) => ({
            ...city,
            population: formatNumber(city.population),
            weatherIcon: monthSummary[0]?.weatherIcon,
            temperature: monthSummary[0]?.temperature2mMax,
            totalScore: monthSummary[0]?.totalScore,
        })),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
