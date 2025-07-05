/* eslint-disable @typescript-eslint/no-explicit-any */
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
    return {
      error: getErrorMessage(error),
    }
  }

  if (loginUser.role == UserRole.SUPER_ADMIN) {
    redirect("/admin");
  } else {
    redirect(`/${loginUser.company?.slug}`);
  }
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
