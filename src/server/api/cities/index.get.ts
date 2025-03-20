import { Prisma, WeatherIcon } from '@prisma/client';
import _ from 'lodash';
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
    weathers: z
        .enum(Object.values(WeatherIcon) as [WeatherIcon, ...WeatherIcon[]])
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

const getCityPrismaQuery = (query: z.infer<typeof getCitiesSchema>) => {
    const AND: Prisma.CityWhereInput[] = []

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
                        OR: [
                            {
                                weatherIcon: query.weathers,
                                month: query.months,
                            },
                            {
                                weatherIcon: 'NULL',
                                month: query.months,
                            },
                        ]
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
    } = validatedQuery;

    const [cities, count] = await Promise.all([
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
        data: cities.map(({ temperatureC, weathersAverage, ...city }) => ({ ...city, weathersAverage, temperature: weathersAverage[0]?.temperature2mMax ?? temperatureC })),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
