import { getErrorMessage } from "@/lib/serverFetch"
import { inventoryService } from "@/services/inventory.service"
import { productService } from "@/services/product.service"
import { ActionResultState } from "@/types"

export async function getProductsCountAction(
  companyId: string,
): Promise<ActionResultState<number>> {
  try {
    const count = await productService.count(companyId)

    return { success: true, data: count }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function getInventoryItemsCountAction(
  vendorId: string,
): Promise<ActionResultState<number>> {
  try {
    const count = await inventoryService.count(vendorId)

    return { success: true, data: count }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}