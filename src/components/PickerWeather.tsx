'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { DEFAULT_WEATHER, PICKER_WEATHER_KEY, WEATHERS } from "@/utils/weather.utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "./ui/label"

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
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Weather</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={(WEATHERS.find(({ value }) => value === searchParams.get(PICKER_WEATHER_KEY)) ?? DEFAULT_WEATHER).label} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {WEATHERS.map(weather => (
                        <SelectItem key={weather.value} value={weather.value}>{weather.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
