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
import { getCurrentMonth, getMonth, MONTHS, PICKER_MONTHS_KEY } from "@/utils/date.utils"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { useRouter, useSearchParams } from "next/navigation"

export const PickerMonth = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (value: string) => {
        if (value === getMonth()) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_MONTHS_KEY), { scroll: false })
            return 
        }
        router.push(getNextSearchParams(searchParams, PICKER_MONTHS_KEY, value), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={searchParams.get(PICKER_MONTHS_KEY) ?? getCurrentMonth(searchParams)} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Month</SelectLabel>
                    {MONTHS.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
