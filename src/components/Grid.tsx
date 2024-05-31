import Image from 'next/image'
import { prisma } from '@/utils/prisma.utils'

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Pagination } from './Pagination'
import { getCurrentPageNumber } from '@/utils/link.utils'

const CITIES_PER_PAGE = 16

type GridProps = {
    searchParams: URLSearchParams
}

export default async function Grid({
    searchParams,
}: GridProps) {
    // const response = await fetch(
    //     "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m&current=relative_humidity_2m&current=cloud_cover"
    // );
    // const data = await response.json()
    const currentPage = getCurrentPageNumber(searchParams)
    const [response, count] = await Promise.all([
        prisma.city.findMany({
            take: CITIES_PER_PAGE,
            skip: CITIES_PER_PAGE * (currentPage - 1),
            orderBy: {
                score: 'desc',
            }
        }),
        prisma.city.count(),
    ])

    return (
        <section className="flex flex-wrap gap-4 justify-center p-4">
            {response.map(city => {
                return (
                    <div key={city.id} className="flex cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-red-100 relative">
                        <AspectRatio ratio={16 / 9} className="bg-muted">
                        <Image
                            fill
                            alt={city.name}
                            src={city.image}
                            className="rounded-md object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-15 rounded-md" />
                        <div className="text-white absolute inset-0 flex flex-col items-center justify-center bg-opacity-50">
                            <h2 className="text-2xl font-bold">{city.name}</h2>
                            <p className="text-lg">{city.country}</p>
                        </div>
                        </AspectRatio>
                    </div>
                )
            })}
            <Pagination countOfPages={count / CITIES_PER_PAGE} searchParams={searchParams} paramKey="page" />
        </section>
    )
}
