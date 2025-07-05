import { Company } from "@/models/company"
import { createContext, useContext } from "react"
import { createStore, useStore } from "zustand"

export interface CompanyProps {
  slug: string
  company?: Company | null | undefined
}

export interface CompanyState extends CompanyProps {
  setSlug: (slug: string) => void
  setCompany: (company: Company) => void
}

export const createCompanyStore = (initProps?: Partial<CompanyProps>) => {
  const DEFAULT_PROPS: CompanyProps = {
    slug: "",
    company: null,
  }
  return createStore<CompanyState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setSlug: (slug) => set(() => ({ slug })),
    setCompany: (company) => set(() => ({ company })),
  }))
}

export type CompanyStore = ReturnType<typeof createCompanyStore>

export const CompanyContext = createContext<CompanyStore | null>(null)

export function useCompanyContext() {
  const store = useContext(CompanyContext)
  if (!store) throw new Error("Missing CompanyContext.Provider in the tree")
  return useStore(store, (state) => state)
}
