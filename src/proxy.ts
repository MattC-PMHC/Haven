// proxy.ts (Next.js 16 — replaces the deprecated middleware.ts)
//
// Runs on every request (except static assets). Reads the Supabase
// session from cookies and redirects users to their role-appropriate
// section of the app.

import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { UserRole } from "@/lib/types/database"
import { ADMIN_ROLES, getHomeForRole } from "@/lib/auth/roles"

// ── Path classification ──────────────────────────────────────

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
  "/search",
  "/cemeteries",
  "/unauthorized",
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )
}

function isAdminPath(pathname: string): boolean {
  const adminPrefixes = [
    "/dashboard",
    "/plots",
    "/registry",
    "/bookings",
    "/maps",
    "/settings",
    "/reports",
    "/audit",
    "/contacts",
    "/documents",
    "/work-orders",
    "/memorials",
    "/rights",
    "/notifications",
  ]
  return adminPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )
}

function isPortalPath(pathname: string): boolean {
  return (
    pathname.startsWith("/funeral-director") ||
    pathname.startsWith("/mason") ||
    pathname.startsWith("/grounds")
  )
}

// ── Proxy ────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public paths — no auth needed
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Create a response we can modify (to set refreshed cookies)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // If Supabase isn't configured, let the page handle it
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session (this also sets updated cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Root path: redirect based on auth state ──
  if (pathname === "/") {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    const role = (user.app_metadata?.role as UserRole) ?? "council_officer"
    const home = getHomeForRole(role)
    return NextResponse.redirect(new URL(home, request.url))
  }

  // ── Protected paths: require auth ──
  if (!user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = (user.app_metadata?.role as UserRole) ?? "council_officer"
  const isAdmin = ADMIN_ROLES.includes(role)

  // ── Portal user trying to access admin paths → redirect to their portal ──
  if (!isAdmin && isAdminPath(pathname)) {
    const home = getHomeForRole(role)
    return NextResponse.redirect(new URL(home, request.url))
  }

  // ── Admin user trying to access portal paths → redirect to dashboard ──
  if (isAdmin && isPortalPath(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // ── Portal user trying to access wrong portal → redirect to their portal ──
  if (!isAdmin && isPortalPath(pathname)) {
    const home = getHomeForRole(role)
    if (home && !pathname.startsWith(home)) {
      return NextResponse.redirect(new URL(home, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
