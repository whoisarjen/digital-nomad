import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNextSearchParams, getNextSearchParamsWithoutSelectedKey } from "@/utils/link.utils"
import { redirect } from "next/navigation"
import { Label } from "./ui/label"
import { PICKER_ORDER_DEFAULT, PICKER_ORDER_KEY, PICKER_ORDER_OPTIONS } from "@/utils/order.utils"
import type { OrderOption } from '@/utils/order.utils'
import type { HomeSearchParams } from "@/app/page"

type PickerOrderProps = {
    searchParams: HomeSearchParams
}

export const PickerOrder = ({
    searchParams,
}: PickerOrderProps) => {
    const action = async (value: OrderOption['value']) => {
        'use server'

        if (value === PICKER_ORDER_DEFAULT.value) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_ORDER_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_ORDER_KEY, value))
        }
    }

    const selected = PICKER_ORDER_OPTIONS.find(({ value }) => value === searchParams.sort) ?? PICKER_ORDER_DEFAULT

    return (
        <Select onValueChange={action}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Order</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selected.label} />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectGroup>
                    {PICKER_ORDER_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
