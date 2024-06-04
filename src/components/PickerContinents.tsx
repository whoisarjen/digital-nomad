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
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "./ui/label"

const PICKER_CONTINENTS_KEY = 'continent'
const DEFAULT_CONTINENT = 'All Continents'

const CONTINENTS = [
    DEFAULT_CONTINENT,
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
        if (option === DEFAULT_CONTINENT) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_CONTINENTS_KEY), { scroll: false })
            return
        }

        router.push(getNextSearchParams(searchParams, PICKER_CONTINENTS_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Continent</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={searchParams.get(PICKER_CONTINENTS_KEY) ?? DEFAULT_CONTINENT} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {CONTINENTS.map(continent => (
                        <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
