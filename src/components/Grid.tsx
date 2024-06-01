import Image from 'next/image'
import { prisma } from '@/utils/prisma.utils'

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Pagination } from './Pagination'
import { getCurrentPageNumber, getSearchParam } from '@/utils/link.utils'
import { getCurrentMonth } from '@/utils/date.utils'
import { getCurrentTemperatureMin, getCurrentTemperatureMax } from '@/utils/temperature.utils'
import { getCurrentPopulationMax, getCurrentPopulationMin } from '@/utils/population.utils'
import { Sun, Wifi } from 'lucide-react'
import { getCurrentWifi } from '@/utils/wifi.utils'

const CITIES_PER_PAGE = 16

type GridProps = {
    searchParams: URLSearchParams
}

export default async function Grid({
    searchParams,
}: GridProps) {
    const currentPage = getCurrentPageNumber(searchParams)

    const where = {
        region: getSearchParam(searchParams, 'region'),
        [`temperature${getCurrentMonth()}`]: {
            gte: getCurrentTemperatureMin(searchParams),
            lte: getCurrentTemperatureMax(searchParams),
        },
        population: {
            gte: getCurrentPopulationMin(searchParams),
            lte: getCurrentPopulationMax(searchParams),
        },
        wifi: {
            gte: getCurrentWifi(searchParams),
        },
    }

    const [response, count] = await Promise.all([
        prisma.city.findMany({
            where,
            take: CITIES_PER_PAGE,
            skip: CITIES_PER_PAGE * (currentPage - 1),
            orderBy: {
                score: 'desc',
            },
        }),
        prisma.city.count({ where }),
    ])

    return (
        <section className="flex flex-wrap gap-4 justify-center p-4">
            {response.map(city => {
                return (
                    <div key={city.id} className="flex cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-red-100 relative">
                        <AspectRatio ratio={16 / 9} className="bg-muted">
                            <Image
                                fill
                                sizes="375px"
                                alt={city.name}
                                src={city.image}
                                className="rounded-md object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-15 rounded-md" />
                            <div className="text-white absolute inset-0 flex flex-col items-center justify-center bg-opacity-50">
                                <h2 className="text-2xl font-bold">{city.name}</h2>
                                <p className="text-lg text-center">{city.country}</p>
                                <div className="flex items-center gap-1 absolute top-0 right-0 p-3 text-xs"><Wifi size={18} /><span>{city.wifi}Mb/s</span></div>
                                <div className="flex items-center gap-1 absolute bottom-0 left-0 p-3 text-xs"><Sun size={18} /><span>{city[`temperature${getCurrentMonth()}` as keyof typeof city]}°C</span></div>
                            </div>
                        </AspectRatio>
                    </div>
                )
            })}
            <Pagination countOfPages={count / CITIES_PER_PAGE} searchParams={searchParams} />
        </section>
    )
}
