'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"
import { formatPopulationNumber, getCurrentPopulationMin, getCurrentPopulationMax, PICKER_POPULATION_MIN_KEY, PICKER_POPULATION_MAX_KEY, checkPopulationMin, checkPopulationMax } from "@/utils/population.utils"

export const PickerPopulation = () => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [population, setPopulation] = useState([
        getCurrentPopulationMin(searchParams),
        getCurrentPopulationMax(searchParams),
    ])

    const handleOnClick = () => {
        const result = new URLSearchParams(searchParams)
        result.set(PICKER_POPULATION_MIN_KEY, population[0].toString())
        result.set(PICKER_POPULATION_MAX_KEY, population[1].toString())

        router.push(
            `?${result.toString()}`,
            { scroll: false },
        )

        ref.current?.click()
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="text-sm font-normal" ref={ref}>
                    Population ({formatPopulationNumber(getCurrentPopulationMin(searchParams))}-{formatPopulationNumber(getCurrentPopulationMax(searchParams))})
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 flex flex-col justify-center gap-4">
                <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Population</h4>
                    <p className="text-sm text-muted-foreground">
                        Population of the dreamed destination.
                    </p>
                </div>
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Min.</Label>
                        <Input
                            type="number"
                            id="population"
                            value={population[0]}
                            className="col-span-2 h-8"
                            min={PICKER_POPULATION_MIN_KEY}
                            max={PICKER_POPULATION_MAX_KEY}
                            onChange={e => setPopulation(state => {
                                const value = checkPopulationMin(Number(e.target.value))
                                return [value, value < state[1] ? state[1] : value + 1]
                            })}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Max.</Label>
                        <Input
                            type="number"
                            id="maxPopulation"
                            value={population[1]}
                            className="col-span-2 h-8"
                            min={PICKER_POPULATION_MIN_KEY}
                            max={PICKER_POPULATION_MAX_KEY}
                            onChange={e => setPopulation(state => {
                                const value = checkPopulationMax(Number(e.target.value))
                                return [value > state[0] ? state[0] : value -1, value]
                            })}
                        />
                    </div>
                </div>
                </div>
                <Button onClick={handleOnClick}>
                    Apply Population
                </Button>
            </PopoverContent>
        </Popover>
    )
}
