"use client"

import { logout } from "@/app/(auth)/login/actions"
import { useCartStore } from "@/stores/cart.store"
import { useCompanyContext } from "@/stores/company.store"
import { useUserContext } from "@/stores/user.store"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import ProfileAvatar from "../profile-avatar/ProfileAvatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import AppTitle from "./AppTitle"

export default function ShopNavbar() {
  const { user } = useUserContext()
  const { slug, company } = useCompanyContext()
  const [mounted, setMounted] = useState(false)
  const { getItemCount } = useCartStore()

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
    // Initialize the store after hydration
    useCartStore.persist.rehydrate()
  }, [])

  // Don't render cart count until after hydration
  const cartCount = mounted ? getItemCount() : 0

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <AppTitle company={company} />
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-2">
          <Link href={`/${slug}/cart`}>
            <Button className="gap-2" variant="outline">
              <div className="relative">
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-4 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Button>
          </Link>
        </div>
        {user && (
          <div className="flex flex-row gap-2 items-center">
            <span className="text-xl font-bold mr-2">{user?.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ProfileAvatar
                  className="transition-transform"
                  color="secondary"
                  name={user?.name}
                  src={user?.image}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem key="profile" textValue="My Profile">
                  <Link className="flex" href="profile">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem key="settings">My Settings</DropdownMenuItem>
                <DropdownMenuItem key="team_settings">
                  Team Settings
                </DropdownMenuItem>
                <DropdownMenuItem key="analytics">Analytics</DropdownMenuItem>
                <DropdownMenuItem key="system">System</DropdownMenuItem>
                <DropdownMenuItem key="configurations">
                  Configurations
                </DropdownMenuItem>
                <DropdownMenuItem key="help_and_feedback">
                  Help & Feedback
                </DropdownMenuItem>
                <DropdownMenuItem
                  key="logout"
                  color="danger"
                  onClick={() => logout()}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  )
}
