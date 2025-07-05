"use server"

import { getSession } from "@/lib/auth"
import { inventorySchema } from "@/lib/validations"
import { mockDb } from "@/lib/database"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function createInventoryAction(formData: FormData) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const data = {
      product_id: Number.parseInt(formData.get("product_id") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      min_stock: Number.parseInt(formData.get("min_stock") as string),
      max_stock: Number.parseInt(formData.get("max_stock") as string),
      location: formData.get("location") as string,
    }

    const validatedFields = inventorySchema.parse(data)

    const item = mockDb.inventory.create(validatedFields)
    return { success: true, id: item.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create inventory item",
    }
  }
}

export async function getInventoryAction() {
  await delay(200) // Simulate API call

  try {
    const inventory = mockDb.inventory.getAll()
    return { success: true, inventory }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch inventory",
    }
  }
}

export async function updateInventoryAction(id: number, formData: FormData) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const data = {
      product_id: Number.parseInt(formData.get("product_id") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      min_stock: Number.parseInt(formData.get("min_stock") as string),
      max_stock: Number.parseInt(formData.get("max_stock") as string),
      location: formData.get("location") as string,
    }

    const validatedFields = inventorySchema.parse(data)

    const item = mockDb.inventory.update(id, validatedFields)
    if (!item) {
      throw new Error("Inventory item not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update inventory item",
    }
  }
}

export async function deleteInventoryAction(id: number) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const success = mockDb.inventory.delete(id)
    if (!success) {
      throw new Error("Inventory item not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete inventory item",
    }
  }
}

export async function updateInventoryQuantityAction(productId: number, quantity: number) {
  await delay(100) // Simulate API call

  try {
    await getSession() // Verify authentication

    const item = mockDb.inventory.updateQuantity(productId, quantity)
    if (!item) {
      throw new Error("Inventory item not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update inventory quantity",
    }
  }
}
