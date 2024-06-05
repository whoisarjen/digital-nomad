import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { PICKER_WEATHER_DEFAULT, PICKER_WEATHER_KEY, PICKER_WEATHER_OPTIONS, type WeatherOption } from "@/utils/weather.utils"
import { Label } from "./ui/label"
import type { HomeSearchParams } from "@/app/page"
import { redirect } from "next/navigation"

type PickerOrderProps = {
    searchParams: HomeSearchParams
}

export const PickerWeather = ({
    searchParams,
}: PickerOrderProps) => {
    const action = async (value: WeatherOption['value']) => {
        'use server'

        if (value === PICKER_WEATHER_DEFAULT.value) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_WEATHER_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_WEATHER_KEY, value))
        }
    }

    const selected = PICKER_WEATHER_OPTIONS.find(({ value }) => value === searchParams.weather) ?? PICKER_WEATHER_DEFAULT

    return (
        <Select onValueChange={action}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Weather</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selected.label} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {PICKER_WEATHER_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
