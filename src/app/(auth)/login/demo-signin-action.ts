"use server"

/**
 * Server Action — signs in a demo user and returns session tokens.
 *
 * This replaces the /api/auth/demo-signin route because Amplify
 * doesn't always deploy Next.js API routes as serverless functions.
 * Server Actions are bundled with the page, so they work reliably.
 */

import { createClient } from "@supabase/supabase-js"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { UserRole } from "@/lib/types/database"

const DEMO_PASSWORD = "haven-demo-2024"
const DEMO_TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

const DEMO_USERS: Record<string, { full_name: string; role: UserRole }> = {
  "demo-superadmin@haven.dev": {
    full_name: "System Administrator",
    role: "super_admin",
  },
  "demo-counciladmin@haven.dev": {
    full_name: "Council Administrator",
    role: "council_admin",
  },
  "demo-officer@haven.dev": {
    full_name: "Council Officer",
    role: "council_officer",
  },
  "demo-fd@haven.dev": {
    full_name: "Funeral Director",
    role: "funeral_director",
  },
  "demo-mason@haven.dev": {
    full_name: "Mason Contractor",
    role: "mason",
  },
  "demo-grounds@haven.dev": {
    full_name: "Grounds Crew",
    role: "grounds_crew",
  },
}

export async function demoSignIn(email: string): Promise<
  | { success: true; access_token: string; refresh_token: string }
  | { success: false; error: string }
> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return { success: false, error: "Server misconfiguration" }
    }

    if (!email || !(email in DEMO_USERS)) {
      return { success: false, error: "Invalid demo user" }
    }

    const demo = DEMO_USERS[email as keyof typeof DEMO_USERS]
    const admin = createSupabaseAdminClient()

    // Check if user already exists
    const { data: listData } = await admin.auth.admin.listUsers({
      perPage: 100,
    })
    const existingUser = listData?.users?.find((u) => u.email === email)

    let userId = existingUser?.id

    if (!existingUser) {
      const { data: created, error: createError } =
        await admin.auth.admin.createUser({
          email,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: demo.full_name },
          app_metadata: {
            tenant_id: DEMO_TENANT_ID,
            role: demo.role,
          },
        })

      if (createError) {
        return { success: false, error: createError.message }
      }

      userId = created.user.id
    } else {
      await admin.auth.admin.updateUserById(existingUser.id, {
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: demo.full_name },
        app_metadata: {
          tenant_id: DEMO_TENANT_ID,
          role: demo.role,
        },
      })
    }

    // Upsert profile row
    if (userId) {
      await admin.from("profiles").upsert(
        {
          id: userId,
          tenant_id: DEMO_TENANT_ID,
          role: demo.role,
          full_name: demo.full_name,
        },
        { onConflict: "id" }
      )

      // Link demo user to a matching contact record so portals work.
      // For FD/mason roles, update the first matching contact's email
      // to the demo user's email so the portal can find the link.
      if (demo.role === "funeral_director") {
        await admin
          .from("contacts")
          .update({ email })
          .eq("contact_type", "funeral_director")
          .eq("tenant_id", DEMO_TENANT_ID)
          .order("created_at", { ascending: true })
          .limit(1)
      } else if (demo.role === "mason") {
        await admin
          .from("contacts")
          .update({ email })
          .eq("contact_type", "mason")
          .eq("tenant_id", DEMO_TENANT_ID)
          .order("created_at", { ascending: true })
          .limit(1)
      } else if (demo.role === "grounds_crew") {
        // Assign any unassigned or existing work orders to this crew member
        await admin
          .from("work_orders")
          .update({ assigned_to: userId })
          .eq("tenant_id", DEMO_TENANT_ID)
          .is("assigned_to", null)
      }
    }

    // Sign in with anon client to get session tokens
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: signInData, error: signInError } =
      await anonClient.auth.signInWithPassword({
        email,
        password: DEMO_PASSWORD,
      })

    if (signInError) {
      return { success: false, error: signInError.message }
    }

    return {
      success: true,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}
