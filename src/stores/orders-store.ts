import { create } from "zustand"

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  product?: {
    name: string
  }
}

interface Order {
  id: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  total_amount: number
  payment_method: "cash" | "bank_transfer"
  status: "pending" | "processing" | "completed" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

interface OrdersState {
  orders: Order[]
  loading: boolean
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrder: (id: number, order: Partial<Order>) => void
  removeOrder: (id: number) => void
  setLoading: (loading: boolean) => void
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  loading: false,
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  updateOrder: (id, updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, ...updatedOrder } : order)),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}))
