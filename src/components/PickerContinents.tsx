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
import { useRouter, useSearchParams } from "next/navigation"

const PICKER_CONTINENTS_KEY = 'region'
const DEFAULT_REGION = 'All Regions'

const REGIONS = [
    DEFAULT_REGION,
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Latin America',
    'Middle East',
    'North America',
    'Oceania',
]

export const PickerContinent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (option: string) => {
        if (option === DEFAULT_REGION) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_CONTINENTS_KEY), { scroll: false })
            return
        }

        router.push(getNextSearchParams(searchParams, PICKER_CONTINENTS_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange} defaultValue={searchParams.get(PICKER_CONTINENTS_KEY) ?? DEFAULT_REGION}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Region</SelectLabel>
                    {REGIONS.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
