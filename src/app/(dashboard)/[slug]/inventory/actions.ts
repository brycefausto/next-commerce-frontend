"use server"

import { getErrorMessage } from "@/lib/serverFetch"
import { CreateInventoryItemDto, InventoryItem, UpdateInventoryItemDto } from "@/models/inventory"
import { inventoryService } from "@/services/inventory.service"
import { ActionResultState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createItemAction(
  data: CreateInventoryItemDto,
): Promise<ActionResultState<InventoryItem>> {
  try {
    const inventoryItem = await inventoryService.create(data)
    revalidatePath("/inventory")

    return { success: true, data: inventoryItem }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function updateItemAction(id: string, data: UpdateInventoryItemDto): Promise<ActionResultState> {

  try {
    await inventoryService.update(id, data)
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error)
    };
  }
  revalidatePath("/inventory")

  return { success: true }
}


export async function deleteItemAction(id: string): Promise<ActionResultState> {
  try {
    await inventoryService.delete(id)
    revalidatePath("/inventory")

    return { success: true, message: "Inventory Item deleted successfully" }
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}
