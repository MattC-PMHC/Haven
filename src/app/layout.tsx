import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Haven Cemetery Management",
  description:
    "Cloud-based cemetery management platform for Australian local government councils.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-surface text-foreground">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
