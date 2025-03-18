import { City, Prisma } from '@prisma/client';
import _ from 'lodash';
import { z } from 'zod';

const getOptions = (array: number[], numOptionsRaw: number) => {
    const numOptions = numOptionsRaw + 1 // we need one more to drop 0 later (we already have 0 as all options)
    const sortedArray = [...new Set([
        0, // add 0 as value to avoid later
        ...array,
    ])].sort((a, b) => a - b);

    if (sortedArray.length <= numOptions) {
      return sortedArray.slice(1, sortedArray.length);
    }

    const result = [sortedArray[0], sortedArray[sortedArray.length - 1]];

    const step = Math.floor((sortedArray.length - 2) / (numOptions - 2));
  
    for (let i = 1; i < numOptions - 1; i++) {
        const index = 1 + i * step;
        result.splice(i, 0, sortedArray[index]);
    }

    return result.slice(1, result.length);
}

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
    populations: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
    internets: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined))
        .pipe(z.number().positive().optional()),
});

const getCityPrismaQuery = (query: z.infer<typeof getCitiesSchema>) => {
    const prismaQuery: Prisma.CityFindManyArgs['where'] = {}

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

    return prismaQuery
}

const mapInternet = <T extends Pick<City, 'internetSpeedCity' | 'internetSpeedCountry' | 'internetSpeedDigitalNomad'>>({
    internetSpeedCity,
    internetSpeedCountry,
    internetSpeedDigitalNomad,
    ...option
}: T) => {
    if (internetSpeedCity) {
        return {
            ...option,
            internet: {
                value: internetSpeedCity,
                level: 'city',
            },
        }
    }

    if (internetSpeedCountry) {
        return {
            ...option,
            internet: {
                value: internetSpeedCountry,
                level: 'country',
            },
        }
    }

    return {
        ...option,
        internet: {
            value: internetSpeedDigitalNomad,
            level: 'dirty',
        },
    }
}

export default defineEventHandler(async (event) => {
    const validatedQuery = await getValidatedQuery(event, (body) => getCitiesSchema.parse(body));
    const where = getCityPrismaQuery(validatedQuery)
  
    const {
      page,
      limit,
    } = validatedQuery;

    const [cities, allCities] = await Promise.all([
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
                temperatureC: true,
                population: true,
                image: true,
                internetSpeedCity: true,
                internetSpeedCountry: true,
                internetSpeedDigitalNomad: true,
            },
        }),
        prisma.city.findMany({
            select: {
                region: true,
                population: true,
                internetSpeedCity: true,
                internetSpeedCountry: true,
                internetSpeedDigitalNomad: true,
            },
        }),
    ])

    const count = allCities.length
    const regions = new Set<string>()
    const populations = new Set<number>()
    const internetSpeed = new Set<number>()

    allCities.forEach(city => {
        regions.add(city.region)
        populations.add(city.population)
        internetSpeed.add(mapInternet(city).internet.value)
    })

    return {
        filters: {
            regions: {
                type: 'single',
                operation: 'equals',
                options: [...regions],
            },
            ranks: {
                type: 'single',
                operation: 'gte',
                options: [1, 2, 3, 4, 5],
            },
            populations: {
                type: 'single',
                operation: 'gte',
                options: getOptions([...populations], 5),
            },
            internets: {
                type: 'single',
                operation: 'gte',
                options: getOptions([...internetSpeed], 5),
            }
        },
        cities: cities.map(mapInternet),
        count,
        pagesCount: Math.ceil(count / limit),
    }
})
