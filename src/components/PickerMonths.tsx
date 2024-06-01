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
import { getCurrentMonth, MONTHS } from "@/utils/date.utils"
import { getNextSearchParams } from "@/utils/link.utils"
import { useRouter, useSearchParams } from "next/navigation"

const PICKER_MONTHS_KEY = 'month'

export const PickerMonth = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (option: string) => {
        router.push(getNextSearchParams(searchParams, PICKER_MONTHS_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange} defaultValue={searchParams.get(PICKER_MONTHS_KEY) ?? getCurrentMonth()}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a month" />
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
