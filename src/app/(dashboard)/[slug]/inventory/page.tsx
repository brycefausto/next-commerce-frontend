import { getCompanyFromSession } from "@/lib/session"
import { inventoryService } from "@/services/inventory.service"
import { ParamsWithQuery } from "@/types"
import InventoryList from "./InventoryList"

export default async function InventoryPage({ searchParams }: ParamsWithQuery) {
  const company = await getCompanyFromSession()
  const companyId = company?.id || ""
  const params = await searchParams
  const page = parseInt(params.page as string, 10) || 1
  const search = (params.search as string) || ""
  const data = await inventoryService.findAll({ page, search, companyId })

  return (
    <InventoryList
      data={data}
      page={page}
      search={search}
      searchParams={params}
    />
  )
}
