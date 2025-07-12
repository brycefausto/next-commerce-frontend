import serverFetch from "@/lib/serverFetch"
import { setAuthFromSession } from "@/lib/session"
import { convertToUrlParams } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import {
  CreateInventoryItemDto,
  InventoryItem,
  UpdateInventoryItemDto,
} from "@/models/inventory"
import { QueryParams } from "@/types"

const BASE_URL = "/inventory"

class InventoryService {
  create = async (inventoryDto: CreateInventoryItemDto) => {
    await setAuthFromSession()
    const { data: inventory } = await serverFetch.post<InventoryItem>(
      BASE_URL,
      inventoryDto,
    )

    return inventory
  }

  findOne = async (id: string) => {
    const { data: inventory } = await serverFetch.get<InventoryItem>(
      `${BASE_URL}/${id}`,
    )

    return inventory
  }

  findAll = async (queryParams: QueryParams) => {
    const { data } = await serverFetch.get<PaginatedDocument<InventoryItem>>(
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

  update = async (id: string, inventoryDto: UpdateInventoryItemDto) => {
    await setAuthFromSession()
    const { data: inventory } = await serverFetch.put<InventoryItem>(
      `${BASE_URL}/${id}`,
      inventoryDto,
    )

    return inventory
  }

  delete = async (id: string) => {
    await setAuthFromSession()
    await serverFetch.delete(`${BASE_URL}/${id}`)
  }
}

export const inventoryService = new InventoryService()
