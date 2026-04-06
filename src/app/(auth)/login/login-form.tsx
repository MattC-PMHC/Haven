"use client"

// Login form — client component that handles form state and submission.
// Stripped of Card wrapper so it embeds cleanly inside the split-screen tabs.

import { useActionState } from "react"
import Link from "next/link"
import { loginAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

interface LoginFormProps {
  redirectTo: string
  callbackError?: string
}

export function LoginForm({ redirectTo, callbackError }: LoginFormProps) {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Sign in
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email and password to access your account
        </p>
      </div>

      <form action={action} className="space-y-4">
        {/* Hidden field to preserve the redirect URL */}
        <input type="hidden" name="redirect" value={redirectTo} />

        {/* Show error messages */}
        {(state?.error || callbackError) && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {state?.error || "Authentication failed. Please try again."}
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          {state?.fieldErrors?.password && (
            <p className="text-sm text-destructive">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          <LogIn className="size-4" />
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
