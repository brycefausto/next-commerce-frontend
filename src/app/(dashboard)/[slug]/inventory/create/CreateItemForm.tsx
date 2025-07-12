"use client"

import ProductSelect from "@/components/inputs/ProductSelect"
import ProductVariantSelect from "@/components/inputs/ProductVariantSelect"
import FormLayout from "@/components/layouts/FormLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSlug from "@/hooks/use-slug"
import { CreateInventoryItemDto } from "@/models/inventory"
import { Product, ProductVariant } from "@/models/product"
import { useUserContext } from "@/stores/user.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createItemAction } from "../actions"
import {
  CreateInventoryItemData,
  createInventorySchema,
} from "./CreateItemSchema"

export default function CreateInventoryPage() {
  const { user: appUser } = useUserContext()
  const { slugRouterPush } = useSlug()
  const [optionVariants, setOptionVariants] = useState<ProductVariant[]>([])
  const [variant, setVariant] = useState<ProductVariant>()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateInventoryItemData>({
    resolver: zodResolver(createInventorySchema),
  })

  const onSubmit = async (data: CreateInventoryItemData) => {
    const createDto: CreateInventoryItemDto = {
      variantId: data.variantId,
      vendorId: appUser?.id || "",
      stock: data.stock,
      minStock: data.minStock,
      maxStock: data.maxStock,
      price: data.price,
    }
    const resultState = await createItemAction(createDto)
    if (resultState.success) {
      slugRouterPush("/inventory")
    } else if (resultState.error) {
      toast.error(resultState.error)
    }
  }

  const handleProductSelect = (product: Product) => {
    setValue("productId", product.id)
    setValue("price", product.variants?.length ? product.variants[0].price : 0)
    setOptionVariants(product.variants || [])
  }

  return (
    <FormLayout>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <ProductSelect onChange={handleProductSelect} />
              {errors.productId && (
                <p className="text-sm text-red-500">
                  {errors.productId.message}
                </p>
              )}
            </div>
            {optionVariants.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="productVariant">Select Product Variant</Label>
                <ProductVariantSelect
                  id="productVariant"
                  options={optionVariants}
                  value={variant}
                  onChange={setVariant}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register("stock")} min={1} />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock</Label>
              <Input
                id="minStock"
                type="number"
                {...register("minStock")}
                min={1}
              />
              {errors.minStock && (
                <p className="text-sm text-red-500">
                  {errors.minStock.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Max Stock</Label>
              <Input
                id="maxStock"
                type="number"
                {...register("maxStock")}
                min={1}
              />
              {errors.maxStock && (
                <p className="text-sm text-red-500">
                  {errors.maxStock.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...register("price")}
                step={0.01}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Inventory"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormLayout>
  )
}
