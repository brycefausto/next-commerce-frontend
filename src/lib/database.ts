// Mock database using in-memory storage
import bcrypt from "bcryptjs"

// Mock data storage
const mockUsers: any[] = []
const mockProducts: any[] = []
let mockInventory: any[] = []
const mockOrders: any[] = []
let mockOrderItems: any[] = []

// Auto-increment IDs
let userIdCounter = 1
let productIdCounter = 1
let inventoryIdCounter = 1
let orderIdCounter = 1
let orderItemIdCounter = 1

// Initialize mock data
export async function initializeDatabase() {
  // Create default SuperAdmin user
  if (mockUsers.length === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 12)
    mockUsers.push({
      id: userIdCounter++,
      email: "admin@example.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "SuperAdmin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Add some sample data
    mockProducts.push(
      {
        id: productIdCounter++,
        name: "Laptop Computer",
        description: "High-performance laptop for business and gaming",
        price: 999.99,
        category: "Electronics",
        image_url: "/placeholder.svg?height=300&width=300",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: productIdCounter++,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with long battery life",
        price: 29.99,
        category: "Electronics",
        image_url: "/placeholder.svg?height=300&width=300",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: productIdCounter++,
        name: "Office Chair",
        description: "Comfortable ergonomic office chair",
        price: 199.99,
        category: "Furniture",
        image_url: "/placeholder.svg?height=300&width=300",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    )

    // Add inventory for products
    mockInventory.push(
      {
        id: inventoryIdCounter++,
        product_id: 1,
        quantity: 50,
        min_stock: 10,
        max_stock: 100,
        location: "Warehouse A",
        last_updated: new Date().toISOString(),
        product_name: "Laptop Computer",
        product_price: 999.99,
      },
      {
        id: inventoryIdCounter++,
        product_id: 2,
        quantity: 5, // Low stock
        min_stock: 20,
        max_stock: 200,
        location: "Warehouse B",
        last_updated: new Date().toISOString(),
        product_name: "Wireless Mouse",
        product_price: 29.99,
      },
      {
        id: inventoryIdCounter++,
        product_id: 3,
        quantity: 25,
        min_stock: 5,
        max_stock: 50,
        location: "Warehouse A",
        last_updated: new Date().toISOString(),
        product_name: "Office Chair",
        product_price: 199.99,
      },
    )
  }
}

// Mock database operations
export const mockDb = {
  // Users
  users: {
    findByEmail: (email: string) => mockUsers.find((user) => user.email === email),
    findById: (id: number) => mockUsers.find((user) => user.id === id),
    create: (userData: any) => {
      const user = {
        id: userIdCounter++,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockUsers.push(user)
      return user
    },
    getAll: () => mockUsers.map(({ password, ...user }) => user),
    delete: (id: number) => {
      const index = mockUsers.findIndex((user) => user.id === id)
      if (index > -1) {
        mockUsers.splice(index, 1)
        return true
      }
      return false
    },
  },

  // Products
  products: {
    getAll: () => mockProducts,
    findById: (id: number) => mockProducts.find((product) => product.id === id),
    create: (productData: any) => {
      const product = {
        id: productIdCounter++,
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockProducts.push(product)
      return product
    },
    update: (id: number, productData: any) => {
      const index = mockProducts.findIndex((product) => product.id === id)
      if (index > -1) {
        mockProducts[index] = {
          ...mockProducts[index],
          ...productData,
          updated_at: new Date().toISOString(),
        }
        return mockProducts[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = mockProducts.findIndex((product) => product.id === id)
      if (index > -1) {
        mockProducts.splice(index, 1)
        // Also remove related inventory
        mockInventory = mockInventory.filter((item) => item.product_id !== id)
        return true
      }
      return false
    },
  },

  // Inventory
  inventory: {
    getAll: () => mockInventory,
    findById: (id: number) => mockInventory.find((item) => item.id === id),
    findByProductId: (productId: number) => mockInventory.find((item) => item.product_id === productId),
    create: (inventoryData: any) => {
      const product = mockProducts.find((p) => p.id === inventoryData.product_id)
      const item = {
        id: inventoryIdCounter++,
        ...inventoryData,
        last_updated: new Date().toISOString(),
        product_name: product?.name || "",
        product_price: product?.price || 0,
      }
      mockInventory.push(item)
      return item
    },
    update: (id: number, inventoryData: any) => {
      const index = mockInventory.findIndex((item) => item.id === id)
      if (index > -1) {
        const product = mockProducts.find((p) => p.id === inventoryData.product_id)
        mockInventory[index] = {
          ...mockInventory[index],
          ...inventoryData,
          last_updated: new Date().toISOString(),
          product_name: product?.name || mockInventory[index].product_name,
          product_price: product?.price || mockInventory[index].product_price,
        }
        return mockInventory[index]
      }
      return null
    },
    updateQuantity: (productId: number, quantityChange: number) => {
      const index = mockInventory.findIndex((item) => item.product_id === productId)
      if (index > -1) {
        mockInventory[index].quantity = Math.max(0, mockInventory[index].quantity - quantityChange)
        mockInventory[index].last_updated = new Date().toISOString()
        return mockInventory[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = mockInventory.findIndex((item) => item.id === id)
      if (index > -1) {
        mockInventory.splice(index, 1)
        return true
      }
      return false
    },
  },

  // Orders
  orders: {
    getAll: () => mockOrders,
    findById: (id: number) => {
      const order = mockOrders.find((order) => order.id === id)
      if (order) {
        const items = mockOrderItems
          .filter((item) => item.order_id === id)
          .map((item) => {
            const product = mockProducts.find((p) => p.id === item.product_id)
            return {
              ...item,
              product_name: product?.name || "Unknown Product",
            }
          })
        return { ...order, items }
      }
      return null
    },
    create: (orderData: any, items: any[]) => {
      const order = {
        id: orderIdCounter++,
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockOrders.push(order)

      // Create order items
      items.forEach((item) => {
        mockOrderItems.push({
          id: orderItemIdCounter++,
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })

        // Update inventory
        mockDb.inventory.updateQuantity(item.id, item.quantity)
      })

      return order
    },
    updateStatus: (id: number, status: string) => {
      const index = mockOrders.findIndex((order) => order.id === id)
      if (index > -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          status,
          updated_at: new Date().toISOString(),
        }
        return mockOrders[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = mockOrders.findIndex((order) => order.id === id)
      if (index > -1) {
        mockOrders.splice(index, 1)
        // Remove order items
        mockOrderItems = mockOrderItems.filter((item) => item.order_id !== id)
        return true
      }
      return false
    },
  },
}

// Initialize on import
initializeDatabase()

export default mockDb
