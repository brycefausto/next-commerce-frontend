"use client"

import ImageSelector from "@/components/image-holder/ImageSelector"
import FormLayout from "@/components/layouts/FormLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import useSlug from "@/hooks/use-slug"
import { UpdateProductDto, ViewProductDto } from "@/models/product"
import { useCompanyContext } from "@/stores/company.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  updateProductAction,
  updateProductVariantImageAction,
} from "../../actions"
import { fullProductSchema, ProductFormData } from "../../ProductSchema"
import ProductVariantForm from "../../ProductVariantForm"

interface EditProductFormProps {
  product: ViewProductDto
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const { company } = useCompanyContext()
  const { slugRouterPush } = useSlug()
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [variantImageFiles, setVariantImageFiles] = useState<
    (File | undefined)[]
  >([undefined])
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(fullProductSchema),
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

  const onSubmit = async (data: ProductFormData) => {
    setSuccess(false)
    try {
      const updateDto: UpdateProductDto = {
        ...data,
        companyId: company?.id || "",
        deletedVariantIds,
      }
      console.log({ updateDto })
      const result = await updateProductAction(product.id, updateDto, imageFile)
      console.log({ result })

      if (result.success && result.data) {
        console.log({ productResult: result.data })
        for (const [i, variant] of result.data.variants.entries()) {
          if (variantImageFiles[i]) {
            const updateResult = await updateProductVariantImageAction(
              variant.id,
              variantImageFiles[i],
            )
            if (updateResult.error) {
              throw new Error(updateResult.error)
            }
          }
        }
      } else {
        throw new Error(result.error)
      }
      setSuccess(true)
      slugRouterPush("/products")
    } catch (e: any) {
      toast.error(e.message || "Failed to create product")
    }
  }

  return (
    <FormLayout>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <ImageSelector
                baseUrl={BASE_ITEMS_IMAGE_URL}
                image={product.image}
                required
                onChangeFile={setImageFile}
                width={200}
                height={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Product name"
              />
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
              <Input
                id="category"
                {...register("category")}
                placeholder="Category"
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
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
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <ProductVariantForm
              imageFiles={variantImageFiles}
              fieldArray={fieldArray}
              register={register}
              errors={errors}
              onChangeImageFiles={setVariantImageFiles}
              onDelete={(id) => {
                const updatedIds = [...deletedVariantIds]
                updatedIds.push(id)
                console.log("setDeletedVariantIds - id", id)
                setDeletedVariantIds(updatedIds)
              }}
            />
            {success && (
              <p className="text-sm text-green-600">
                Product created successfully! Redirecting...
              </p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormLayout>
  )
}
