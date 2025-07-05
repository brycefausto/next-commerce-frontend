import { Product, ProductVariant } from "./product"
import { AppUser } from "./user"

export interface CreateInventoryItemDto {
  vendorId: string
  variantId: string
  stock: number
  minStock: number
  maxStock: number
  price: number
}

export interface UpdateInventoryItemDto {
  minStock: number
  maxStock: number
  stock: number
  price: number
}
export interface InventoryItem {
  id: string
  variant?: ProductVariant
  product?: Product
  vendor?: AppUser
  image: string
  stock: number
  minStock: number
  maxStock: number
  price: number
}
