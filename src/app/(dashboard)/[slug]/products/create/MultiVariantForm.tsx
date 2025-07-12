"use client"

import ImageSelector from "@/components/image-holder/ImageSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import {
  CreateProductDto,
  ProductVariantDto,
  ViewProductDto,
} from "@/models/product"
import { useCompanyContext } from "@/stores/company.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { MultiVariantFormData, multiVariantSchema } from "../ProductSchema"
import ProductVariantForm from "../ProductVariantForm"

export interface MultiVariantFormProps {
  product: ViewProductDto
  imageFile?: File
  variantImageFiles: (File | undefined)[]
  onSubmit: (createDto: CreateProductDto) => Promise<void>
  onChangeField: (partialFields: Partial<ViewProductDto>) => void
  onChangeImageFile: (imageFile?: File) => void
  onChangeVariantImageFiles: (imageFiles: (File | undefined)[]) => void
  onReset: () => void
}

export default function MultiVariantForm({
  product,
  imageFile,
  variantImageFiles,
  onSubmit: onSubmitProp,
  onChangeField,
  onChangeImageFile,
  onChangeVariantImageFiles,
  onReset,
}: MultiVariantFormProps) {
  const { company } = useCompanyContext()

  const {
    register,
    handleSubmit,
    control,
    reset,
    subscribe,
    formState: { errors, isSubmitting },
  } = useForm<MultiVariantFormData>({
    resolver: zodResolver(multiVariantSchema),
    defaultValues: {
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      variants: product.variants,
    },
  })

  const fieldArray = useFieldArray({
    control,
    name: "variants",
    keyName: "fieldId",
  })

  subscribe({
    formState: { values: true },
    callback: ({ values }) => {
      const variants: ProductVariantDto[] = values.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        description: variant.description,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        minStock: variant.minStock,
        maxStock: variant.maxStock,
      }))
      onChangeField({
        name: values.name,
        brand: values.brand,
        category: values.category,
        description: values.description,
        defaultVariant: variants[0],
        variants,
      })
    },
  })

  const onSubmit = async (data: MultiVariantFormData) => {
    try {
      if (!imageFile) {
        throw new Error("Image is required.")
      }
      const filteredVariantImageFiles = variantImageFiles.filter(
        (file) => !!file,
      )
      if (filteredVariantImageFiles.length !== variantImageFiles.length) {
        throw new Error("Variant Images are missing.")
      }

      const createDto: CreateProductDto = {
        ...data,
        variants: data.variants || [],
        companyId: company?.id || "",
      }
      onSubmitProp(createDto)
    } catch (e: any) {
      toast.error(e.message || "Failed to create product")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <ImageSelector
          file={imageFile}
          baseUrl={BASE_ITEMS_IMAGE_URL}
          required
          onChangeFile={onChangeImageFile}
          width={200}
          height={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register("name")} placeholder="Product name" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" {...register("brand")} placeholder="Brand" />
        {errors.brand && (
          <p className="text-sm text-red-500">{errors.brand.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" {...register("category")} placeholder="Category" />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <ProductVariantForm
        imageFiles={variantImageFiles}
        fieldArray={fieldArray}
        register={register}
        errors={errors}
        onChangeImageFiles={onChangeVariantImageFiles}
      />
      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          type="reset"
          onClick={() => {
            onChangeImageFile()
            onReset()
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
