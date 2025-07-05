import { z } from "zod"

export const editInventorySchema = z.object({
  stock: z.number().min(1),
  minStock: z.number().min(0),
  maxStock: z.number().min(1),
  price: z.number().min(0),
})

export type EditInventoryItemData = z.output<typeof editInventorySchema>
