import type { HomeSearchParams } from "@/app/page"
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
import { redirect } from "next/navigation"

const getLabel = (label: string) => `${label}Mb/s+`

type PickerWifiProps = {
    searchParams: HomeSearchParams
}

export const PickerWifi = ({
    searchParams,
}: PickerWifiProps) => {
    const action = async (value: string) => {
        'use server'

        if (value === DEFAULT_WIFI) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_WIFI_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_WIFI_KEY, value))
        }
    }

    return (
        <Select onValueChange={action}>
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
