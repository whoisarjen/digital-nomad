import { Prisma } from '@prisma/client';
import _, { last } from 'lodash';
import { z } from 'zod';

const RANGE_BREAK_SYMBOL = ':'

const getOptions = (array: number[], numOptionsRaw: number) => {
    const numOptions = numOptionsRaw + 2 // we need one more to drop 0 later (we already have 0 as all options)
    const sortedArray = [...new Set([...array])].sort((a, b) => a - b);

    const result = [sortedArray[0], sortedArray[sortedArray.length - 1]];

    const step = Math.floor((sortedArray.length - 2) / (numOptions - 2));
  
    for (let i = 1; i < numOptions - 1; i++) {
        const index = 1 + i * step;
        result.splice(i, 0, sortedArray[index]);
    }

    return {
        options: numOptionsRaw > result.length ? result : result.slice(1, result.length - 1),
        min: sortedArray.at(0),
        max: sortedArray.at(-1),
    };
}

const getSingleOptions = (array: number[], numOptionsRaw: number, transformLabel?: (option: string) => string) => {
    const { options } = getOptions(array, numOptionsRaw)

    return options.map(option => ({
        value: option.toString(),
        label: transformLabel?.(option.toString()) ?? option.toString(),
    }))
}

const getRangeOptions = (array: number[], numOptionsRaw: number, transformLabel: (option: [any, any]) => string) => {
    const { options: optionsRaw, min, max } = getOptions(array, numOptionsRaw)
    const options = [...new Set([min, ...optionsRaw, max])]

    const ranges = [];
    for (let i = 0; i < options.length - 1; i++) {
        if (i + 1 === options.length) {
            break
        }

        const start = options[i];
        const end = options[i + 1];
        ranges.push({
            value: `${start}${RANGE_BREAK_SYMBOL}${end}`,
            label: transformLabel([start, end]),
        });
    }

    return ranges;
};

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
        .pipe(z.number().positive().max(MAX_LIMIT_OF_ITEMS_TO_LOAD).optional().default(20)),
    months: z
        .string(),
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

const getFirstAndLastDayOfMonth = (month: string) => {
    const firstDayOfMonth = new Date(`2024-${month}-01`)
    const lastDayOfMonth = new Date(firstDayOfMonth)
    lastDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1)
    lastDayOfMonth.setDate(0)

    return {
        firstDayOfMonth,
        lastDayOfMonth,
    }
}

const getCityPrismaQuery = (query: z.infer<typeof getCitiesSchema>) => {
    const prismaQuery: Prisma.CityFindManyArgs['where'] = {}

    if (query.regions) {
        prismaQuery.region = query.regions
    }

    if (query.costs) {
        prismaQuery.costForNomadInUsd = {
            lte: query.costs
        }
    }

    if (query.internets) {
        prismaQuery.internetSpeedCity = {
            gte: query.internets
        }
    }

    if (query.populations) {
        prismaQuery.population = {
            gte: query.populations
        }
    }

    if (query.months) {
        if (query.temperatures) {
            const [gte, lte] = query.temperatures.split(RANGE_BREAK_SYMBOL)
            const { firstDayOfMonth, lastDayOfMonth } = getFirstAndLastDayOfMonth(query.months)

            prismaQuery.weathers = {
                some: {
                    temperature2mMean: {
                        gte,
                        lte,
                    },
                    date: {
                        gte: firstDayOfMonth,
                        lte: lastDayOfMonth,
                    },
                }
            }
        }
    }

    return prismaQuery
}

export default defineEventHandler(async (event) => {
    const validatedQuery = await getValidatedQuery(event, (body) => getCitiesSchema.parse(body));
    const where = getCityPrismaQuery(validatedQuery)
  
    const {
      page,
      limit,
    } = validatedQuery;

    const { firstDayOfMonth, lastDayOfMonth } = getFirstAndLastDayOfMonth(validatedQuery.months)

    const [cities, count, allCities] = await Promise.all([
        prisma.city.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                totalScore: 'desc',
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
                        avgTemperatureC: true,
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
        prisma.city.findMany({
            select: {
                region: true,
                population: true,
                internetSpeed: true,
                costForNomadInUsd: true,
                weathersAverage: {
                    select: {
                        avgTemperatureC: true,
                    },
                }
            },
        }),
    ])

    const regions = new Set<string>()
    const populations = new Set<number>()
    const internetSpeed = new Set<number>()
    const costForNomadInUsd = new Set<number>()
    const temperatures = new Set<number>(allCities.flatMap(city => city.weathersAverage.map(option => parseInt(option.avgTemperatureC.toString()))))

    allCities.forEach(city => {
        regions.add(city.region)
        populations.add(city.population)
        internetSpeed.add(city.internetSpeed)
        costForNomadInUsd.add(parseInt(city.costForNomadInUsd.toString()))
    })

    return {
        filters: {
            regions: {
                type: 'single',
                operation: 'equals',
                options: [...regions].map(option => ({
                    label: option,
                    value: option,
                })),
            },
            // ranks: {
            //     type: 'single',
            //     operation: 'gte',
            //     options: [1, 2, 3, 4, 5],
            // },
            costs: {
                type: 'single',
                operation: 'lte',
                options: getSingleOptions([...costForNomadInUsd], 5, option => `${option}$`),
            },
            temperatures: {
                type: 'single',
                operation: 'range',
                options: getRangeOptions([...temperatures], 5, ([start, end]) => `${start} to ${end}°C`),
            },
            internets: {
                type: 'single',
                operation: 'gte',
                options: getSingleOptions([...internetSpeed], 5, option => `${option}Mb/s`),
            },
            // populations: {
            //     type: 'single',
            //     operation: 'gte',
            //     options: getSingleOptions([...populations], 5),
            // },
        } as const,
        cities: cities.map(({ temperatureC, weathersAverage, ...city }) => ({ ...city, temperature: weathersAverage[0]?.avgTemperatureC ?? temperatureC })),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
