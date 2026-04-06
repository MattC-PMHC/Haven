// Auth layout — pass-through wrapper.
//
// The login page handles its own split-screen layout.
// Register and forgot-password pages include their own centered containers.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
