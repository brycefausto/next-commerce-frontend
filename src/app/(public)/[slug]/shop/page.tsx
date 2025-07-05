import { getCompanyFromSession } from "@/lib/session"
import { productService } from "@/services/product.service"
import { ParamsWithQuery } from "@/types"
import ShopList from "./ShopList"

export default async function ShopPage({ searchParams }: ParamsWithQuery) {
  const company = await getCompanyFromSession()
  const companyId = company?.id || ""
  const params = await searchParams
  const page = parseInt(params.page as string, 10) || 1
  const search = (params.search as string) || ""
  const data = await productService.findAll({ page, search, companyId })

  return <ShopList data={data} page={page || 0} search={search || ""} />
}
