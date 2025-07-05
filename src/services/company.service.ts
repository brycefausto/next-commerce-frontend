import serverFetch from "@/lib/serverFetch"
import { setAuthFromSession } from "@/lib/session"
import { convertToUrlParams } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import { Company, CreateCompanyDto, UpdateCompanyDto } from "@/models/company"
import { QueryParams } from "@/types"

const BASE_URL = "/companies"

class CompanyService {
  create = async (createDto: CreateCompanyDto) => {
    await setAuthFromSession()
    const { data } = await serverFetch.post<Company>(BASE_URL, createDto)

    return data
  }

  findOne = async (id: string) => {
    const { data } = await serverFetch.get<Company>(`${BASE_URL}/${id}`)

    return data
  }

  findBySlug = async (slug: string) => {
    const { data } = await serverFetch.get<Company>(`${BASE_URL}/slug/${slug}`)

    return data
  }

  findAll = async (queryParams: QueryParams) => {
    const { data } = await serverFetch.get<PaginatedDocument<Company>>(
      `${BASE_URL}?${convertToUrlParams(queryParams)}`,
    )

    return data
  }

  update = async (id: string, updateDto: UpdateCompanyDto) => {
    await setAuthFromSession()
    const { data } = await serverFetch.put<Company>(
      `${BASE_URL}/${id}`,
      updateDto,
    )
    return data
  }

  updateLogo = async (id: string, image: string) => {
    await setAuthFromSession()
    const { data } = await serverFetch.put<Company>(
      `${BASE_URL}/${id}/updateLogo`,
      { image },
    )
    return data
  }

  delete = async (id: string) => {
    await setAuthFromSession()
    await serverFetch.delete(`${BASE_URL}/${id}`)
  }
}

export const companyService = new CompanyService()
