import { productService } from '@/services/product.service'
import { ParamsWithQuery } from '@/types'
import ProductList from './ProductList'
import { getCompanyFromSession } from '@/lib/session'

export default async function ProductPage({ searchParams }: ParamsWithQuery) {
  const company = await getCompanyFromSession()
  const companyId = company?.id || ""
  const params = await searchParams
  const page = parseInt(params.page as string, 10) || 1
  const search = params.search as string || ""
  const data = await productService.findAll({ page, search, companyId })

  return (
    <ProductList data={data} page={page} search={search} searchParams={params} />
  )
}
