import { getBeginningAndEndOfSupportedMonth, getCurrentMonth, getTodayAndPreviousDayDate } from "@/utils/date.utils"
import type { City } from "@prisma/client"
import { ThumbsUp, Wifi } from "lucide-react"
import { getTheMostCommonWeatherCode, IconWeather } from "./IconWeather"
import Link from "next/link"
import Image from 'next/image'
import { AspectRatio } from "./ui/aspect-ratio"
import { prisma } from "@/utils/prisma.utils"
import { isNil, mean, round } from "lodash"
import { notFound } from "next/navigation"

type GridBoxProps = {
    city: City
    searchParams: URLSearchParams
}

export const GridBox = async ({ city, searchParams }: GridBoxProps) => {
    const { today, previousDay } = getTodayAndPreviousDayDate()
    const { beginning, end } = getBeginningAndEndOfSupportedMonth(getCurrentMonth(searchParams));

    const [todayWeather, previousWeather, weathers] = await Promise.all([
        prisma.weather.findUnique({
            where: {
                cityId: city.id,
                when: new Date(today).toISOString(),
            },
        }),
        prisma.weather.findUnique({
            where: {
                cityId: city.id,
                when: new Date(previousDay).toISOString(),
            },
        }),
        prisma.weather.findMany({
            where: {
                cityId: city.id,
                when: {
                    gte: new Date(beginning).toISOString(),
                    lte: new Date(end).toISOString(),
                },
            }
        }),
    ])

    const latestWeather = todayWeather || previousWeather

    if (!latestWeather) {
        notFound()
    }

    return (
        <Link
            href={city.slug}
            className="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 relative shadow"
        >
            <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                    fill
                    sizes="375px"
                    alt={city.name}
                    src={city.image}
                    className="rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-35 rounded-md" />
                <div className="text-white absolute inset-0 flex flex-col items-center justify-center bg-opacity-50">
                    <h2 className="text-2xl font-bold">{city.name}</h2>
                    <p className="text-lg text-center">{city.country}</p>
                    <div className="flex items-center gap-1 absolute top-0 left-0 p-3 text-xs">
                        <ThumbsUp size={18} />
                        <span>{parseInt(`${city.score / 5 * 100}`)}%</span>
                    </div>
                    <div className="flex items-center gap-1 absolute top-0 right-0 p-3 text-xs">
                        <Wifi size={18} />
                        <span>{city.wifi}Mb/s</span>
                    </div>
                    <div className="flex items-center gap-1 absolute bottom-0 left-0 p-3 text-xs">
                        <div className="flex items-center gap-1">
                            <IconWeather weatherCode={latestWeather.weatherCode} size={18} />
                            <div className="flex flex-col">
                                <span>{!isNil(latestWeather.temperatureMax) && round(latestWeather.temperatureMax, 1)}°C</span>
                                <span>{todayWeather ? 'Today' : 'Yesterday'}</span>
                            </div>
                        </div>
                        {weathers.some(({ temperatureMax }) => !isNil(temperatureMax)) &&
                            <>
                                <div>|</div>
                                <div className="flex items-center gap-1">
                                    <IconWeather weatherCode={getTheMostCommonWeatherCode(weathers)} size={18} />
                                    <div className="flex flex-col">
                                        <span>{round(mean(weathers.filter(({ temperatureMax }) => temperatureMax).map(({ temperatureMax }) => temperatureMax)), 1)}°C</span>
                                        <span>{getCurrentMonth(searchParams)}</span>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="flex items-center gap-1 absolute bottom-0 right-0 p-3 text-md">
                        {city.cost}$/mo
                    </div>
                </div>
            </AspectRatio>
        </Link>
    )
}