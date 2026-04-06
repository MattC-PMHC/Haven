/**
 * POST /api/auth/demo-signin
 *
 * Creates or updates a demo user via Supabase Admin API, then signs
 * them in and returns session tokens. The browser client calls
 * supabase.auth.setSession() with these tokens to complete login.
 *
 * Only accepts emails from a hardcoded allowlist — prevents misuse.
 */

import { createClient } from "@supabase/supabase-js"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import type { UserRole } from "@/lib/types/database"

// ── Demo user definitions ──────────────────────────────────
// Each maps to a Haven role. Password is shared across all demo accounts.

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

export async function POST(req: NextRequest) {
  try {
    // ── Validate env vars ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      console.error("[demo-signin] Missing SUPABASE_URL or ANON_KEY")
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      )
    }

    // ── Parse & validate request ──
    const { email } = await req.json()

    if (!email || !(email in DEMO_USERS)) {
      return NextResponse.json({ error: "Invalid demo user" }, { status: 400 })
    }

    const demo = DEMO_USERS[email as keyof typeof DEMO_USERS]
    const admin = createSupabaseAdminClient()

    // ── Check if user already exists ──
    const { data: listData } = await admin.auth.admin.listUsers({
      perPage: 100,
    })
    const existingUser = listData?.users?.find((u) => u.email === email)

    let userId = existingUser?.id

    if (!existingUser) {
      // Create the auth user with email confirmed + metadata
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
        console.error("[demo-signin] Create failed:", createError.message)
        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        )
      }

      userId = created.user.id
    } else {
      // User exists — ensure password, metadata, and role are current
      const { error: updateError } = await admin.auth.admin.updateUserById(
        existingUser.id,
        {
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: demo.full_name },
          app_metadata: {
            tenant_id: DEMO_TENANT_ID,
            role: demo.role,
          },
        }
      )

      if (updateError) {
        console.error("[demo-signin] Update failed:", updateError.message)
        // Non-fatal — try sign-in anyway
      }
    }

    // ── Upsert profile row (same pattern as registerAction) ──
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
    }

    // ── Sign in with anon client to get session tokens ──
    // Admin client doesn't return sessions the same way, so we
    // use a plain anon client for the actual sign-in.
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: signInData, error: signInError } =
      await anonClient.auth.signInWithPassword({
        email,
        password: DEMO_PASSWORD,
      })

    if (signInError) {
      console.error("[demo-signin] Sign-in failed:", signInError.message)
      return NextResponse.json(
        { error: signInError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[demo-signin] Error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
