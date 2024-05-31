import Image from 'next/image'
import { prisma } from '@/utils/prisma.utils'

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Pagination } from './Pagination'
import { getCurrentPageNumber, getSearchParam } from '@/utils/link.utils'
import { notFound } from 'next/navigation'

const CITIES_PER_PAGE = 16

type GridProps = {
    searchParams: URLSearchParams
}

export default async function Grid({
    searchParams,
}: GridProps) {
    const currentPage = getCurrentPageNumber(searchParams)
    const [response, count] = await Promise.all([
        prisma.city.findMany({
            where: {
                region: getSearchParam(searchParams, 'region'),
            },
            take: CITIES_PER_PAGE,
            skip: CITIES_PER_PAGE * (currentPage - 1),
            orderBy: {
                score: 'desc',
            }
        }),
        prisma.city.count(),
    ])

    if (!response.length) {
        notFound()
    }

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
            <Pagination countOfPages={count / CITIES_PER_PAGE} searchParams={searchParams} />
        </section>
    )
}
