import { z } from "zod"

export const singleVariantSchema = z.object({
  name: z.string().min(2, "Name should have at least 2 characters").max(50),
  brand: z.string().min(2).max(50),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().min(1, "Stock should be minimum of 1"),
  minStock: z.number().min(1, "Minimum Stock should be minimum of 1"),
  maxStock: z.number().min(1, "Maximum Stock should be minimum of 1"),
  image: z.string().optional(),
})

export type SingleVariantFormData = z.infer<typeof singleVariantSchema>

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name should have at least 2 characters").max(50),
  sku: z.string().min(3, "SKU should have at least 3 characters").max(50),
  description: z.string().max(500).optional(),
  stock: z.number().min(1, "Stock should be minimum of 1"),
  minStock: z.number().min(1, "Minimum Stock should be minimum of 1"),
  maxStock: z.number().min(1, "Maximum Stock should be minimum of 1"),
  price: z.number().min(0),
  image: z.string().optional(),
})

export const multiVariantSchema = z.object({
  name: z.string().min(2).max(50),
  brand: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  variants: z
    .array(productVariantSchema)
    .min(1, "At least one variant is required"),
})

export type MultiVariantFormData = z.infer<typeof multiVariantSchema>

export type ProductVariantData = z.infer<typeof productVariantSchema>

export const productVariantsSchema = z.array(productVariantSchema)

export const fullProductSchema = multiVariantSchema.extend({
  variants: productVariantsSchema,
})

export type ProductFormData = z.infer<typeof fullProductSchema>
