import { getCompanyFromSlug, getUserFromSession } from "@/lib/session"
import { CountReportAdmin, CountReportSuperAdmin } from "@/models/report"
import { UserRole } from "@/models/user"
import { reportService } from "@/services/report.service"
import { ParamsWithSlug } from "@/types"
import { notFound } from "next/navigation"
import AdminDashboard from "./AdminDashboard"
import SuperAdminDashboard from "./SuperAdminDashboard"

export default async function DashboardPage({ params }: ParamsWithSlug) {
  const { slug } = await params
  const user = await getUserFromSession()

  if (!user) {
    notFound()
  }

  if (user?.role == UserRole.SUPER_ADMIN && slug == "admin") {
    const countReport: CountReportSuperAdmin =
      await reportService.countReportSuperAdmin()
    return <SuperAdminDashboard {...countReport} />
  }

  const company = await getCompanyFromSlug(slug)

  if (!company) {
    notFound()
  }

  const companyId = company.id
  const countReport: CountReportAdmin = await reportService.countReportAdmin(
    companyId,
    user.id,
  )

  return <AdminDashboard {...countReport} />
}
