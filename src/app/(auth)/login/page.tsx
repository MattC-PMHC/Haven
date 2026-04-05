// Login page — server component that reads search params, then renders
// the client-side login form. This avoids the useSearchParams() Suspense
// requirement.

import { LoginForm } from "./login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const params = await searchParams
  return (
    <LoginForm
      redirectTo={params.redirect || "/dashboard"}
      callbackError={params.error}
    />
  )
}
