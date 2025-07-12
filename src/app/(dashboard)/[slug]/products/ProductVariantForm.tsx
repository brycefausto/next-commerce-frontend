import ImageSelector from "@/components/image-holder/ImageSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
} from "react-hook-form"
import { toast } from "sonner"
import { ProductFormData } from "./ProductSchema"

export interface ProductVariantFormProps {
  fieldArray: UseFieldArrayReturn<ProductFormData, "variants", "fieldId">
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
  imageFiles: (File | undefined)[]
  onChangeImageFiles: (files: (File | undefined)[]) => void
  onDelete?: (id: string) => void
}

export default function ProductVariantForm({
  fieldArray: { fields, append, remove },
  register,
  errors,
  imageFiles,
  onChangeImageFiles,
  onDelete,
}: ProductVariantFormProps) {
  return (
    <div className="space-y-4">
      <div className="font-semibold">Variants</div>
      {fields.map((field, idx) => (
        <div key={field.fieldId} className="border rounded p-4 mb-2 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <ImageSelector
                baseUrl={BASE_ITEMS_IMAGE_URL}
                image={field.image || ""}
                file={imageFiles[idx]}
                required
                onChangeFile={(file) => {
                  try {
                    console.log({ imageFiles })
                    const updatedImageFiles = [...imageFiles]
                    updatedImageFiles[idx] = file
                    onChangeImageFiles(updatedImageFiles)
                  } catch (error: any) {
                    toast.error(error.message)
                  }
                }}
                width={200}
                height={200}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Name</Label>
              <Input
                {...register(`variants.${idx}.name` as const)}
                placeholder="Variant name"
              />
              {errors.variants?.[idx]?.name && (
                <p className="text-sm text-red-500">
                  {errors.variants[idx]?.name?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>SKU</Label>
              <Input
                {...register(`variants.${idx}.sku` as const)}
                placeholder="SKU"
              />
              {errors.variants?.[idx]?.sku && (
                <p className="text-sm text-red-500">
                  {errors.variants[idx]?.sku?.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register(`variants.${idx}.description` as const)}
              placeholder="Description"
            />
            {errors.variants?.[idx]?.description && (
              <p className="text-sm text-red-500">
                {errors.variants[idx]?.description?.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                {...register(`variants.${idx}.stock` as const, {
                  valueAsNumber: true,
                })}
                placeholder="Stock"
                min={1}
              />
              {errors.variants?.[idx]?.stock && (
                <p className="text-sm text-red-500">
                  {errors.variants[idx]?.stock?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>Min Stock</Label>
              <Input
                type="number"
                {...register(`variants.${idx}.minStock` as const, {
                  valueAsNumber: true,
                })}
                placeholder="Min Stock"
                min={1}
              />
              {errors.variants?.[idx]?.maxStock && (
                <p className="text-sm text-red-500">
                  {errors.variants[idx]?.minStock?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>Max Stock</Label>
              <Input
                type="number"
                {...register(`variants.${idx}.maxStock` as const, {
                  valueAsNumber: true,
                })}
                placeholder="Max Stock"
                min={1}
              />
              {errors.variants?.[idx]?.maxStock && (
                <p className="text-sm text-red-500">
                  {errors.variants[idx]?.maxStock?.message}
                </p>
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
                {...register(`variants.${idx}.price` as const, {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                min={0}
              />
              {errors.variants?.[idx]?.price && (
                <p className="text-sm text-red-500">
                  {errors.variants[idx]?.price?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                remove(idx)
                if (idx >= 0 && idx < imageFiles.length - 1) {
                  const updatedImageFiles = [...imageFiles].splice(idx, 0)
                  onChangeImageFiles(updatedImageFiles)
                }
                if (field.id) {
                  console.log("delete variant", field.id)
                  onDelete?.(field.id)
                }
              }}
              disabled={fields.length === 1}
            >
              Remove Variant
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          append({
            name: "",
            sku: "",
            description: "",
            stock: 1,
            minStock: 1,
            maxStock: 1,
            price: 0,
          })
        }
      >
        Add Variant
      </Button>
    </div>
  )
}
