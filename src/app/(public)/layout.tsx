// Public portal layout — no authentication required.
//
// Minimal layout with Haven branding and simple navigation.

import Link from "next/link"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* ── Header ── */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/search" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">H</span>
            </div>
            <span className="font-bold text-white">Haven</span>
            <span className="text-white/30">|</span>
            <span className="text-white/80 text-sm">Public Records</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/search"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Grave Search
            </Link>
            <Link
              href="/cemeteries"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Cemeteries
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto">{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-[1200px] mx-auto px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Haven Cemetery Management &mdash; Public Records Portal
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            For enquiries, contact your local council office.
          </p>
        </div>
      </footer>
    </div>
  )
}
