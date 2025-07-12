import { parseSearchParams } from "@/lib/paramUtils"
import { orderService } from "@/services/order.service"
import { ParamsWithQuery } from "@/types"
import OrderList from "./OrderList"
import { getUserFromSession } from "@/lib/session"
import { notFound } from "next/navigation"

export default async function OrdersPage({ searchParams }: ParamsWithQuery) {
  const user = await getUserFromSession()

  if (!user) {
    notFound()
  }

  const params = await searchParams
  const { page, search } = parseSearchParams(params)
  const data = await orderService.findAll({ page, search })
  const countReport = await orderService.countReport(user.id)

  return (
    <OrderList data={data} page={page} search={search} searchParams={params} countReport={countReport} />
  )
}
