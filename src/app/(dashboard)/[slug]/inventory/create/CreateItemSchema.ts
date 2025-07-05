import { z } from "zod"

export const createInventorySchema = z.object({
  productId: z.string({ message: "Please select a product." }),
  variantId: z.string({ message: "Please select a product variant." }),
  stock: z.number().min(1),
  minStock: z.number().min(0),
  maxStock: z.number().min(1),
  price: z.number().min(0),
})

export type CreateInventoryItemData = z.output<typeof createInventorySchema> & {
  vendorId?: number
}
