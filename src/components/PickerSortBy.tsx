import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { PICKER_SORT_BY_DEFAULT, PICKER_SORT_BY_OPTIONS, PICKER_SORT_BY_KEY, type SortByOption } from "@/utils/sortBy.utils"
import { Label } from "./ui/label"
import { redirect } from "next/navigation"
import type { HomeSearchParams } from "@/app/page"

type PickerOrderProps = {
    searchParams: HomeSearchParams
}

export const PickerSortBy = ({
    searchParams,
}: PickerOrderProps) => {
    const action = async (value: SortByOption['value']) => {
        'use server'

        if (value === PICKER_SORT_BY_DEFAULT.value) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_SORT_BY_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_SORT_BY_KEY, value))
        }
    }

    const selected = PICKER_SORT_BY_OPTIONS.find(({ value }) => value === searchParams.sortBy) ?? PICKER_SORT_BY_DEFAULT

    return (
        <Select onValueChange={action}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Sort by</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selected.label} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {PICKER_SORT_BY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
