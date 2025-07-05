"use client"

import ImageSelector from "@/components/image-holder/ImageSelector"
import FormLayout from "@/components/layouts/FormLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import { CreateProductDto } from "@/models/product"
import { useCompanyContext } from "@/stores/company.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  createProductAction,
  updateProductVariantImageAction,
} from "../actions"
import { fullProductSchema, ProductFormData } from "../ProductSchema"
import ProductVariantForm from "../ProductVariantForm"

export default function CreateProductPage() {
  const { company } = useCompanyContext()
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [variantImageFiles, setVariantImageFiles] = useState<
    (File | undefined)[]
  >([undefined])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(fullProductSchema),
    defaultValues: {
      variants: [{ name: "", sku: "", description: "", stock: 1, price: 0 }],
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
        companyId: company?.id || "",
      }
      const result = await createProductAction(createDto, imageFile)

      if (result.success && result.data) {
        for (let [i, variant] of result.data.variants.entries()) {
          const updateResult = await updateProductVariantImageAction(
            variant.id,
            filteredVariantImageFiles[i],
          )
          if (updateResult.error) {
            throw new Error(updateResult.error)
          }
        }
      }
      setSuccess(true)
      reset()
      setTimeout(() => router.push("/dashboard/products"), 1200)
    } catch (e: any) {
      toast.error(e.message || "Failed to create product")
    }
  }

  return (
    <FormLayout>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <ImageSelector
                baseUrl={BASE_ITEMS_IMAGE_URL}
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
              fieldArray={fieldArray}
              register={register}
              errors={errors}
              onChangeVariantImageFiles={setVariantImageFiles}
            />
            {success && (
              <p className="text-sm text-green-600">
                Product created successfully! Redirecting...
              </p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormLayout>
  )
}
