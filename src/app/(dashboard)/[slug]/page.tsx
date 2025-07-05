"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useSlug from "@/hooks/use-slug"
import { getUsersAction } from "@/lib/actions/auth-actions"
import { getInventoryAction } from "@/lib/actions/inventory-actions"
import { getOrdersAction } from "@/lib/actions/order-actions"
import { getProductsAction } from "@/lib/actions/product-actions"
import { UserRole } from "@/models/user"
import { useUserContext } from "@/stores/user.store"
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useUserContext()
  const { addSlug } = useSlug()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInventory: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStockItems: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsResult, inventoryResult, ordersResult, usersResult] =
          await Promise.all([
            getProductsAction(),
            getInventoryAction(),
            getOrdersAction(),
            user?.role === UserRole.SUPER_ADMIN
              ? getUsersAction()
              : Promise.resolve({ success: true, users: [] }),
          ])

        if (
          productsResult.success &&
          inventoryResult.success &&
          ordersResult.success
        ) {
          const lowStock =
            inventoryResult.inventory?.filter(
              (item: any) => item.quantity <= item.min_stock,
            ).length || 0

          const pending =
            ordersResult.orders?.filter(
              (order: any) => order.status === "pending",
            ).length || 0

          setStats({
            totalProducts: productsResult.products?.length || 0,
            totalInventory: inventoryResult.inventory?.length || 0,
            totalOrders: ordersResult.orders?.length || 0,
            totalUsers: usersResult.success
              ? usersResult.users?.length || 0
              : 0,
            lowStockItems: lowStock,
            pendingOrders: pending,
          })
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [user])

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Active products in catalog",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Inventory Items",
      value: stats.totalInventory,
      description: "Items in inventory",
      icon: Warehouse,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "All time orders",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      description: "Orders awaiting processing",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  if (user?.role === UserRole.SUPER_ADMIN) {
    statCards.push({
      title: "Total Users",
      value: stats.totalUsers,
      description: "System users",
      icon: Users,
      color: "text-indigo-600",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your inventory and shop system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.lowStockItems > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-orange-700">
              You have {stats.lowStockItems} item(s) with low stock levels that
              need attention.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <Link
                href={addSlug("/products")}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Link>
              <Link
                href={addSlug("/inventory")}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Warehouse className="h-4 w-4 mr-2" />
                Check Inventory
              </Link>
              <Link
                href={addSlug("/orders")}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Link>
              <a
                target="_blank"
                href={addSlug("/shop")}
                rel="noopener noreferrer"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Visit Shop
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="text-sm text-green-600 font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Shop System</span>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Inventory Sync</span>
              <span className="text-sm text-green-600 font-medium">
                Up to date
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
