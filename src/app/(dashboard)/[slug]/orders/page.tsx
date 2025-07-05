import { parseSearchParams } from "@/lib/paramUtils"
import { orderService } from "@/services/order.service"
import { ParamsWithQuery } from "@/types"
import OrderList from "./OrderList"

export default async function OrdersPage({ searchParams }: ParamsWithQuery) {
  const params = await searchParams
  const { page, search } = parseSearchParams(params)
  const data = await orderService.findAll({ page, search })

  return (
    <OrderList data={data} page={page} search={search} searchParams={params} />
  )
}
