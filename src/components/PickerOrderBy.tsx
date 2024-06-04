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
import { PICKER_ORDER_BY_DEFAULT, getCurrentOrderBy, PICKER_ORDER_BY_OPTIONS, PICKER_ORDER_BY_KEY } from "@/utils/orderBy.utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "./ui/label"

export const PickerSortBy = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (value: string) => {
        if (value === PICKER_ORDER_BY_DEFAULT.value) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_ORDER_BY_KEY), { scroll: false })
            return 
        }
        router.push(getNextSearchParams(searchParams, PICKER_ORDER_BY_KEY, value), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Sort by</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={PICKER_ORDER_BY_OPTIONS.find(({ value }) => value === getCurrentOrderBy(searchParams))?.label} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {PICKER_ORDER_BY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
