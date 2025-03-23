import _ from 'lodash';
import { formatNumber, OPTIONS_LEVEL_GTE, OPTIONS_LEVEL_LTE, OPTIONS_RANKS } from '~/shared/global.utils';

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

export default defineEventHandler(async () => {
    const allCities = await prisma.city.findMany({
        select: {
            population: true,
            internetSpeed: true,
            costForNomadInUsd: true,
        }
    })

    const populations = new Set<number>()
    const internetSpeed = new Set<number>()
    const costForNomadInUsd = new Set<number>()

    allCities.forEach(city => {
        populations.add(city.population)
        internetSpeed.add(city.internetSpeed)
        costForNomadInUsd.add(parseInt(city.costForNomadInUsd.toString()))
    })

    return {
        total_scores: {
            type: 'single',
            operation: 'gte',
            options: OPTIONS_RANKS,
        },
        costs: {
            type: 'single',
            operation: 'lte',
            options: getSingleOptions([...costForNomadInUsd], 5, option => `${option}$`),
        },
        internets: {
            type: 'single',
            operation: 'gte',
            options: getSingleOptions([...internetSpeed], 5, option => `${option}Mb/s`),
        },
        populations: {
            type: 'single',
            operation: 'gte',
            options: getSingleOptions([...populations], 5, option => formatNumber(Number(option))),
        },
        pollutions: {
            type: 'single',
            operation: 'lte',
            options: OPTIONS_LEVEL_LTE,
        },
        safety: {
            type: 'single',
            operation: 'gte',
            options: OPTIONS_LEVEL_GTE,
        },
    } as const
})
