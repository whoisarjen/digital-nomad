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
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={searchParams.get(PICKER_CONTINENTS_KEY) ?? DEFAULT_CONTINENT} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Continent</SelectLabel>
                    {CONTINENTS.map(continent => (
                        <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
