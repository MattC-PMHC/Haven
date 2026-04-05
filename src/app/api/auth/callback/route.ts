// Auth callback route handler
//
// When a user clicks a link in a Supabase email (confirm email, reset
// password, magic link), Supabase redirects them here with a `code`
// query parameter. We exchange that code for a session, then redirect
// the user to the appropriate page.

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/dashboard"

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Called from a Server Component context — safe to ignore.
            }
          },
        },
      }
    )

    // Exchange the one-time code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(redirect, origin))
    }
  }

  // If something went wrong, send them back to login with an error
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", origin)
  )
}
