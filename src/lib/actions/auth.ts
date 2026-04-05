"use server"

// Server actions for authentication (login, register, forgot password).
//
// Server actions run on the server, so they're safe for handling
// credentials. The form submits directly to these functions —
// no client-side fetch() needed.

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { z } from "zod/v4"

// ── Validation schemas ──────────────────────────────────────

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
})

// ── Action return type ──────────────────────────────────────
// Server actions can't throw errors that the UI can catch nicely,
// so we return a result object instead.

export interface AuthActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

// ── LOGIN ───────────────────────────────────────────────────

export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  // Validate the form fields
  const result = loginSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    return { error: "Invalid email or password. Please try again." }
  }

  // Get the redirect URL from the form (hidden field) or default to /dashboard
  const redirectTo = (formData.get("redirect") as string) || "/dashboard"
  redirect(redirectTo)
}

// ── REGISTER ────────────────────────────────────────────────

export async function registerAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const raw = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const result = registerSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  // Step 1: Create the auth user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.full_name,
      },
    },
  })

  if (signUpError) {
    // Common error: user already exists
    if (signUpError.message.includes("already registered")) {
      return { error: "An account with this email already exists." }
    }
    return { error: signUpError.message }
  }

  if (!authData.user) {
    return { error: "Something went wrong. Please try again." }
  }

  // Step 2: Create a profile row using the admin client.
  // We use the admin client here because RLS policies require a
  // tenant_id in the JWT, and the user doesn't have one yet.
  //
  // For the demo, we assign new users to the seed tenant.
  // In production, you'd have a proper tenant onboarding flow.
  const admin = createSupabaseAdminClient()
  const DEMO_TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    tenant_id: DEMO_TENANT_ID,
    role: "council_officer",
    full_name: result.data.full_name,
  })

  if (profileError) {
    console.error("Failed to create profile:", profileError)
    return { error: "Account created but profile setup failed. Contact support." }
  }

  // Step 3: Set tenant_id and role in the user's app_metadata
  // so that RLS policies (get_tenant_id()) can read it from the JWT.
  const { error: metaError } = await admin.auth.admin.updateUserById(
    authData.user.id,
    {
      app_metadata: {
        tenant_id: DEMO_TENANT_ID,
        role: "council_officer",
      },
    }
  )

  if (metaError) {
    console.error("Failed to set app_metadata:", metaError)
  }

  // If email confirmation is enabled, tell the user to check their email.
  // If not, redirect to dashboard.
  if (authData.user.identities?.length === 0) {
    return {
      success:
        "Check your email for a confirmation link to complete your registration.",
    }
  }

  redirect("/dashboard")
}

// ── FORGOT PASSWORD ─────────────────────────────────────────

export async function forgotPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const raw = {
    email: formData.get("email") as string,
  }

  const result = forgotPasswordSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/callback?redirect=/dashboard`,
    }
  )

  if (error) {
    console.error("Password reset error:", error)
    // Don't reveal whether the email exists — always show success
  }

  return {
    success:
      "If an account with that email exists, you'll receive a password reset link shortly.",
  }
}

// ── LOGOUT ──────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}
