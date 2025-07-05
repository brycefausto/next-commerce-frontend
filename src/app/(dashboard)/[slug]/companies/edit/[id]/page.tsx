import { companyService } from "@/services/company.service"
import { ParamsWithId } from "@/types"
import { notFound } from "next/navigation"
import EditCompanyForm from "./EditCompanyForm"

export default async function EditCompanyPage({ params }: ParamsWithId) {
  const { id } = await params
  const company = await companyService.findOne(id)

  if (!company) {
    notFound()
  }

  return <EditCompanyForm company={company} />
}
