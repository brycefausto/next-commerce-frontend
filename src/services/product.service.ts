import serverFetch from "@/lib/serverFetch"
import { setAuthFromSession } from "@/lib/session"
import { convertToUrlParams } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import {
  CreateProductDto,
  Product,
  UpdateProductDto,
  UpdateProductImageDto,
  ViewProductDto
} from "@/models/product"
import { QueryParams } from "@/types"

const BASE_URL = "/products"
class ProductsService {
  create = async (productDto: CreateProductDto) => {
    await setAuthFromSession()
    const { data: product } = await serverFetch.post<Product>(
      BASE_URL,
      productDto,
    )

    return product
  }

  findOne = async (id: string) => {
    const { data: product } = await serverFetch.get<ViewProductDto>(
      `${BASE_URL}/${id}`,
    )

    return product
  }

  findAll = async (queryParams: QueryParams) => {
    const { data } = await serverFetch.get<PaginatedDocument<Product>>(
      `${BASE_URL}?${convertToUrlParams(queryParams)}`,
    )

    return data
  }

  count = async (companyId: string) => {
    const { data } = await serverFetch.get<number>(
      `${BASE_URL}?companyId=${companyId}`,
    )

    return data
  }

  update = async (id: string, productDto: UpdateProductDto) => {
    await setAuthFromSession()
    const { data: product } = await serverFetch.put<Product>(
      `${BASE_URL}/${id}`,
      productDto,
    )

    return product
  }

  updateImage = async (id: string, productDto: UpdateProductImageDto) => {
    await setAuthFromSession()
    const { data: product } = await serverFetch.put<Product>(
      `${BASE_URL}/${id}/updateImage`,
      productDto,
    )

    return product
  }

  updateVariantImage = async (
    id: string,
    productDto: UpdateProductImageDto,
  ) => {
    await setAuthFromSession()
    const { data: product } = await serverFetch.put<Product>(
      `${BASE_URL}/${id}/updateVariantImage`,
      productDto,
    )

    return product
  }

  delete = async (id: string) => {
    await setAuthFromSession()
    await serverFetch.delete(`${BASE_URL}/${id}`)
  }
}

export const productService = new ProductsService()
