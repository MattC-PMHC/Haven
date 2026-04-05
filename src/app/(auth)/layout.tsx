// Auth layout — wraps login, register, and forgot-password pages.
// Centers the form in a clean, branded container.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Haven branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Haven
          </h1>
          <p className="text-sm text-muted-foreground">
            Cemetery Management Platform
          </p>
        </div>

        {/* The auth form (login/register/forgot-password) renders here */}
        {children}
      </div>
    </div>
  )
}
