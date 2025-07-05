import { OrderStatus } from "@/models/order"
import { PaymentStatus } from "@/models/payment"
import { z } from "zod"

export const editOrderSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus, {
    message: "Order status is not selected or not in the list",
  }),
  paymentStatus: z.nativeEnum(PaymentStatus, {
    message: "Payment status is not selected or not in the list",
  }),
  trackingId: z.string().optional(),
})

export type EditOrderData = z.output<typeof editOrderSchema>
