import { getCompanyFromSession } from "@/lib/session"
import { productService } from "@/services/product.service"
import { ParamsWithQuery } from "@/types"
import { ProductGrid } from "./product-grid"

export default async function ProductsPage({ searchParams }: ParamsWithQuery) {
  const company = await getCompanyFromSession()
  const companyId = company?.id || ""
  const params = await searchParams
  const page = parseInt(params.page as string, 10) || 1
  const search = (params.search as string) || ""
  const data = await productService.findAll({ page, search, companyId })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-start gap-4 md:gap-8">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            All Fragrances
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Browse our collection of premium perfumes and colognes
          </p>
        </div>
        <ProductGrid data={data} page={page || 0} search={search || ""} />
      </div>
    </div>
  )
}
