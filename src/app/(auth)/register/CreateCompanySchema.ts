import { UserRole } from "@/models/user"
import { z } from "zod"

export const createCompanySchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  phone: z.string().max(25).optional(),
  address: z.string().max(100),
  address2: z.string().max(100).optional(),
  city: z.string().max(100),
  state: z.string().max(100),
  zipCode: z.string().max(5).optional(),
  country: z.string().max(100),
  description: z.string().max(500).optional(),
})

export const createUserSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    name: z.string().min(2).max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    confirmPassword: z.string().max(25),
    phone: z.string().max(25).optional(),
    address: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type CreateCompanyData = z.output<typeof createCompanySchema> & { logoUrl?: string, logoFile?: File }
export type CreateUserData = z.output<typeof createUserSchema>
