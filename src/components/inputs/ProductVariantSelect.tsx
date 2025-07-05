/* eslint-disable @typescript-eslint/no-explicit-any */
import { getErrorMessage } from '@/lib/serverFetch';
import { ProductVariant } from '@/models/product';
import { SelectOption } from '@/types';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { OptionProps, components } from 'react-select';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface ProductVariantProps {
  id?: string
  options: ProductVariant[],
  value?: ProductVariant
  onChange?: (value: ProductVariant) => void
}

export interface ProductVariantOption extends SelectOption {
  data: ProductVariant
}

export default function ProductVariantSelect({ id, options, value, onChange }: ProductVariantProps) {
  const defaultValue: ProductVariantOption | null = value ? { label: value.name, value: value.id, data: value } : null;
  const [optionValue, setOptionValue] = useState<ProductVariantOption | null>(defaultValue)
  const fetchData = async (query: string) => {
    try {
      const data = options.filter(it => it.name.match(query) || it.sku.match(query))

      return data.map(it => ({ label: it.name, value: it.id, data: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }

  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (value: ProductVariantOption) => {
    setOptionValue(value)
    onChange?.(value.data)
  }

  const Option = (props: OptionProps<ProductVariantOption>) => {
    const { data: { data } } = props
    return (
      <div>
        <components.Option {...props}>
          <div>{data.name}</div>
          <div>{data.sku}</div>
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
      onChange={(newVal) => handleChange(newVal as ProductVariantOption)}
      components={{
        Option: (props) => Option(props as OptionProps<ProductVariantOption>)
      }}
    />
  )
}
