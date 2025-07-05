import { z } from "zod"

export const updateCompanySchema = z.object({
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

export type UpdateCompanyData = z.output<typeof updateCompanySchema>
