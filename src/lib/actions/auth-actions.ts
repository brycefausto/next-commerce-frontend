"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { login, logout, getSession } from "@/lib/auth"
import { loginSchema, userSchema } from "@/lib/validations"
import { mockDb } from "@/lib/database"
import { AppUser } from "@/models/user"
import { authService } from "@/services/auth.service"
import { createSession } from "../session"
import { getErrorMessage } from "../serverFetch"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function loginAction(formData: FormData) {
  await delay(500) // Simulate API call

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  let loginUser: AppUser | undefined

  try {
    const { user, token } = await authService.loginUser(email, password)

    await createSession(user.id, user.role, token)

    loginUser = user
  } catch (error: any) {
    return {
      error: getErrorMessage(error),
    }
  }
}

export async function logoutAction() {
  await logout()
  redirect("/login")
}

export async function createUserAction(formData: FormData) {
  await delay(300) // Simulate API call

  try {
    const session = await getSession()
    if (!session || session.role !== "SuperAdmin") {
      throw new Error("Unauthorized")
    }

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as "SuperAdmin" | "Admin",
    }

    const validatedFields = userSchema.parse(data)
    const hashedPassword = await bcrypt.hash(validatedFields.password, 12)

    const user = mockDb.users.create({
      name: validatedFields.name,
      email: validatedFields.email,
      password: hashedPassword,
      role: validatedFields.role,
    })

    return { success: true, id: user.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    }
  }
}

export async function getUsersAction() {
  await delay(200) // Simulate API call

  try {
    const session = await getSession()
    if (!session || session.role !== "SuperAdmin") {
      throw new Error("Unauthorized")
    }

    const users = mockDb.users.getAll()
    return { success: true, users }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    }
  }
}

export async function deleteUserAction(id: number) {
  await delay(300) // Simulate API call

  try {
    const session = await getSession()
    if (!session || session.role !== "SuperAdmin") {
      throw new Error("Unauthorized")
    }

    if (session.userId === id) {
      throw new Error("Cannot delete your own account")
    }

    const success = mockDb.users.delete(id)
    if (!success) {
      throw new Error("User not found")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    }
  }
}
