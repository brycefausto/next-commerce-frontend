import { AddressInfo } from "./addressInfo"
import { CreateUserDto } from "./user"

export interface Company {
  id: string
  name: string
  slug: string
  description?: string
  email?: string
  phone?: string
  address?: AddressInfo
  logo?: string
  vendorId: string
}

export interface CreateCompanyDto {
  name: string
  slug: string
  description?: string
  email?: string
  phone?: string
  address?: AddressInfo
  logo?: string
  user: CreateUserDto
}

export interface UpdateCompanyDto {
  name: string
  slug: string
  description?: string
  email?: string
  phone?: string
  address?: AddressInfo
  logo?: string
}

export interface CompanyQueryParams {
  page?: number
  limit?: number
  search?: string
}
