/* eslint-disable @typescript-eslint/no-explicit-any */
import countries from "@/data/countries"
import { getErrorMessage } from "@/lib/serverFetch"
import { SelectOption } from "@/types"
import dynamic from "next/dynamic"
import { useState } from "react"

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false })

export interface CountrySelectProps {
  id?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export default function CountrySelect({
  id,
  value,
  defaultValue,
  onChange,
}: CountrySelectProps) {
  const [optionValue, setOptionValue] = useState<string>(value || "")
  const fetchData = (query: string) => {
    try {
      const regex = new RegExp(query, "i")
      const filteredCountries = countries
        .filter((it) => regex.test(it))
        .slice(0, 10)

      return filteredCountries.map((it) => ({ label: it, value: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }

  const promiseOptions = async (inputValue: string) => {
    return fetchData(inputValue) || []
  }

  const handleChange = (value: SelectOption) => {
    setOptionValue(value.value)
    onChange?.(value.value)
  }

  return (
    <AsyncSelect
      id={id}
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      value={optionValue}
      defaultValue={defaultValue}
      onChange={(newVal) => handleChange(newVal as SelectOption)}
    />
  )
}
