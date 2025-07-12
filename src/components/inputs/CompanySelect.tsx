import serverFetch, { getErrorMessage } from "@/lib/serverFetch"
import { Company } from "@/models/company"
import { AppUser } from "@/models/user"
import { SelectOption } from "@/types"
import dynamic from "next/dynamic"
import { useState } from "react"
import { OptionProps, components } from "react-select"

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false })

export interface CompaniesSelectProps {
  id?: string
  value?: Company
  onChange?: (value: Company) => void
}

export interface CompanySelectOption extends SelectOption {
  data: Company
}

export default function CompanySelect({
  id,
  value,
  onChange,
}: CompaniesSelectProps) {
  const defaultValue: CompanySelectOption | null = value
    ? { label: value.name, value: value.id, data: value }
    : null
  const [optionValue, setOptionValue] = useState<CompanySelectOption | null>(
    defaultValue,
  )
  const fetchData = async (query: string) => {
    try {
      const { data } = await serverFetch.get<AppUser[]>(
        "/companies/search?q=" + query,
      )

      return data.map((it) => ({ label: it.name, value: it.id, data: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }

  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (value: CompanySelectOption) => {
    setOptionValue(value)
    onChange?.(value.data)
  }

  const Option = (props: OptionProps<CompanySelectOption>) => {
    const {
      data: { data: company },
    } = props
    return (
      <div>
        <components.Option {...props}>
          <div>{company.name}</div>
        </components.Option>
      </div>
    )
  }

  return (
    <AsyncSelect
      id={id}
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      value={optionValue}
      onChange={(newVal) => handleChange(newVal as CompanySelectOption)}
      components={{
        Option: (props) => Option(props as OptionProps<CompanySelectOption>),
      }}
    />
  )
}
