"use client"

import { AppPagination } from "@/components/app-pagination"
import ImageHolder from "@/components/image-holder/ImageHolder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BASE_ITEMS_IMAGE_URL } from "@/config/env"
import usePageUtils from "@/hooks/use-page-utils"
import { formatPrice } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import { Product } from "@/models/product"
import { SearchIcon } from "lucide-react"
import Link from "next/link"

export interface ShopListProps {
  data: PaginatedDocument<Product>
  page: number
  search: string
}

export default function ShopList({ data, page, search }: ShopListProps) {
  const products = data.docs
  const totalPages = data.totalPages || 0
  const {
    searchValue,
    changePage,
    handleSearchChange,
    handleSearchClick,
    handleSearchEnter,
  } = usePageUtils()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex p-5">
        <div className="flex">
          <span className="text-3xl font-bold">Shop Our Products</span>
        </div>
        <div className="flex flex-auto"></div>
        <div className="mr-5">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`shop/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-white padding-20">
                <ImageHolder
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  src={
                    product.image ? BASE_ITEMS_IMAGE_URL + product.image : ""
                  }
                  alt={product.name}
                  height={300}
                  width={300}
                  radius="none"
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-xl font-bold mb-3">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <AppPagination
          initialPage={page}
          total={totalPages}
          onChangePage={changePage}
        />
      </div>
    </div>
  )
}
