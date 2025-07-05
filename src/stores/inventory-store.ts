import { create } from "zustand"

interface InventoryItem {
  id: number
  product_id: number
  quantity: number
  min_stock: number
  max_stock: number
  location?: string
  last_updated: string
  product?: {
    name: string
    price: number
  }
}

interface InventoryState {
  inventory: InventoryItem[]
  loading: boolean
  setInventory: (inventory: InventoryItem[]) => void
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void
  removeInventoryItem: (id: number) => void
  setLoading: (loading: boolean) => void
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: [],
  loading: false,
  setInventory: (inventory) => set({ inventory }),
  addInventoryItem: (item) =>
    set((state) => ({
      inventory: [...state.inventory, item],
    })),
  updateInventoryItem: (id, updatedItem) =>
    set((state) => ({
      inventory: state.inventory.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
    })),
  removeInventoryItem: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}))
