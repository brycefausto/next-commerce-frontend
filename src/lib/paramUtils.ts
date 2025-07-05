import { SearchParams } from "@/types"

export function parseSearchParams(params: SearchParams) {
  const page = parseInt(params.page as string, 10) || 1
  const search = (params.search as string) || ""

  return { page, search }
}
