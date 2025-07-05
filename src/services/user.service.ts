import serverFetch from "@/lib/serverFetch"
import { setAuthFromSession } from "@/lib/session"
import { convertToUrlParams } from "@/lib/stringUtils"
import { PaginatedDocument } from "@/models"
import { AppUser, CreateUserDto, UpdateUserDto } from "@/models/user"
import { QueryParams } from "@/types"

const BASE_URL = "/users"

class UsersService {
  create = async (userDto: CreateUserDto) => {
    await setAuthFromSession()
    const { data: user } = await serverFetch.post<AppUser>(BASE_URL, userDto)

    return user
  }

  findOne = async (id: string) => {
    const { data: user } = await serverFetch.get<AppUser>(`${BASE_URL}/${id}`)

    return user
  }

  findAll = async (queryParams: QueryParams) => {
    await setAuthFromSession()
    const { data } = await serverFetch.get<PaginatedDocument<AppUser>>(
      `${BASE_URL}?${convertToUrlParams(queryParams)}`,
    )

    return data
  }

  update = async (id: string, userDto: UpdateUserDto) => {
    await setAuthFromSession()
    const { data: user } = await serverFetch.put<AppUser>(
      `${BASE_URL}/${id}`,
      userDto,
    )
    return user
  }

  updateImage = async (id: string, image: string) => {
    await setAuthFromSession()
    const { data: user } = await serverFetch.put<AppUser>(
      `${BASE_URL}/${id}/updateImage`,
      { image },
    )
    return user
  }

  delete = async (id: string) => {
    await setAuthFromSession()
    await serverFetch.delete(`${BASE_URL}/${id}`)
  }
}

export const userService = new UsersService()
