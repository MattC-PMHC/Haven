import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { UserRole } from "@/lib/types/database"

// The shape of data returned by getSession().
// This is the main way server components and server actions
// learn about the current user.
export interface HavenSession {
  user: {
    id: string
    email: string
  }
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    phone: string | null
  }
  role: UserRole
  tenantId: string
}

/**
 * Reads the current Supabase session and fetches the user's profile.
 * Returns null if the user isn't logged in.
 *
 * Use this in server components and server actions:
 *   const session = await getSession()
 *   if (!session) redirect("/login")
 */
export async function getSession(): Promise<HavenSession | null> {
  const supabase = await createSupabaseServerClient()

  // getUser() validates the JWT on every call — it's the secure way
  // to check auth (unlike getSession() which just reads the cookie
  // without verifying it).
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  // Fetch the profile row which has role + tenant_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, phone, role, tenant_id")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email!,
    },
    profile: {
      id: profile.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
    },
    role: profile.role as UserRole,
    tenantId: profile.tenant_id,
  }
}
