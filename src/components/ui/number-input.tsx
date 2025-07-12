"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberInputProps {
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
}

export default function NumberInput({
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className = "",
}: NumberInputProps) {
  const [value, setValue] = useState(defaultValue)

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === "") {
      setValue(min)
      onChange?.(min)
      return
    }

    const numValue = Number.parseInt(inputValue, 10)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      setValue(clampedValue)
      onChange?.(clampedValue)
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-r-none border-r-0 bg-transparent"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease value"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="h-10 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Number input"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-l-none border-l-0 bg-transparent"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase value"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
