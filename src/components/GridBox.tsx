import { getBeginningAndEndOfSupportedMonth, getCurrentMonth, getTodayAndPreviousDayDate, isToday } from "@/utils/month.utils"
import { BarChart, HandCoins, Shield, ThumbsUp, Wifi } from "lucide-react"
import { IconWeather } from "./IconWeather"
import Link from "next/link"
import Image from 'next/image'
import { AspectRatio } from "./ui/aspect-ratio"
import { prisma } from "@/utils/prisma.utils"
import { isNil, mean, round } from "lodash"
import { Progress } from "./ui/progress"
import { getMostCommonWeatherCode } from "@/utils/weather.utils"

type GridBoxProps = {
    cityId: number
    searchParams: URLSearchParams
}

export const GridBox = async ({ cityId, searchParams }: GridBoxProps) => {
    const { today, previousDay } = getTodayAndPreviousDayDate()
    const { beginning, end } = getBeginningAndEndOfSupportedMonth(getCurrentMonth(searchParams));

    const [city, weathers, latestWeather] = await Promise.all([
        prisma.city.findFirstOrThrow({
            where: {
                id: cityId,
            }
        }),
        prisma.weather.findMany({
            where: {
                cityId,
                when: {
                    gte: new Date(beginning).toISOString(),
                    lte: new Date(end).toISOString(),
                },
            }
        }),
        prisma.weather.findFirstOrThrow({
            orderBy: {
                when: 'desc',
            },
            where: {
                OR: [
                        {
                            cityId: cityId,
                            when: new Date(today).toISOString(),
                        },
                        {
                            cityId: cityId,
                            when: new Date(previousDay).toISOString(),
                        },
                    ]
                },
            }),
    ])

    return (
        <Link
            key={city.id}
            href={`/cities/${city.slug}`}
            className="flex w-full relative shadow group"
        >
            <AspectRatio ratio={16 / 9} className="bg-muted">
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
                    <div className="flex items-center gap-1 absolute bottom-0 left-0 p-3 text-xs">
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
                    </div>
                    <div className="flex items-center gap-1 absolute bottom-0 right-0 p-3 text-md">
                        {city.costForNomadInUSD}$/mo
                    </div>
                </div>
            </AspectRatio>
        </Link>
    )
}