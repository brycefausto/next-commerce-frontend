import { z } from "zod";

export const createOrderSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  phone: z.string().max(25).optional(),
  address: z.string().max(100),
  address2: z.string().max(100).optional(),
  city: z.string().max(100),
  state: z.string().max(100),
  zipCode: z.string().max(5).optional(),
  country: z.string().max(100),
});

export type CreateOrderData = z.output<typeof createOrderSchema>
