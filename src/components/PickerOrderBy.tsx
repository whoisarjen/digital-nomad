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
import { DEFAULT_ORDER_BY, getCurrentOrderBy, OPTIONS_ORDER_BY, PICKER_ORDER_BY_KEY } from "@/utils/orderBy.utils"
import { useRouter, useSearchParams } from "next/navigation"

export const PickerSortBy = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (value: string) => {
        if (value === DEFAULT_ORDER_BY.value) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_ORDER_BY_KEY), { scroll: false })
            return 
        }
        router.push(getNextSearchParams(searchParams, PICKER_ORDER_BY_KEY, value), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={OPTIONS_ORDER_BY.find(({ value }) => value === getCurrentOrderBy(searchParams))?.label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    {OPTIONS_ORDER_BY.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
