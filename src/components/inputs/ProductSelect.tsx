/* eslint-disable @typescript-eslint/no-explicit-any */
import serverFetch, { getErrorMessage } from '@/lib/serverFetch';
import { Product } from '@/models/product';
import { useCompanyContext } from '@/stores/company.store';
import { SelectOption } from '@/types';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { OptionProps, components } from 'react-select';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface ProductSelectProps {
  id?: string
  value?: Product
  onChange?: (value: Product) => void
}

export interface ProductSelectOption extends SelectOption {
  data: Product
}

export default function ProductSelect({ id, value, onChange }: ProductSelectProps) {
  const { company } = useCompanyContext()
  const defaultValue: ProductSelectOption | null = value ? { label: value.name, value: value.id, data: value } : null;
  const [optionValue, setOptionValue] = useState<ProductSelectOption | null>(defaultValue)
  const fetchData = async (query: string) => {
    try {
      const { data } = await serverFetch.get<Product[]>('/products/search?q=' + query + '&companyId=' + (company?.id || ""))

      return data.map(it => ({ label: it.name, value: it.id, data: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }

  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (value: ProductSelectOption) => {
    setOptionValue(value)
    onChange?.(value.data)
  }

  const Option = (props: OptionProps<ProductSelectOption>) => {
    const { data: { data } } = props
    return (
      <div>
        <components.Option {...props}>
          <div>{data?.name}</div>
        </components.Option>
      </div>
    );
  };

  return (
    <AsyncSelect
      id={id}
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      value={optionValue}
      onChange={(newVal) => handleChange(newVal as ProductSelectOption)}
      components={{
        Option: (props) => Option(props as OptionProps<ProductSelectOption>)
      }}
    />
  )
}
