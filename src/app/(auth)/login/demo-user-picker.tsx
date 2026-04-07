"use client"

// DemoUserPicker — clickable role cards that sign in as a demo user.
// Each card POSTs to /api/auth/demo-signin, then sets the session
// on the browser Supabase client and redirects to /dashboard.

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { demoSignIn } from "./demo-signin-action"
import { toast } from "sonner"
import {
  Shield,
  Building2,
  ClipboardList,
  HeartHandshake,
  Hammer,
  Trees,
  Loader2,
  ChevronRight,
} from "lucide-react"
import type { UserRole } from "@/lib/types/database"
import { getHomeForRole } from "@/lib/auth/roles"

// ── Demo user definitions ──────────────────────────────────

interface DemoUser {
  email: string
  role: UserRole
  name: string
  description: string
  icon: React.ElementType
  color: string // Tailwind bg class for the avatar circle
  textColor: string // Tailwind text class for the icon
}

const DEMO_USERS: DemoUser[] = [
  {
    email: "demo-superadmin@haven.dev",
    role: "super_admin",
    name: "System Administrator",
    description: "Full system access across all councils",
    icon: Shield,
    color: "bg-red-100",
    textColor: "text-red-600",
  },
  {
    email: "demo-counciladmin@haven.dev",
    role: "council_admin",
    name: "Council Administrator",
    description: "User management and council configuration",
    icon: Building2,
    color: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    email: "demo-officer@haven.dev",
    role: "council_officer",
    name: "Council Officer",
    description: "Core operations — plots, bookings, records",
    icon: ClipboardList,
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    email: "demo-fd@haven.dev",
    role: "funeral_director",
    name: "Funeral Director",
    description: "External portal — book interments, view plots",
    icon: HeartHandshake,
    color: "bg-teal-100",
    textColor: "text-teal-600",
  },
  {
    email: "demo-mason@haven.dev",
    role: "mason",
    name: "Mason Contractor",
    description: "Memorial work permits and applications",
    icon: Hammer,
    color: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    email: "demo-grounds@haven.dev",
    role: "grounds_crew",
    name: "Grounds Crew",
    description: "Field operations — work orders, photo logs",
    icon: Trees,
    color: "bg-green-100",
    textColor: "text-green-600",
  },
]

export function DemoUserPicker() {
  const router = useRouter()
  const [signingIn, setSigningIn] = useState<string | null>(null)

  async function handleDemoSignIn(user: DemoUser) {
    setSigningIn(user.email)

    try {
      // Server Action — runs on the server, no API route needed
      const result = await demoSignIn(user.email)

      if (!result.success) {
        throw new Error(result.error)
      }

      const { access_token, refresh_token } = result

      // Set the session on the browser Supabase client
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (error) {
        throw new Error(error.message)
      }

      // Force Next.js to re-check auth cookies, then navigate to role home
      router.refresh()
      router.push(getHomeForRole(user.role))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      toast.error(message)
      setSigningIn(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Choose a test account
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click any role to sign in instantly — no password needed
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEMO_USERS.map((user, i) => {
          const Icon = user.icon
          const isLoading = signingIn === user.email
          const isDisabled = signingIn !== null

          return (
            <button
              key={user.email}
              onClick={() => handleDemoSignIn(user)}
              disabled={isDisabled}
              className={`
                group relative flex items-center gap-3 p-3 rounded-xl border
                bg-card text-left transition-all duration-200
                animate-fade-up stagger-${i + 1}
                ${isDisabled && !isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                }
                ${isLoading ? "ring-2 ring-primary/20" : "border-border"}
              `}
            >
              {/* Role avatar */}
              <div
                className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${user.color}`}
              >
                <Icon className={`size-5 ${user.textColor}`} />
              </div>

              {/* Role info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.description}
                </p>
              </div>

              {/* Arrow / spinner */}
              <div className="flex-shrink-0">
                {isLoading ? (
                  <Loader2 className="size-4 text-primary animate-spin" />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
