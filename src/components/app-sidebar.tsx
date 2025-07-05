"use client"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { APP_NAME } from "@/config/env"
import { logoutAction } from "@/lib/actions/auth-actions"
import { UserRole } from "@/models/user"
import { useCompanyContext } from "@/stores/company.store"
import { useUserContext } from "@/stores/user.store"
import {
  Building2,
  Copy,
  LayoutDashboard,
  LogOut,
  LucideProps,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  Warehouse,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ForwardRefExoticComponent, RefAttributes, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type MenuItem = {
  title: string
  url: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  isCompanyMenu?: boolean
  isSuperAdminMenu?: boolean
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, clearUser } = useUserContext()
  const { slug, company } = useCompanyContext()
  const isSuperAdmin = user?.role == UserRole.SUPER_ADMIN
  const title = company ? company.name : APP_NAME

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: `/${slug}`,
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: `/${slug}/users`,
      icon: Users,
    },
    {
      title: "Companies",
      url: `/${slug}/companies`,
      icon: Building2,
      isSuperAdminMenu: true,
    },
    {
      title: "Products",
      url: `/${slug}/products`,
      icon: Package,
      isCompanyMenu: true,
    },
    {
      title: "Inventory",
      url: `/${slug}/inventory`,
      icon: Warehouse,
      isCompanyMenu: true,
    },
    {
      title: "Orders",
      url: `/${slug}/orders`,
      icon: ShoppingCart,
      isCompanyMenu: true,
    },
    {
      title: "Shop",
      url: `/${slug}/shop`,
      icon: Store,
      isCompanyMenu: true,
    },
    {
      title: "Settings",
      url: `/${slug}/settings`,
      icon: Settings,
    },
  ]

  let filteredMenuItems = useMemo(() => {
    if (isSuperAdmin) {
      return menuItems.filter((it) => isSuperAdmin && !it.isCompanyMenu)
    }

    return menuItems.filter((it) => {
      if (it.isSuperAdminMenu) return false
      if (it.isCompanyMenu && !company) return false
      return true
    })
  }, [menuItems])

  const copyShopURL = () => {
    const shopLink = window.location.origin + `/${slug}/shop`
    navigator.clipboard.writeText(shopLink)
    alert(`${shopLink} copied!`)
  }

  const handleLogout = async () => {
    clearUser()
    await logoutAction()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {!isSuperAdmin && (
                <SidebarMenuItem className="flex flex-row gap-2">
                  <SidebarMenuButton asChild>
                    <a
                      target="_blank"
                      href={`/${slug}/shop`}
                      rel="noopener noreferrer"
                    >
                      <Store />
                      <span>Store</span>
                    </a>
                  </SidebarMenuButton>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" onClick={copyShopURL}>
                        <Copy />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Shop URL</TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
