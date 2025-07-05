"use server"

import { getSession } from "@/lib/auth"
import { productSchema } from "@/lib/validations"
import { mockDb } from "@/lib/database"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function createProductAction(formData: FormData) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      image_url: formData.get("image_url") as string,
      status: formData.get("status") as "active" | "inactive",
    }

    const validatedFields = productSchema.parse(data)

    const product = mockDb.products.create(validatedFields)
    return { success: true, id: product.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    }
  }
}

export async function getProductsAction() {
  await delay(200) // Simulate API call

  try {
    const products = mockDb.products.getAll()
    return { success: true, products }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch products",
    }
  }
}

export async function updateProductAction(id: number, formData: FormData) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      image_url: formData.get("image_url") as string,
      status: formData.get("status") as "active" | "inactive",
    }

    const validatedFields = productSchema.parse(data)

    const product = mockDb.products.update(id, validatedFields)
    if (!product) {
      throw new Error("Product not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    }
  }
}

export async function deleteProductAction(id: number) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const success = mockDb.products.delete(id)
    if (!success) {
      throw new Error("Product not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product",
    }
  }
}

export async function getProductByIdAction(id: number) {
  await delay(100) // Simulate API call

  try {
    const product = mockDb.products.findById(id)
    return { success: true, product }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    }
  }
}
