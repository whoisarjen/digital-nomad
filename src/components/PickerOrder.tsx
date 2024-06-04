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
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "./ui/label"
import { PICKER_ORDER_DEFAULT, PICKER_ORDER_KEY, PICKER_ORDER_OPTIONS } from "@/utils/order.utils"

export const PickerOrder = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOnValueChange = (value: string) => {
        if (value === PICKER_ORDER_DEFAULT.value) {
            router.push(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_ORDER_KEY), { scroll: false })
            return 
        }

        router.push(getNextSearchParams(searchParams, PICKER_ORDER_KEY, value), { scroll: false })
    }

    return (
        <Select onValueChange={handleOnValueChange}>
            <div className="grid max-w-sm items-center gap-1.5">
                <Label className="text-xs">Order</Label>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={PICKER_ORDER_OPTIONS.find(({ value }) => value === searchParams.get(PICKER_ORDER_KEY))?.label ?? PICKER_ORDER_DEFAULT.label} />
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
