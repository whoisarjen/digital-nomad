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
import { getNextSearchParams } from "@/utils/link.utils"
import { getCurrentOrderBy, OPTIONS_ORDER_BY, PICKER_ORDER_BY_KEY } from "@/utils/orderBy.utils"
import { useRouter, useSearchParams } from "next/navigation"

export const PickerSortBy = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (option: string) => {
        router.push(getNextSearchParams(searchParams, PICKER_ORDER_BY_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange} value={getCurrentOrderBy(searchParams)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a WiFi" />
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
