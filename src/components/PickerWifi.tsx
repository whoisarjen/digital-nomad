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
import { DEFAULT_WIFI, PICKER_WIFI_KEY, WIFI } from "@/utils/wifi.utils"
import { useRouter, useSearchParams } from "next/navigation"

const getLabel = (label: string) => `${label}Mb/s+`

export const PickerWifi = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (option: string) => {
        if (option === DEFAULT_WIFI) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_WIFI_KEY), { scroll: false })
            return 
        }
        router.push(getNextSearchParams(searchParams, PICKER_WIFI_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={getLabel(searchParams.get(PICKER_WIFI_KEY) ?? DEFAULT_WIFI)} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>WiFi</SelectLabel>
                    {WIFI.map(wifi => (
                        <SelectItem key={wifi} value={wifi}>{getLabel(wifi)}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
