import { PaginatedDocument } from "@/models"

export type PathParams = {
  slug: string
}

export interface ParamsWithSlug {
  params: Promise<{
    slug: string
  }>
}
export interface ParamsWithId {
  params: Promise<{
    id: string
  }>
}

export type SearchParams = { [key: string]: string | string[] | number | undefined }

export interface ParamsWithQuery {
  searchParams: Promise<SearchParams>
}

export type QueryParams = {
  search?: string
  page?: number
  limit?: number
  companyId?: string
}

export interface ListComponentProps<T> {
  data: PaginatedDocument<T>
  searchParams: SearchParams
  page: number
  search: string
}

export type ActionResultState<T = any> = {
  success?: boolean
  message?: string
  error?: string
  data?: T
}
export interface SelectOption {
  label: string
  value: string
}

export interface SlugProps {
  slug: string
}
