import serverFetch from "@/lib/serverFetch"
import { setAuthFromSession } from "@/lib/session"
import { convertToUrlParams } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  OrderCountReport,
} from "@/models/order"
import { QueryParams } from "@/types"

const BASE_URL = "/orders"

class OrderService {
  create = async (createDto: CreateOrderDto) => {
    await setAuthFromSession()
    const createdOrder = await serverFetch.post<Order>(BASE_URL, createDto)

    return createdOrder
  }

  findOne = async (id: string) => {
    const { data } = await serverFetch.get<Order>(`${BASE_URL}/${id}`)

    return data
  }

  findAll = async (queryParams: QueryParams) => {
    const { data } = await serverFetch.get<PaginatedDocument<Order>>(
      `${BASE_URL}?${convertToUrlParams(queryParams)}`,
    )

    return data
  }

  count = async (vendorId: string) => {
    const { data } = await serverFetch.get<number>(
      `${BASE_URL}/count?vendorId=${vendorId}`,
    )

    return data
  }

  countReport = async (vendorId: string) => {
    const { data } = await serverFetch.get<OrderCountReport>(
      `${BASE_URL}/countReport?vendorId=${vendorId}`,
    )

    return data
  }

  update = async (id: string, updateDto: UpdateOrderDto) => {
    await setAuthFromSession()
    const { data } = await serverFetch.put<Order>(
      `${BASE_URL}/${id}`,
      updateDto,
    )
    return data
  }

  updateStatus = async (id: string, updateDto: UpdateOrderStatusDto) => {
    await setAuthFromSession()
    const { data } = await serverFetch.put<Order>(
      `${BASE_URL}/${id}/status`,
      updateDto,
    )
    return data
  }

  delete = async (id: string) => {
    await setAuthFromSession()
    await serverFetch.delete(`${BASE_URL}/${id}`)
  }
}

export const orderService = new OrderService()
