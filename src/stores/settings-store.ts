import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SystemSettings {
  // General Settings
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string

  // Business Settings
  currency: string
  taxRate: number
  lowStockThreshold: number

  // Notification Settings
  emailNotifications: boolean
  lowStockAlerts: boolean
  orderNotifications: boolean

  // Display Settings
  itemsPerPage: number
  defaultView: "grid" | "list"
  showOutOfStock: boolean

  // Security Settings
  sessionTimeout: number
  requireStrongPasswords: boolean
  maxLoginAttempts: number

  // Shop Settings
  allowGuestCheckout: boolean
  requirePhoneNumber: boolean
  autoApproveOrders: boolean
  defaultOrderStatus: "pending" | "processing" | "completed"
}

interface SettingsState {
  settings: SystemSettings
  loading: boolean
  updateSettings: (newSettings: Partial<SystemSettings>) => void
  resetToDefaults: () => void
  setLoading: (loading: boolean) => void
}

const defaultSettings: SystemSettings = {
  // General Settings
  siteName: "Inventory & Shop System",
  siteDescription: "Complete inventory management and shop system",
  contactEmail: "admin@example.com",
  contactPhone: "+1 (555) 123-4567",

  // Business Settings
  currency: "USD",
  taxRate: 8.5,
  lowStockThreshold: 10,

  // Notification Settings
  emailNotifications: true,
  lowStockAlerts: true,
  orderNotifications: true,

  // Display Settings
  itemsPerPage: 10,
  defaultView: "grid",
  showOutOfStock: true,

  // Security Settings
  sessionTimeout: 24,
  requireStrongPasswords: true,
  maxLoginAttempts: 5,

  // Shop Settings
  allowGuestCheckout: false,
  requirePhoneNumber: false,
  autoApproveOrders: false,
  defaultOrderStatus: "pending",
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      loading: false,
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },
      resetToDefaults: () => {
        set({ settings: defaultSettings })
      },
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "settings-storage",
    },
  ),
)
