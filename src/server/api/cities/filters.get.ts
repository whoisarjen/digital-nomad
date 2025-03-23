import _ from 'lodash';
import { formatNumber, OPTIONS_LEVEL_GTE, OPTIONS_LEVEL_LTE, OPTIONS_RANKS } from '~/shared/global.utils';

export const RANGE_BREAK_SYMBOL = '-'

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

export default defineEventHandler(async () => {
    const allCities = await prisma.city.findMany({
        select: {
            population: true,
            internetSpeed: true,
            costForNomadInUsd: true,
            weathersAverage: {
                select: {
                    temperature2mMax: true,
                },
            }
        }
    })

    const populations = new Set<number>()
    const internetSpeed = new Set<number>()
    const costForNomadInUsd = new Set<number>()
    const temperature2mMax = new Set<number>(allCities.flatMap(city => city.weathersAverage.map(option => parseInt(option.temperature2mMax.toString()))))

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
        temperatures: {
            type: 'single',
            operation: 'range',
            options: getRangeOptions([...temperature2mMax], 5, ([start, end]) => `${start} to ${end}°C`),
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
