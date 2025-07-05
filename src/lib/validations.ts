import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SuperAdmin", "Admin"]),
})

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
})

export const inventorySchema = z.object({
  product_id: z.number().min(1, "Product is required"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  min_stock: z.number().min(0, "Minimum stock must be non-negative"),
  max_stock: z.number().min(1, "Maximum stock must be positive"),
  location: z.string().optional(),
})

export const orderSchema = z.object({
  customer_name: z.string().min(2, "Customer name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().optional(),
  payment_method: z.enum(["cash", "bank_transfer"]),
  notes: z.string().optional(),
})

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
})

export const settingsSchema = z.object({
  // General Settings
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Contact phone is required"),

  // Business Settings
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  lowStockThreshold: z.number().min(0, "Low stock threshold must be positive"),

  // Notification Settings
  emailNotifications: z.boolean(),
  lowStockAlerts: z.boolean(),
  orderNotifications: z.boolean(),

  // Display Settings
  itemsPerPage: z.number().min(5).max(100, "Items per page must be between 5 and 100"),
  defaultView: z.enum(["grid", "list"]),
  showOutOfStock: z.boolean(),

  // Security Settings
  sessionTimeout: z.number().min(1).max(168, "Session timeout must be between 1 and 168 hours"),
  requireStrongPasswords: z.boolean(),
  maxLoginAttempts: z.number().min(1).max(10, "Max login attempts must be between 1 and 10"),

  // Shop Settings
  allowGuestCheckout: z.boolean(),
  requirePhoneNumber: z.boolean(),
  autoApproveOrders: z.boolean(),
  defaultOrderStatus: z.enum(["pending", "processing", "completed"]),
})
