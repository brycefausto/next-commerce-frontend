import serverFetch from "@/lib/serverFetch"
import { setAuthFromSession } from "@/lib/session"
import { convertToUrlParams } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import {
  BankAccount,
  CreateBankAccountDto,
  UpdateBankAccountDto,
} from "@/models/bankAccount"
import { QueryParams } from "@/types"

const BASE_URL = "/bank-accounts"

class BankAccountService {
  create = async (createDto: CreateBankAccountDto) => {
    await setAuthFromSession()
    const createdBankAccount = await serverFetch.post<BankAccount>(
      BASE_URL,
      createDto,
    )

    return createdBankAccount
  }

  findOne = async (id: string) => {
    const { data } = await serverFetch.get<BankAccount>(`${BASE_URL}/${id}`)

    return data
  }

  findAll = async (queryParams: QueryParams) => {
    const { data } = await serverFetch.get<PaginatedDocument<BankAccount>>(
      `${BASE_URL}?${convertToUrlParams(queryParams)}`,
    )

    return data
  }

  update = async (id: string, updateDto: UpdateBankAccountDto) => {
    await setAuthFromSession()
    const { data } = await serverFetch.put<BankAccount>(
      `${BASE_URL}/${id}`,
      updateDto,
    )
    return data
  }

  delete = async (id: string) => {
    await setAuthFromSession()
    await serverFetch.delete(`${BASE_URL}/${id}`)
  }
}

export const bankAccountService = new BankAccountService()
