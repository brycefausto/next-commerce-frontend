import serverFetch from "@/lib/serverFetch"
import { CountReportAdmin, CountReportDistributor, CountReportSuperAdmin } from "@/models/report"

const BASE_URL = "/reports"

class ReportService {
  countReportSuperAdmin = async () => {
    const { data } = await serverFetch.get<CountReportSuperAdmin>(
      `${BASE_URL}/countReportSuperAdmin`,
    )

    return data
  }
  countReportAdmin = async (companyId: string, vendorId: string) => {
    const { data } = await serverFetch.get<CountReportAdmin>(
      `${BASE_URL}/countReportAdmin?companyId=${companyId}&vendorId=${vendorId}`,
    )

    return data
  }
  countReportDistributor = async (companyId: string, vendorId: string) => {
    const { data } = await serverFetch.get<CountReportDistributor>(
      `${BASE_URL}/countReportDistributor?companyId=${companyId}&vendorId=${vendorId}`,
    )

    return data
  }
}

export const reportService = new ReportService()
