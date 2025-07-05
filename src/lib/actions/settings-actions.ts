"use server"

import { getSession } from "@/lib/auth"
import { settingsSchema } from "@/lib/validations"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function updateSettingsAction(formData: FormData) {
  await delay(300) // Simulate API call

  try {
    const session = await getSession()
    if (!session || session.role !== "SuperAdmin") {
      throw new Error("Unauthorized - Only SuperAdmin can modify settings")
    }

    const data = {
      // General Settings
      siteName: formData.get("siteName") as string,
      siteDescription: formData.get("siteDescription") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,

      // Business Settings
      currency: formData.get("currency") as string,
      taxRate: Number.parseFloat(formData.get("taxRate") as string),
      lowStockThreshold: Number.parseInt(formData.get("lowStockThreshold") as string),

      // Notification Settings
      emailNotifications: formData.get("emailNotifications") === "true",
      lowStockAlerts: formData.get("lowStockAlerts") === "true",
      orderNotifications: formData.get("orderNotifications") === "true",

      // Display Settings
      itemsPerPage: Number.parseInt(formData.get("itemsPerPage") as string),
      defaultView: formData.get("defaultView") as "grid" | "list",
      showOutOfStock: formData.get("showOutOfStock") === "true",

      // Security Settings
      sessionTimeout: Number.parseInt(formData.get("sessionTimeout") as string),
      requireStrongPasswords: formData.get("requireStrongPasswords") === "true",
      maxLoginAttempts: Number.parseInt(formData.get("maxLoginAttempts") as string),

      // Shop Settings
      allowGuestCheckout: formData.get("allowGuestCheckout") === "true",
      requirePhoneNumber: formData.get("requirePhoneNumber") === "true",
      autoApproveOrders: formData.get("autoApproveOrders") === "true",
      defaultOrderStatus: formData.get("defaultOrderStatus") as "pending" | "processing" | "completed",
    }

    const validatedFields = settingsSchema.parse(data)

    // In a real app, this would save to database
    // For now, we'll just return success
    return { success: true, settings: validatedFields }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings",
    }
  }
}

export async function getSettingsAction() {
  await delay(200) // Simulate API call

  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // In a real app, this would fetch from database
    // For now, we'll return default settings
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch settings",
    }
  }
}
