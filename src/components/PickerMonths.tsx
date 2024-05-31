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

const PICKER_MONTHS_KEY = 'month'
const DEFAULT_MONTH = 'All Months'

const MONTHS = [
    DEFAULT_MONTH,
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const PickerMonth = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (option: string) => {
        if (option === DEFAULT_MONTH) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_MONTHS_KEY), { scroll: false })
            return
        }

        router.push(getNextSearchParams(searchParams, PICKER_MONTHS_KEY, option), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange} defaultValue={searchParams.get(PICKER_MONTHS_KEY) ?? DEFAULT_MONTH}>
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
