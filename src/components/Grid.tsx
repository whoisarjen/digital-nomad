import { Pagination } from './Pagination'
import { getCurrentPageNumber, getSearchParam } from '@/utils/link.utils'
import { DEFAULT_POPULATION_MAX, DEFAULT_POPULATION_MIN, getCurrentPopulationMax, getCurrentPopulationMin } from '@/utils/population.utils'
import { DEFAULT_WIFI, getCurrentWifi } from '@/utils/wifi.utils'
import { getCurrentSortBy } from '@/utils/sortBy.utils'
import { getCurrentOrder } from '@/utils/order.utils'
import { Suspense } from 'react'
import { Skeleton } from './ui/skeleton'
import { AspectRatio } from './ui/aspect-ratio'
import { BarChart, HandCoins, Shield, ThumbsUp, Wifi } from "lucide-react"
import Link from "next/link"
import { Progress } from "./ui/progress"
import { supabase } from '@/utils/supabase.utils'
import Image from "next/image"

const CITIES_PER_PAGE = 16

type GridProps = {
    searchParams: URLSearchParams
}

export default async function Grid({ searchParams }: GridProps) {
    const currentPage = getCurrentPageNumber(searchParams)
    // const { beginning, end } = getBeginningAndEndOfSupportedMonth(getCurrentMonth(searchParams))

    let query = supabase
        .from('cities')
        .select('*', { count: 'exact' })
        .range((currentPage - 1) * CITIES_PER_PAGE, currentPage * CITIES_PER_PAGE - 1)
        .order(getCurrentSortBy(searchParams), { ascending: getCurrentOrder(searchParams) })

    const currentPopulationMin =  Number(getCurrentPopulationMin(searchParams))
    const currentPopulationMax =  Number(getCurrentPopulationMax(searchParams))
    if (currentPopulationMin !== DEFAULT_POPULATION_MIN && currentPopulationMax !== DEFAULT_POPULATION_MAX) {
        query.gte('population', getCurrentPopulationMin(searchParams))
        query.lte('population', getCurrentPopulationMax(searchParams))
    }

    const wifi = getCurrentWifi(searchParams)
    if (wifi !== DEFAULT_WIFI) {
        query.gte('wifi', Number(wifi))
    }

    const continent = getSearchParam(searchParams, 'continent')
    if (continent) {
        query.eq('region', continent)
    }

    const { data: cities, count } = await query

    return (
        <section className="flex flex-col p-4 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
                {cities?.map(city => 
                    <Suspense
                        key={city.id}
                        fallback={
                            <Skeleton className="w-full">
                                <AspectRatio ratio={16 / 9} className="bg-muted" />
                            </Skeleton>
                        }
                    >
                        <AspectRatio ratio={16 / 9} key={city.id} className="flex w-full relative shadow group">
                            <Image
                                fill
                                sizes="375px"
                                alt={city.name}
                                src={city.image}
                                className="rounded-md object-cover"
                            />
                            <div className="hidden group-hover:flex flex-1 justify-center absolute inset-0 bg-black ease-in-out duration-700 bg-opacity-75 z-10 text-white items-center">
                                <div className="flex-1 box-border max-w-60">
                                    <div className="flex flex-1 items-center justify-center gap-3">
                                        <BarChart />
                                        <p className="text-xs min-w-12">Overall</p>
                                        <Progress value={city.totalScore / 5 * 100} />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center gap-3">
                                        <HandCoins />
                                        <p className="text-xs min-w-12">Cost</p>
                                        <Progress value={city.costScore / 5 * 100} />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center gap-3">
                                        <Wifi />
                                        <p className="text-xs min-w-12">Internet</p>
                                        <Progress value={city.internetScore / 5 * 100} />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center gap-3">
                                        <ThumbsUp />
                                        <p className="text-xs min-w-12">Liked</p>
                                        <Progress value={city.likesScore / 5 * 100} />
                                    </div>
                                    <div className="flex flex-1 items-center justify-center gap-3">
                                        <Shield />
                                        <p className="text-xs min-w-12">Safety</p>
                                        <Progress value={city.safetyLevel / 5 * 100} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-35 rounded-md" />
                            <div className="text-white absolute inset-0 flex flex-col items-center justify-center bg-opacity-50">
                                <h2 className="text-2xl font-bold">{city.name}</h2>
                                <p className="text-lg text-center">{city.country}</p>
                                <div className="flex items-center gap-1 absolute top-0 left-0 p-3 text-xs">
                                    <BarChart size={18} />
                                    <span>{parseInt(`${city.totalScore / 5 * 100}`)}%</span>
                                </div>
                                <div className="flex items-center gap-1 absolute top-0 right-0 p-3 text-xs">
                                    <Wifi size={18} />
                                    <span>{city.wifi}Mb/s</span>
                                </div>
                                {/* <div className="flex items-center gap-1 absolute bottom-0 left-0 p-3 text-xs">
                                    <div className="flex items-center gap-1">
                                        <IconWeather weatherCode={latestWeather.weatherCode} size={18} />
                                        <div className="flex flex-col">
                                            <span>{!isNil(latestWeather.temperatureMax) && round(latestWeather.temperatureMax, 1)}°C</span>
                                            <span>{isToday(latestWeather.when) ? 'Today' : 'Yesterday'}</span>
                                        </div>
                                    </div>
                                    {!weathers.some(({ temperatureMax }) => isNil(temperatureMax)) &&
                                        <>
                                            <div>|</div>
                                            <div className="flex items-center gap-1">
                                                <IconWeather weatherCode={getMostCommonWeatherCode(weathers)} size={18} />
                                                <div className="flex flex-col">
                                                    <span>{round(mean(weathers.map(({ temperatureMax }) => temperatureMax)), 1)}°C</span>
                                                    <span>avg. {getCurrentMonth(searchParams)}</span>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div> */}
                                <div className="flex items-center gap-1 absolute bottom-0 right-0 p-3 text-md">
                                    {city.costForNomadInUSD}$/mo
                                </div>
                            </div>
                        </AspectRatio>
                    </Suspense>
                )}
            </div>
            <Pagination countOfPages={(count ?? 0) / CITIES_PER_PAGE} searchParams={searchParams} />
        </section>
    )
}
