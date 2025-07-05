import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { decrypt, getUserFromSession } from "@/lib/session"
import { cookies } from "next/headers";
import { AppUser, UserRole } from "@/models/user";

const dashboardRoutes = [
  "/dashboard",
  "/users",
  "/products",
  "/inventory",
  "/profile",
  "/settings",
]

const protectedRoutes = dashboardRoutes.map(it => new RegExp(`([\/.*])?${it}([\/.*])?`));
const publicRoutes = ["/", "/login", "/signup", "/forgotPassword", /resetPassword\/.*/];

const pathMatcher = (path: string | RegExp, pathname: string) =>
  typeof path === "string" ? path == pathname : pathname.match(path)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.filter(path => pathMatcher(path, pathname)).length > 0;
  const isPublicRoute = publicRoutes.filter(path => pathMatcher(path, pathname)).length > 0 || pathname == "/";

  // if (isProtectedRoute || isPublicRoute) {
  //   const serverCookies = await cookies();
  //   const cookie = serverCookies.get("session")?.value;
  //   const payload = await decrypt(cookie);

  //   let user: AppUser | undefined | null = null

  //   if (payload?.userId) {
  //     user = await getUserFromSession()
  //   }

  //   if (isProtectedRoute && !payload?.userId) {
  //     return NextResponse.redirect(new URL("/login", request.nextUrl));
  //   }

  //   if (pathname.startsWith("/admin")) {
  //     if (!user) {
  //       // serverCookies.delete("session");

  //       return NextResponse.redirect(new URL("/login", request.nextUrl));
  //     }

  //     if (user.role != UserRole.SUPER_ADMIN) {
  //       return NextResponse.redirect(new URL(`/${user.company?.slug}/dashboard`, request.nextUrl));
  //     }
  //   }

    // if (isPublicRoute) {
    //   if (!user) {
    //     console.log("session deleted")
    //     serverCookies.delete("session");

    //     if (pathname != "/login") {
    //       return NextResponse.redirect(new URL("/login", request.nextUrl));
    //     }
    //   } else {
    //     if (user.role != UserRole.SUPER_ADMIN) {
    //       return NextResponse.redirect(new URL(`/${user.company?.slug}/dashboard`, request.nextUrl));
    //     }

    //     return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
    //   }
    // }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
