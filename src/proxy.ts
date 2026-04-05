// proxy.ts (Next.js 16 — replaces the deprecated middleware.ts)
//
// This runs on EVERY request before the page renders. It does two things:
// 1. Refreshes the Supabase session token (keeps users logged in)
// 2. Protects routes — redirects unauthenticated users to /login
//
// IMPORTANT: proxy.ts cannot read the database directly (it runs on the
// edge). It can only read cookies/headers. For role-based checks we rely
// on requireRole() inside each page's server component.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Routes that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth/callback",
  "/public",
  "/dashboard", // TODO: Remove — temporary for design preview without Supabase
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let static files, images, and favicon through without auth checks
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // If Supabase isn't configured yet, skip all auth checks
  // TODO: Remove this guard once .env.local is set up
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next()
  }

  // Create a response we can modify (to update cookies)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Create a Supabase client that can read AND write cookies.
  // This is how Supabase keeps the session alive — it refreshes
  // the JWT token and writes updated cookies back to the browser.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write cookies to both the request (for downstream) and
          // the response (for the browser)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh the session — this is the key call that keeps users
  // logged in by refreshing expired JWTs automatically.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If the user is NOT logged in and trying to access a protected route,
  // redirect them to the login page.
  if (!user && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url)
    // Save where they were trying to go so we can redirect back after login
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If the user IS logged in and trying to visit login/register,
  // redirect them to the dashboard instead (no need to log in again).
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect root "/" to dashboard if logged in, login if not
  if (pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return response
}

// Only run the proxy on app routes, not on static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
