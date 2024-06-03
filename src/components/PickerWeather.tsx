'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { DEFAULT_WEATHER, PICKER_WEATHER_KEY, WEATHERS } from "@/utils/weather.utils"
import { useRouter, useSearchParams } from "next/navigation"

export const PickerWeather = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (option: string) => {
        if (option === DEFAULT_WEATHER.value) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_WEATHER_KEY), { scroll: false })
            return 
        }
        router.push(getNextSearchParams(searchParams, PICKER_WEATHER_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={(WEATHERS.find(({ value }) => value === searchParams.get(PICKER_WEATHER_KEY)) ?? DEFAULT_WEATHER).label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Weather</SelectLabel>
                    {WEATHERS.map(weather => (
                        <SelectItem key={weather.value} value={weather.value}>{weather.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
