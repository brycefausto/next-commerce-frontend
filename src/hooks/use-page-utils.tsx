"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChangeEventHandler, useCallback, useState } from "react"

export default function usePageUtils(search?: string) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search || "")

  const changePage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams)

      if (newPage > 1) {
        params.set("page", newPage.toString())
      } else {
        params.delete("page")
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const changeSearch = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams)

      if (newSearch) {
        params.set("search", newSearch)
        params.set("page", "1")
      } else {
        params.delete("search")
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const handleSearchClick = () => {
    changeSearch(searchValue.trim())
  }

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.target.value)
  }

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeSearch(searchValue.trim())
    }
  }

  return {
    router,
    pathname,
    searchValue,
    changePage,
    changeSearch,
    handleSearchChange,
    handleSearchClick,
    handleSearchEnter
  }
}
