import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(50),
  brand: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
})

const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name should have at least 2 characters").max(50),
  sku: z.string().min(3, "SKU should have at least 3 characters").max(50),
  description: z.string().max(500).optional(),
  stock: z.number().min(1, "Stock should be minimum of 1"),
  minStock: z.number().min(1, "Minimum Stock should be minimum of 1"),
  maxStock: z.number().min(1, "Maximum Stock should be minimum of 1"),
  price: z.number().min(0),
  image: z.string().optional()
})

export const productVariantsSchema = z.array(productVariantSchema)

export const fullProductSchema = productSchema.extend({ variants: productVariantsSchema });

export type ProductFormData = z.infer<typeof fullProductSchema>;