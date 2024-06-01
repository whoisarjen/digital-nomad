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
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation"
import { getCurrentTemperatureMin, getCurrentTemperatureMax, PICKER_TEMPERATURE_MIN_KEY, PICKER_TEMPERATURE_MAX_KEY, DEFAULT_TEMPERATURE_MIN, DEFAULT_TEMPERATURE_MAX } from "@/utils/temperature.utils"

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  minStepsBetweenThumbs: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const Slider = React.forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: SliderProps,
    ref
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = useState(initialValue);

    const handleValueChange = (newValues: number[]) => {
        setLocalValues(newValues);
        if (onValueChange) {
            onValueChange(newValues);
        }
    };

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none select-none mb-6 items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => {
            return (
                <React.Fragment key={index}>
                    <div
                    className="absolute text-center"
                    style={{
                        left: `calc(${((value - min) / (max - min)) * (index === 0 ? 99 : 90)}% + 0px)`,
                        top: `10px`,
                    }}
                    >
                    <span className="text-sm">
                        {formatLabel ? formatLabel(value) : value}
                    </span>
                    </div>
                    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
                </React.Fragment>
            )
        })}
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export const PickerTemperatures = () => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [temperaturesRaw, setTemperaturesRaw] = useState([
        getCurrentTemperatureMin(searchParams),
        getCurrentTemperatureMax(searchParams),
    ])

    const handleOnClick = () => {
        const result = new URLSearchParams(searchParams)
        result.set(PICKER_TEMPERATURE_MIN_KEY, temperaturesRaw[0].toString())
        result.set(PICKER_TEMPERATURE_MAX_KEY, temperaturesRaw[1].toString())

        router.push(
            `?${result.toString()}`,
            { scroll: false },
        )

        ref.current?.click()
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" ref={ref}>
                    Temperature ({getCurrentTemperatureMin(searchParams)}°C-{getCurrentTemperatureMax(searchParams)}°C)
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 flex flex-col justify-center gap-4">
                <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Temperature</h4>
                    <p className="text-sm text-muted-foreground">
                        Temperature of the dreamed destination.
                    </p>
                </div>
                <Slider
                    step={1}
                    value={temperaturesRaw}
                    minStepsBetweenThumbs={0}
                    min={DEFAULT_TEMPERATURE_MIN}
                    max={DEFAULT_TEMPERATURE_MAX}
                    onValueChange={setTemperaturesRaw}
                />
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Min.</Label>
                        <Input
                            disabled
                            id="temperature"
                            value={`${temperaturesRaw[0]}°C`}
                            className="col-span-2 h-8"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Max.</Label>
                        <Input
                            disabled
                            id="maxTemperature"
                            value={`${temperaturesRaw[1]}°C`}
                            className="col-span-2 h-8"
                        />
                    </div>
                </div>
                </div>
                <Button onClick={handleOnClick}>
                    Apply Temperature
                </Button>
            </PopoverContent>
        </Popover>
    )
}
