import ShopNavbar from "@/components/navbar/ShopNavbar"
import { APP_NAME } from "@/config/env"
import { getCompanyFromSlug, getUserFromSession } from "@/lib/session"
import { CompanyProvider } from "@/providers/company.provider"
import { UserProvider } from "@/providers/user.provider"

export interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const user = await getUserFromSession()
  const { slug } = await params
  const company = await getCompanyFromSlug(slug)

  return (
    <CompanyProvider slug={slug} company={company}>
      <UserProvider user={user}>
        <div className="flex h-screen w-full">
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <ShopNavbar />
            <main className="flex-1 overflow-auto p-4">{children}</main>
            <div className="border-t my-8 pt-8 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear() + " " + (company?.name || APP_NAME)}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </UserProvider>
    </CompanyProvider>
  )
}
