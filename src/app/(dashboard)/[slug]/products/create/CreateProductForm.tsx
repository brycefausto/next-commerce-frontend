"use client"

import FormLayout from "@/components/layouts/FormLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import useSlug from "@/hooks/use-slug"
import { CreateProductDto, ViewProductDto } from "@/models/product"
import { Package } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  createProductAction,
  updateProductVariantImageAction,
} from "../actions"
import MultiVariantForm from "./MultiVariantForm"
import SingleVariantForm from "./SingleVariantForm"

const EMPTY_PRODUCT: ViewProductDto = {
  id: "",
  name: "",
  brand: "",
  category: "",
  description: "",
  image: "",
  vendorId: "",
  defaultVariant: {
    name: "",
    sku: "",
    description: "",
    stock: 1,
    minStock: 1,
    maxStock: 100,
    price: 0,
    image: "",
  },
  variants: [
    {
      name: "",
      sku: "",
      description: "",
      stock: 1,
      minStock: 1,
      maxStock: 100,
      price: 0,
      image: "",
    },
  ],
}

export default function CreateProductPage() {
  const { slugRouterPush } = useSlug()
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [variantImageFiles, setVariantImageFiles] = useState<
    (File | undefined)[]
  >([undefined])
  const [isMultiVariant, setIsMultiVariant] = useState(false)
  const [product, setProduct] = useState(EMPTY_PRODUCT)

  const handleChangeField = (partialFields: Partial<ViewProductDto>) => {
    setProduct({ ...product, ...partialFields })
  }

  const handleChangeSingleVariantImage = (file?: File) => {
    setImageFile(file)
    if (variantImageFiles.length) {
      variantImageFiles[0] = file
    } else {
      variantImageFiles.push(file)
    }
    setVariantImageFiles([...variantImageFiles])
  }

  const handleReset = () => {
    setProduct(EMPTY_PRODUCT)
  }

  const onSubmit = async (createDto: CreateProductDto) => {
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

      const result = await createProductAction(createDto, imageFile)

      if (result.success && result.data) {
        for (const [i, variant] of result.data.variants.entries()) {
          const updateResult = await updateProductVariantImageAction(
            variant.id,
            filteredVariantImageFiles[i],
          )
          if (updateResult.error) {
            throw new Error(updateResult.error)
          }
        }
      } else if (result.error) {
        toast.error(result.error)
      }
      slugRouterPush("/products")
    } catch (e: any) {
      toast.error(e.message || "Failed to create product")
    }
  }

  return (
    <FormLayout>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Create New Product
              </CardTitle>
              <CardDescription>
                Add a new product to your inventory with single or multiple
                variants
              </CardDescription>
            </div>
            <div className="flex flex-1/2 items-center gap-3">
              <span className="text-sm font-medium">Single Variant</span>
              <Switch
                checked={isMultiVariant}
                onCheckedChange={setIsMultiVariant}
              />
              <span className="text-sm font-medium">Multi Variant</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isMultiVariant ? (
            <SingleVariantForm
              product={product}
              imageFile={imageFile}
              onSubmit={onSubmit}
              onChangeField={handleChangeField}
              onChangeImageFile={handleChangeSingleVariantImage}
              onReset={handleReset}
            />
          ) : (
            <MultiVariantForm
              product={product}
              imageFile={imageFile}
              variantImageFiles={variantImageFiles}
              onSubmit={onSubmit}
              onChangeField={handleChangeField}
              onChangeImageFile={setImageFile}
              onChangeVariantImageFiles={setVariantImageFiles}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </FormLayout>
  )
}
