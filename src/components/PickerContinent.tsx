import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "./ui/label"
import type { HomeSearchParams } from "@/app/page"
import { redirect } from "next/navigation"
import { getNextSearchParamsWithoutSelectedKey, getNextSearchParams } from "@/utils/link.utils"
import { type ContinentOption, PICKER_CONTINENT_DEFAULT, PICKER_CONTINENT_KEY, PICKER_CONTINENT_OPTIONS } from "@/utils/continent.utils"

type PickerContinentProps = {
    searchParams: HomeSearchParams
}
  
export const PickerContinent = ({
    searchParams,
}: PickerContinentProps) => {
    const action = async (value: ContinentOption) => {
        'use server'

        if (value === PICKER_CONTINENT_DEFAULT) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_CONTINENT_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_CONTINENT_KEY, value))
        }
    }

    const selected = PICKER_CONTINENT_OPTIONS.find(value => value === searchParams.continent) ?? PICKER_CONTINENT_DEFAULT

    return (
        <Select onValueChange={action}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Continent</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selected} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {PICKER_CONTINENT_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

