import { Company } from "./company"

export interface ProductVariant {
  id: string
  name: string
  sku: string
  product?: Product
  description: string
  image: string
  price: number
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  description: string
  image: string
  price: number
  company?: Company
  variants: ProductVariant[]
  defaultVariant?: ProductVariant
}

export interface ProductDto {
  name: string
  brand: string
  category: string
  description: string
  image: string
  price: number
  companyId: string
}

export interface ProductVariantDto {
  id?: string
  name: string
  sku: string
  description?: string
  image?: string
  price: number
  stock: number
}

export interface CreateProductVariantDto {
  id?: string
  name: string
  sku: string
  description?: string
  price: number
  stock: number
}

export interface CreateProductDto {
  name: string
  brand: string
  category: string
  description?: string
  companyId: string
  variants: CreateProductVariantDto[]
}

export interface UpdateProductVariantImageDto {
  id: string
  image: string
}

export interface UpdateProductImageDto {
  image: string
  variantImages?: UpdateProductVariantImageDto[]
}

export interface UpdateProductDto {
  name: string
  brand: string
  category: string
  description?: string
  companyId: string
  variants: ProductVariantDto[]
  deletedVariantIds: string[]
}

export interface ViewProductDto {
  id: string
  name: string
  brand: string
  category: string
  description: string
  image: string
  vendorId: string
  variants: ProductVariantDto[]
  defaultVariant?: ProductVariantDto
}
