import { UserRole } from "@/models/user"
import { z } from "zod"

export const createUserSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    name: z.string().min(2).max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    confirmPassword: z.string().max(25),
    role: z.nativeEnum(UserRole, {
      message: "User role is not selected or not in the list",
    }),
    phone: z.string().max(25).optional(),
    address: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type CreateUserData = z.output<typeof createUserSchema>
