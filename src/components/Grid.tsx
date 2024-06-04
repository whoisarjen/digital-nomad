import { prisma } from '@/utils/prisma.utils'

import { Pagination } from './Pagination'
import { getCurrentPageNumber, getSearchParam } from '@/utils/link.utils'
import { DEFAULT_POPULATION_MIN, getCurrentPopulationMax, getCurrentPopulationMin } from '@/utils/population.utils'
import { DEFAULT_WIFI, getCurrentWifi } from '@/utils/wifi.utils'
import { getCurrentOrderBy } from '@/utils/orderBy.utils'
import { getBeginningAndEndOfSupportedMonth, getCurrentMonth } from '@/utils/date.utils'
import { DEFAULT_TEMPERATURE_MAX, DEFAULT_TEMPERATURE_MIN, getCurrentTemperatureMax, getCurrentTemperatureMin } from '@/utils/temperature.utils'
import type { City, Weather } from '@prisma/client'
import { DEFAULT_WEATHER, getCurrentWeatherCodes } from '@/utils/weather.utils'
import { isNil, uniq } from 'lodash'
import { GridBox } from './GridBox'

const CITIES_PER_PAGE = 16

type GridProps = {
    searchParams: URLSearchParams
}

class CitiesIdsBuilder {
    private searchParams!: URLSearchParams
    private weathers = [] as (Weather & { city: Pick<City, 'wifi' | 'population' | 'region'>})[]

    constructor(searchParams: URLSearchParams) {
        return (async (): Promise<CitiesIdsBuilder> => {
            const orderBy = getCurrentOrderBy(searchParams)
            const { beginning, end } = getBeginningAndEndOfSupportedMonth(getCurrentMonth(searchParams));
    
            this.searchParams = searchParams
            this.weathers = await prisma.weather.findMany({
                orderBy: {
                    city: {
                        [orderBy.slice(0, orderBy.indexOf('_'))]: orderBy.slice(orderBy.indexOf('_') + 1, orderBy.length),
                    }
                },
                where: {
                    when: {
                        gte: new Date(beginning).toISOString(),
                        lte: new Date(end).toISOString(),
                    },
                },
                include: {
                    city: {
                        select: {
                            wifi: true,
                            region: true,
                            population: true,
                        }
                    }
                },
            })

            return this;
        })() as unknown as CitiesIdsBuilder
    }

    applyRegionFilter(){
        const region = getSearchParam(this.searchParams, 'region')

        if (region) {
            this.weathers = this.weathers.filter(({ city }) => city.region === region)
        }

        return this
    }

    applyWiFiFilter() {
        const wifi = getCurrentWifi(this.searchParams)

        if (wifi === DEFAULT_WIFI) {
            return this
        }

        this.weathers = this.weathers.filter(({ city }) => city.wifi >= Number(wifi))

        return this
    }

    applyPopulationFilter() {
        const currentPopulationMin = getCurrentPopulationMin(this.searchParams)
        const currentPopulationMax = getCurrentPopulationMax(this.searchParams)

        if (currentPopulationMin === DEFAULT_POPULATION_MIN && currentPopulationMax === DEFAULT_TEMPERATURE_MAX) {
            return this
        }

        this.weathers = this.weathers.filter(({ city }) => currentPopulationMin <= city.population && city.population <= currentPopulationMax)

        return this
    }

    applyTemperatureMaxFilter() {
        const currentTemperatureMin = getCurrentTemperatureMin(this.searchParams)
        const currentTemperatureMax = getCurrentTemperatureMax(this.searchParams)

        if (currentTemperatureMin === DEFAULT_TEMPERATURE_MIN && currentTemperatureMax === DEFAULT_TEMPERATURE_MAX) {
            return this
        }

        this.weathers = this.weathers.filter(({ temperatureMax }) => {
            if (temperatureMax === null) {
                return true
            }

            return getCurrentTemperatureMin(this.searchParams) <= temperatureMax && temperatureMax <= getCurrentTemperatureMax(this.searchParams)
        })

        return this
    }

    applyWeatherCodeFilter(){
        const { value, codes } = getCurrentWeatherCodes(this.searchParams)

        if (value === DEFAULT_WEATHER.value) {
            return this
        }

        this.weathers = this.weathers.filter(({ weatherCode }) => {
            return isNil(weatherCode) || codes.includes(weatherCode)
        })

        return this
    }

    getResults() {
        const { numberOfDaysInMonth } = getBeginningAndEndOfSupportedMonth(getCurrentMonth(this.searchParams));

        return uniq(this.weathers
            .map(({ cityId }) => cityId))
                .filter(cityId => this.weathers
                    .filter(weather => weather.cityId === cityId).length > (numberOfDaysInMonth / 2))
    }
}

export default async function Grid({ searchParams }: GridProps) {
    const currentPage = getCurrentPageNumber(searchParams)
    const citiesIds = (await new CitiesIdsBuilder(searchParams))
        .applyWiFiFilter()
        .applyRegionFilter()
        .applyPopulationFilter()
        .applyTemperatureMaxFilter()
        .applyWeatherCodeFilter()
        .getResults()

    return (
        <section className="flex flex-col p-4 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
                {citiesIds.slice((currentPage - 1) * CITIES_PER_PAGE, currentPage * CITIES_PER_PAGE).map(cityId => <GridBox key={cityId} cityId={cityId} searchParams={searchParams} />)}
            </div>
            <Pagination countOfPages={citiesIds.length / CITIES_PER_PAGE} searchParams={searchParams} />
        </section>
    )
}
