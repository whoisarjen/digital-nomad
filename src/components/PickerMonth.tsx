import { PICKER_MONTH_DEFAULT, PICKER_MONTH_OPTIONS, PICKER_MONTH_KEY, type MonthOption } from "@/utils/month.utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { Label } from "./ui/label"
import type { HomeSearchParams } from "@/app/page"
import { redirect } from "next/navigation"

type PickerMonthProps = {
    searchParams: HomeSearchParams
}
  
export const PickerMonth = ({
    searchParams,
}: PickerMonthProps) => {
    const action = async (value: MonthOption) => {
        'use server'

        if (value === PICKER_MONTH_DEFAULT) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_MONTH_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_MONTH_KEY, value))
        }
    }

    const selected = PICKER_MONTH_OPTIONS.find(value => value === searchParams.month) ?? PICKER_MONTH_DEFAULT

    return (
        <Select onValueChange={action}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Month</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selected} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {PICKER_MONTH_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
