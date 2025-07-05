import serverFetch from "@/lib/serverFetch";
import { AppUser, RegisterDto } from "@/models/user";
import { userService } from "./user.service";

export type LoginResult = {
  user: AppUser
  token: string
}
class AuthService {
  registerUser = async (registerDto: RegisterDto) => {
    const user = await userService.create(registerDto)

    return user
  }

  loginUser = async (email: string, password: string) => {
    const { data } = await serverFetch.post<LoginResult>('/auth/login', { email, password })

    return data
  }

  checkAuth = async (id?: string | null) => {
    if (!id) {
      return null
    }

    const user = await userService.findOne(id)

    return user
  }
}

export const authService = new AuthService()
