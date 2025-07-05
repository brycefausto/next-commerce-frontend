"use server"

import { getSession } from "@/lib/auth"
import { orderSchema, orderStatusSchema } from "@/lib/validations"
import { mockDb } from "@/lib/database"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function createOrderAction(formData: FormData, items: any[]) {
  await delay(500) // Simulate API call

  try {
    const data = {
      customer_name: formData.get("customer_name") as string,
      customer_email: formData.get("customer_email") as string,
      customer_phone: formData.get("customer_phone") as string,
      payment_method: formData.get("payment_method") as "cash" | "bank_transfer",
      notes: formData.get("notes") as string,
    }

    const validatedFields = orderSchema.parse(data)
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = mockDb.orders.create(
      {
        ...validatedFields,
        total_amount: totalAmount,
        status: "pending",
      },
      items,
    )

    return { success: true, orderId: order.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    }
  }
}

export async function getOrdersAction() {
  await delay(200) // Simulate API call

  try {
    const orders = mockDb.orders.getAll()
    return { success: true, orders }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    }
  }
}

export async function getOrderByIdAction(id: number) {
  await delay(150) // Simulate API call

  try {
    const order = mockDb.orders.findById(id)
    if (!order) {
      throw new Error("Order not found")
    }

    return { success: true, order }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    }
  }
}

export async function updateOrderStatusAction(id: number, status: string) {
  await delay(200) // Simulate API call

  try {
    await getSession() // Verify authentication

    const validatedFields = orderStatusSchema.parse({ status })

    const order = mockDb.orders.updateStatus(id, validatedFields.status)
    if (!order) {
      throw new Error("Order not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status",
    }
  }
}

export async function deleteOrderAction(id: number) {
  await delay(300) // Simulate API call

  try {
    await getSession() // Verify authentication

    const success = mockDb.orders.delete(id)
    if (!success) {
      throw new Error("Order not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    }
  }
}
