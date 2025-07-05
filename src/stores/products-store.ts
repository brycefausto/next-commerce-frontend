import { create } from "zustand"

interface Product {
  id: number
  name: string
  description?: string
  price: number
  category?: string
  image_url?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

interface ProductsState {
  products: Product[]
  loading: boolean
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  removeProduct: (id: number) => void
  setLoading: (loading: boolean) => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}))
