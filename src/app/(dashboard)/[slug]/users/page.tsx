import { userService } from "@/services/user.service"
import { ParamsWithQuery } from "@/types"
import React from "react"
import UserList from "./UserList"

export default async function UsersPage({ searchParams }: ParamsWithQuery) {
  const params = await searchParams
  const page = parseInt(params.page as string, 10) || 1
  const search = params.search as string || ""
  const data = await userService.findAll({ page, search })

  return <UserList data={data} page={page} search={search} searchParams={params} />
}
