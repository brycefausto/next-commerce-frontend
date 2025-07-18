import { AddressInfo } from "./addressInfo"
import { Company } from "./company"
import { Payment, PaymentStatus } from "./payment"
import { ProductVariant } from "./product"

export enum OrderItemStatus {
  PENDING = "Pending",
  PAID = "Paid",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  NONE = "",
}

export interface OrderItem {
  id: string
  order?: Order
  productVariant?: ProductVariant
  status: OrderItemStatus
  quantity: number
  price: number
}

export enum OrderStatus {
  PENDING = "Pending",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  REFUNDED = "Refunded",
  NONE = "",
}

export const orderStatuses = Object.values(OrderStatus).filter(
  (status) => status !== OrderStatus.NONE,
)

export interface Customer {
  firstName: string
  lastName: string
  fullName: string
  email: string
  address: AddressInfo
  phone?: string
}

export interface Order {
  id: string
  company?: Company
  customer?: Customer
  payment?: Payment
  status: OrderStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  trackingId: string
  shippingAddress: AddressInfo
  billingAddress: AddressInfo
  items: OrderItem[]
  createdAt: string
}

export interface OrderItemDto {
  id?: string
  productVariantId: string
  status?: OrderStatus
  quantity: number
  price: number
}

export interface CreateCustomerDto {
  firstName: string
  lastName: string
  email: string
  address: AddressInfo
  phone?: string
}

export interface CreatePaymentDto {
  paymentMethod?: string
  amount: number
  status: PaymentStatus
}

export interface CreateOrderDto {
  companyId: string
  customerId?: string
  customerDto?: CreateCustomerDto
  payment: CreatePaymentDto
  status?: OrderStatus
  subtotal: number
  shipping: number
  total: number
  shippingAddress: AddressInfo
  billingAddress?: AddressInfo
  items: OrderItemDto[]
}

export interface UpdateOrderDto {
  status: OrderStatus
  total: number
  shippingAddress: string
  items: OrderItemDto[]
  deletedItemIds: string[]
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
  paymentStatus?: PaymentStatus
  trackingId?: string
}

export interface OrderQueryParams {
  page?: number
  limit?: number
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface OrderCountReport {
  pendingCount: number
  shippedCount: number
  deliveredCount: number
  cancelledCount: number
  refundedCount: number
}
