"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useSlug from "@/hooks/use-slug"
import { CountReportSuperAdmin } from "@/models/report"
import { Building2, Users } from "lucide-react"
import Link from "next/link"

export interface SuperAdminDashboardProps extends CountReportSuperAdmin {}

export default function SuperAdminDashboard({
  userCount,
  companyCount,
}: SuperAdminDashboardProps) {
  const { addSlug } = useSlug()

  const statCards = [
    {
      title: "Total Users",
      value: userCount,
      description: "System users",
      icon: Users,
      color: "text-indigo-600",
    },
    {
      title: "Total Companies",
      value: companyCount,
      description: "System companies",
      icon: Building2,
      color: "text-indigo-600",
    },
  ]

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
                href={addSlug("/companies")}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Manage Companies
              </Link>
              <Link
                href={addSlug("/users")}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
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
