// Login page — server component that reads search params, then renders
// the split-screen auth/landing page with Sign In + Demo Users tabs.

import { SplitAuthPage } from "./split-auth-page"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const params = await searchParams
  return (
    <SplitAuthPage
      redirectTo={params.redirect || "/dashboard"}
      callbackError={params.error}
    />
  )
}
