"use client"

// Login form — client component that handles form state and submission.
// Receives redirect URL and callback errors from the server page component.

import { useActionState } from "react"
import Link from "next/link"
import { loginAction } from "@/lib/actions/auth"
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
import { LogIn } from "lucide-react"

interface LoginFormProps {
  redirectTo: string
  callbackError?: string
}

export function LoginForm({ redirectTo, callbackError }: LoginFormProps) {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <form action={action}>
        {/* Hidden field to preserve the redirect URL */}
        <input type="hidden" name="redirect" value={redirectTo} />

        <CardContent className="space-y-4">
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
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>
            <LogIn className="size-4" />
            {pending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
