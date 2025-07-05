"use client"

import { useRef } from "react"
import { CompanyContext, createCompanyStore, type CompanyProps, type CompanyStore } from "@/stores/company.store"

type CompanyProviderProps = React.PropsWithChildren<CompanyProps>

export function CompanyProvider({ children, ...props }: CompanyProviderProps) {
  const storeRef = useRef<CompanyStore>(null)
  if (!storeRef.current) {
    storeRef.current = createCompanyStore(props)
  }

  return (
    <CompanyContext.Provider value={storeRef.current}>
      {children}
    </CompanyContext.Provider>
  )
}