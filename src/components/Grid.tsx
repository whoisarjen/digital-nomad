import { prisma } from '@/utils/prisma.utils'

import { Pagination } from './Pagination'
import { getCurrentPageNumber, getSearchParam } from '@/utils/link.utils'
import { getCurrentPopulationMax, getCurrentPopulationMin } from '@/utils/population.utils'
import { getCurrentWifi } from '@/utils/wifi.utils'
import { getCurrentOrderBy } from '@/utils/orderBy.utils'
import { GridBox } from './GridBox'
import { getBeginningAndEndOfSupportedMonth, getCurrentMonth } from '@/utils/date.utils'
import { getCurrentTemperatureMax, getCurrentTemperatureMin } from '@/utils/temperature.utils'

const CITIES_PER_PAGE = 16

type GridProps = {
    searchParams: URLSearchParams
}

export default async function Grid({
    searchParams,
}: GridProps) {
    const orderBy = getCurrentOrderBy(searchParams)
    const currentPage = getCurrentPageNumber(searchParams)
    const { beginning, end } = getBeginningAndEndOfSupportedMonth(getCurrentMonth(searchParams));

    const where = {
        region: getSearchParam(searchParams, 'region'),
        population: {
            gte: getCurrentPopulationMin(searchParams),
            lte: getCurrentPopulationMax(searchParams),
        },
        wifi: {
            gte: getCurrentWifi(searchParams),
        },
        weathers: {
            some: {
                OR: [
                    {
                        when: {
                            gte: new Date(beginning).toISOString(),
                            lte: new Date(end).toISOString(),
                        },
                        temperatureMax: {
                            gte: getCurrentTemperatureMin(searchParams),
                            lte: getCurrentTemperatureMax(searchParams),
                        }
                    },
                    {
                        when: {
                            gte: new Date(beginning).toISOString(),
                            lte: new Date(end).toISOString(),
                        },
                        temperatureMax: null,
                    },
                ]
            },
        }
    }

    const [response, count] = await Promise.all([
        prisma.city.findMany({
            where,
            take: CITIES_PER_PAGE,
            skip: CITIES_PER_PAGE * (currentPage - 1),
            orderBy: {
                [orderBy.slice(0, orderBy.indexOf('_'))]: orderBy.slice(orderBy.indexOf('_') + 1, orderBy.length),
            },
        }),
        prisma.city.count({ where }),
    ])

    return (
        <section className="flex flex-wrap gap-4 justify-center p-4">
            {response.map(city => <GridBox key={city.id} city={city} searchParams={searchParams} />)}
            <Pagination countOfPages={count / CITIES_PER_PAGE} searchParams={searchParams} />
        </section>
    )
}
