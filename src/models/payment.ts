import { Company } from "./company"
import { Order } from "./order"
import { AppUser } from "./user"

export enum PaymentStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
  REFUNDED = "Refunded",
  NONE = "",
}

export const paymentStatuses = Object.values(PaymentStatus).filter(
  (status) => status !== PaymentStatus.NONE
)

export interface Payment {
  id: string
  order: Order
  company?: Company
  paymentMethod?: string
  updatedBy?: AppUser
  amount: number
  status: PaymentStatus
}
