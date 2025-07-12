"use client"

import Link from "next/link"

import { AppPagination } from "@/components/app-pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import usePageUtils from "@/hooks/use-page-utils"
import useSlug from "@/hooks/use-slug"
import { PaginatedDocument } from "@/models"
import { Product } from "@/models/product"
import { SearchIcon } from "lucide-react"
import { ProductCard } from "./product-card"

export interface ProductGridProps {
  data: PaginatedDocument<Product>
  page: number
  search: string
}

export function ProductGrid({ data, page, search }: ProductGridProps) {
  const products = data.docs
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchChange,
    handleSearchClick,
    handleSearchEnter,
  } = usePageUtils(search)
  const { addSlug } = useSlug()

  return (
    <div className="w-full space-y-6">
      <div className="max-w-sm">
        <Input
          name="search"
          placeholder="Search"
          value={searchValue}
          endContent={
            <Button variant="ghost" onClick={handleSearchClick}>
              <SearchIcon />
            </Button>
          }
          onChange={handleSearchChange}
          onKeyDown={handleSearchEnter}
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products found matching your search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={addSlug(`/shop/products/${product.id}`)}
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <AppPagination
              initialPage={page}
              total={totalPages}
              onChangePage={changePage}
            />
          </div>
        </>
      )}
    </div>
  )
}
