/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { getErrorMessage } from "@/lib/serverFetch"
import { UpdateOrderStatusDto } from "@/models/order"
import { orderService } from "@/services/order.service"
import { ActionResultState } from "@/types"
import { revalidatePath } from "next/cache"

export async function updateOrderAction(
  id: string,
  data: UpdateOrderStatusDto,
): Promise<ActionResultState> {
  try {
    await orderService.updateStatus(id, data)

    revalidatePath("/orders")

    return { success: true }
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function deleteOrderAction(
  id: string,
): Promise<ActionResultState> {
  try {
    await orderService.delete(id)
    revalidatePath("/orders")

    return { success: true, message: `Order #${id} deleted successfully` }
  } catch (error) {
    return {
      error: getErrorMessage(error),
    }
  }
}
