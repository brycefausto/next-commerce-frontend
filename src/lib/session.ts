/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only"
import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { userService } from "@/services/user.service"
import { AppUser, UserRole } from "@/models/user"
import { redirect } from "next/navigation"
import { companyService } from "@/services/company.service"
import { setBearerToken } from "./serverFetch"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(userId: string, role: UserRole, token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, role, token, expiresAt })
  const sessionCookies = await cookies()

  sessionCookies.set("session", session, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
  })
}

export async function deleteSession() {
  (await cookies()).delete("session")
}

type SessionPayload = {
  userId: string
  role: UserRole
  token: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch {
    console.log("Failed to verify session")
  }
}

export async function getUserFromPayload(payload: JWTPayload | undefined) {
  if (payload) {
    const id = payload.userId as string | undefined

    if (id) {
      return await userService.findOne(id)
    }
  }
}

export async function getUserFromSession() {
  let user: AppUser | undefined
  const session = (await cookies()).get("session")?.value;
  try {
    const payload = await decrypt(session)
1
    if (payload) {
      const id = payload.userId as string | undefined

      if (id) {
        user = await userService.findOne(id)

        return user
      }
    }
  } catch (error: any) {
    console.log("JWT Error: " + error.message)
  }
}

export async function setAuthFromSession() {
  const session = (await cookies()).get("session")?.value;
  try {
    const payload = await decrypt(session)

    if (payload?.token) {
      const token = payload.token as string
      setBearerToken(token)
    }
  } catch (error: any) {
    console.log("JWT Error: " + error.message)
  }
}

export async function getCompanySlugFromUser(user?: AppUser) {  
  if (user) {
    if (user.role == UserRole.SUPER_ADMIN) {
      return "/admin"
    } else {
      return `/${user.company?.slug}`
    }
  }

  return "";
}

export async function getCompanyFromSession() {
  const user = await getUserFromSession()
  
  return user?.company
}

export async function getCompanySlugFromSession() {
  const user = await getUserFromSession()
  
  return getCompanySlugFromUser(user)
}

export async function getCompanyFromSlug(slug: string) {
  try {
    const company = await companyService.findBySlug(slug)
  
    return company
  } catch (error: any) {
    console.log(error.message)
    return 
  }
}

export async function redirectWithSlug(url: string) {
  const slug = await getCompanySlugFromSession()

  return redirect(`${slug}${url}`)
}

export async function logoutSession() {
  await deleteSession()
  redirect("/login")
}
