import { UserRole } from "@/models/user"
import { z } from "zod"

export const updateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  name: z.string().min(2).max(50),
  role: z.nativeEnum(UserRole, {
    message: "User role is not selected or not in the list",
  }),
  phone: z.string().max(25).optional(),
  address: z.string().max(100).optional(),
})

export type UpdateUserData = z.output<typeof updateUserSchema>
