import { Prisma, WeatherIcon } from '@prisma/client';
import { z } from 'zod';
import { getCitiesSchema } from '~/shared/global.schema';
import { formatNumber } from '~/shared/global.utils';
import { getServerSession } from '#auth';

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
                        name: {
                            contains: query.q,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    country: {
                        nameChinese: {
                            contains: query.q,
                            mode: 'insensitive',
                        },
                    },
                },
            ]
        })
    }

    if (query.regions) {
        AND.push({ country: { region: { in: (Array.isArray(query.regions) ? query.regions : query.regions ? [query.regions] : []) } } })
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
                        in: [...(Array.isArray(query.weathers) ? query.weathers : query.weathers ? [query.weathers] : []) as WeatherIcon[], 'NULL']
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

    if (query.english_proficiency) {
        AND.push({
            country: { englishProficiency: { gte: query.english_proficiency } }
        })
    }

    if (query.lifestyle?.length) {
        for (const preset of query.lifestyle) {
            if (preset === 'budget_food') {
                AND.push({ mealInexpensiveRestaurant: { lt: 5 } })
            } else if (preset === 'cheap_beer') {
                AND.push({ domesticBeerRestaurant: { lt: 2 } })
            } else if (preset === 'fast_internet') {
                AND.push({ internetSpeedCity: { gte: 60 } })
            } else if (preset === 'affordable_gym') {
                AND.push({ fitnessClubMonthly: { lt: 30 } })
            } else if (preset === 'budget_rent') {
                AND.push({ apartment1brOutside: { lt: 500 } })
            } else if (preset === 'nomad_bundle') {
                AND.push({
                    apartment1brOutside: { lt: 800, not: null },
                    fitnessClubMonthly: { not: null },
                    internet60mbps: { not: null },
                })
            }
        }
    }

    if (AND.length) {
        return { AND }
    }

    return undefined
}

export default defineEventHandler(async (event) => {
    const validatedQuery = await getValidatedQuery(event, (body) => getCitiesSchema.parse(body));
    let where = getCityPrismaQuery(validatedQuery)

    if (validatedQuery.favoritesOnly) {
        const session = await getServerSession(event)
        const userId = (session?.user as any)?.id
        const favFilter: Prisma.CityWhereInput = {
            favorites: userId ? { some: { userId } } : { none: {} },
        }
        if (where?.AND) {
            where.AND.push(favFilter)
        } else {
            where = { AND: [favFilter] }
        }
    }

    const {
      page,
      limit,
      sort,
      orderBy,
    } = validatedQuery;

    const [monthSummaries, count] = await Promise.all([
        prisma.monthSummary.findMany({
            where: {
                month: validatedQuery.months,
                city: where
            },
            orderBy: orderBy === 'totalScore'
                ? [
                    {
                        [orderBy]: sort,
                    },
                    {
                        popularity: sort,
                    },
                    {
                        weatherIcon: sort === 'asc' ? 'desc' : 'asc',
                    },
                    {
                        region: sort === 'asc' ? 'desc' : 'asc',
                    },
                    {
                        safety: sort,
                    },
                    {
                        costForNomadInUsd: sort === 'asc' ? 'desc' : 'asc',
                    },
                ]
                : {
                    [orderBy]: sort,
                },
            select: {
                city: {
                    select: {
                        slug: true,
                        name: true,
                        country: { select: { name: true } },
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
                                region: true,
                            },
                            where: {
                                month: validatedQuery.months,
                            },
                            take: 1,
                        },
                    },
                }
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.city.count({
            where,
        }),
    ])

    const cities = monthSummaries.map(option => option.city)

    return {
        data: cities.map(({ monthSummary, country: countryData, ...city }) => ({
            ...city,
            country: countryData.name,
            population: formatNumber(city.population),
            weatherIcon: monthSummary[0]?.weatherIcon,
            temperature: monthSummary[0]?.temperature2mMax,
            totalScore: monthSummary[0]?.totalScore,
            region: monthSummary[0]?.region,
        })),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
