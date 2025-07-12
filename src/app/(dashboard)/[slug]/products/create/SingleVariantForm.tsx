"use client"

import ImageSelector from "@/components/image-holder/ImageSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import { CreateProductDto, ViewProductDto } from "@/models/product"
import { useCompanyContext } from "@/stores/company.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { SingleVariantFormData, singleVariantSchema } from "../ProductSchema"

export interface SingleVariantFormProps {
  product: ViewProductDto
  imageFile?: File
  onSubmit: (createDto: CreateProductDto) => Promise<void>
  onChangeField: (partialFields: Partial<ViewProductDto>) => void
  onChangeImageFile: (imageFile?: File) => void
  onReset: () => void
}

export default function SingleVariantForm({
  product,
  imageFile,
  onSubmit: onSubmitProp,
  onChangeField,
  onChangeImageFile,
  onReset,
}: SingleVariantFormProps) {
  const { company } = useCompanyContext()
  const {
    register,
    handleSubmit,
    subscribe,
    formState: { errors, isSubmitting },
  } = useForm<SingleVariantFormData>({
    resolver: zodResolver(singleVariantSchema),
    defaultValues: {
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.defaultVariant?.price,
      sku: product.defaultVariant?.sku,
      stock: product.defaultVariant?.stock,
      minStock: product.defaultVariant?.minStock,
      maxStock: product.defaultVariant?.maxStock,
    },
  })

  subscribe({
    formState: { values: true },
    callback: ({ values }) => {
      const defaultVariant = {
        ...product.variants[0],
        name: values.name,
        description: values.description,
        price: values.price,
        sku: values.sku,
        stock: values.stock,
        minStock: values.minStock,
        maxStock: values.maxStock,
      }
      onChangeField({
        name: values.name,
        brand: values.brand,
        category: values.category,
        description: values.description,
        defaultVariant,
        variants: [{ ...defaultVariant }],
      })
    },
  })

  const onSubmit = async (data: SingleVariantFormData) => {
    try {
      if (!imageFile) {
        throw new Error("Image is required.")
      }

      const createDto: CreateProductDto = {
        name: data.name,
        brand: data.brand,
        category: data.category,
        description: data.description,
        variants: [
          {
            name: data.name,
            description: data.description,
            price: data.price,
            sku: data.sku,
            stock: data.stock,
            minStock: data.minStock,
            maxStock: data.maxStock,
          },
        ],
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
      <div className="flex-1 space-y-2">
        <Label>Price</Label>
        <Input
          startContent={
            <div className="pointer-events-none">
              <span className="text-default-400 text-small">₱</span>
            </div>
          }
          type="number"
          step="0.01"
          {...register("price", {
            valueAsNumber: true,
          })}
          placeholder="0.00"
          min={0}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price?.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Textarea id="sku" {...register("sku")} placeholder="SKU" />
        {errors.sku && (
          <p className="text-sm text-red-500">{errors.sku.message}</p>
        )}
      </div>
      <div className="flex grid-cols-3 gap-3 justify-between">
        <div className="space-y-2">
          <Label>Stock</Label>
          <Input
            type="number"
            {...register("stock", {
              valueAsNumber: true,
            })}
            placeholder="Stock"
            min={1}
          />
          {errors.stock && (
            <p className="text-sm text-red-500">{errors.stock?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Min Stock</Label>
          <Input
            type="number"
            {...register("minStock", {
              valueAsNumber: true,
            })}
            placeholder="Stock"
            min={1}
            defaultValue={1}
          />
          {errors.minStock && (
            <p className="text-sm text-red-500">{errors.minStock?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Max Stock</Label>
          <Input
            type="number"
            {...register("maxStock", {
              valueAsNumber: true,
            })}
            placeholder="Stock"
            min={1}
            defaultValue={100}
          />
          {errors.maxStock && (
            <p className="text-sm text-red-500">{errors.maxStock?.message}</p>
          )}
        </div>
      </div>
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
