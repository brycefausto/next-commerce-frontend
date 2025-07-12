"use server"

import { getErrorMessage } from "@/lib/serverFetch"
import { CreateOrderDto, Order } from "@/models/order"
import { orderService } from "@/services/order.service"
import { ActionResultState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createOrderAction(
  data: CreateOrderDto,
): Promise<ActionResultState<Order>> {
  try {
    const { data: order } = await orderService.create(data)
    revalidatePath("/order")

    return { success: true, data: order }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }
}
