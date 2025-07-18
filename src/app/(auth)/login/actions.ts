"use server"

import { getErrorMessage } from "@/lib/serverFetch"
import { createSession, deleteSession } from "@/lib/session"
import { AppUser, UserRole } from "@/models/user"
import { authService } from "@/services/auth.service"
import { ActionResultState } from "@/types"
import { redirect } from "next/navigation"
import { LoginData } from "./loginSchema"

export async function loginAction(
  data: LoginData,
): Promise<ActionResultState & { user?: AppUser }> {
  const { email, password } = data
  let loginUser: AppUser | undefined

  try {
    const { user, token } = await authService.loginUser(email, password)

    await createSession(user.id, user.role, token)

    loginUser = user

    if (!loginUser) {
      return {
        error: "Login failed. Please check your credentials.",
      }
    }
  } catch (error: any) {
    console.log({ error: getErrorMessage(error) })
    return {
      error: getErrorMessage(error),
    }
  }

  if (loginUser.role == UserRole.SUPER_ADMIN) {
    redirect("/admin")
  } else if (loginUser.company) {
    redirect(`/${loginUser.company?.slug}`)
  } else {
    return {
      error: "Company does not exists",
    }
  }
}

export async function logoutAction() {
  await deleteSession()
  redirect("/login")
}
