"use client"

// Forgot password page — sends a password reset email via Supabase.
// For security, we always show the same success message regardless
// of whether the email exists in the system.
// Wrapped in its own centered layout since the auth layout is now a pass-through.

import { useActionState } from "react"
import Link from "next/link"
import { forgotPasswordAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null)

  // Show success state after submission
  if (state?.success) {
    return (
      <AuthCenteredWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-info-bg p-4 text-sm text-info border border-info-border">
              {state.success}
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </AuthCenteredWrapper>
    )
  }

  return (
    <AuthCenteredWrapper>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>

        <form action={action}>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@council.nsw.gov.au"
                autoComplete="email"
                required
              />
              {state?.fieldErrors?.email && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={pending}>
              <Mail className="size-4" />
              {pending ? "Sending..." : "Send reset link"}
            </Button>

            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </AuthCenteredWrapper>
  )
}

// ── Centered wrapper with Haven branding ──
// Replicates the old auth layout for non-login pages.

function AuthCenteredWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Haven
          </h1>
          <p className="text-sm text-muted-foreground">
            Cemetery Management Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
