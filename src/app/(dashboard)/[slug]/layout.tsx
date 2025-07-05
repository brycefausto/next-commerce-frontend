import { AppSidebar } from "@/components/app-sidebar"
import AppNavbar from "@/components/navbar/AppNavbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCompanyFromSlug, getUserFromSession } from "@/lib/session"
import { UserRole } from "@/models/user"
import { CompanyProvider } from "@/providers/company.provider"
import { UserProvider } from "@/providers/user.provider"
import { cache } from "react"

const getUserAndCompanyData = cache(async (slug: string) => {
  const user = await getUserFromSession()
  const company = await getCompanyFromSlug(slug)

  return { user, company }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { user, company } = await getUserAndCompanyData(slug)
  const isSuperAdmin = user?.role == UserRole.SUPER_ADMIN
  const companyTitle = isSuperAdmin ? "Admin" : company?.name
  const companyDescription = isSuperAdmin
    ? "Back Office for Admin"
    : company?.description

  return {
    title: companyTitle,
    description: companyDescription,
  }
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { slug } = await params
  const { user, company } = await getUserAndCompanyData(slug)

  return (
    <UserProvider user={user}>
      <CompanyProvider slug={slug} company={company}>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="relative flex flex-1 flex-col overflow-hidden">
              <AppNavbar />
              <main className="flex-1 overflow-auto p-4">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </CompanyProvider>
    </UserProvider>
  )
}
