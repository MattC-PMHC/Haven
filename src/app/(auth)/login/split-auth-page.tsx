"use client"

// SplitAuthPage — the main split-screen login/landing page.
//
// Left panel (55%): Dark navy with cemetery motif, Haven branding, headline.
// Right panel (45%): Tabbed Sign In form + Demo Users picker.
// On mobile (<lg) the left panel is hidden and branding shows above the form.

import { CemeteryMotif } from "./cemetery-motif"
import { LoginForm } from "./login-form"
import { DemoUserPicker } from "./demo-user-picker"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface SplitAuthPageProps {
  redirectTo: string
  callbackError?: string
}

export function SplitAuthPage({
  redirectTo,
  callbackError,
}: SplitAuthPageProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel — Brand (hidden on mobile) ── */}
      <div className="hidden lg:flex relative w-[55%] bg-primary overflow-hidden">
        {/* Decorative SVG background */}
        <CemeteryMotif />

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full px-12 xl:px-20 py-12">
          {/* Top — Wordmark */}
          <div className="animate-fade-up stagger-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Haven
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              Cemetery Management Platform
            </p>
          </div>

          {/* Center — Headline */}
          <div className="space-y-5">
            <h2
              className="font-extrabold leading-[1.08] text-white animate-fade-up stagger-2"
              style={{ fontSize: "clamp(2rem, 4vw + 0.5rem, 3.25rem)" }}
            >
              Dignified care for
              <br />
              every{" "}
              <span className="relative inline-block">
                resting place.
                <span
                  className="absolute bottom-1 -left-1 h-3 rounded -z-10"
                  style={{
                    width: "calc(100% + 8px)",
                    background: "rgba(203, 231, 245, 0.25)",
                    transformOrigin: "left",
                    transform: "scaleX(0)",
                    animation: "drawLine 0.8s ease-out 1s forwards",
                  }}
                />
              </span>
            </h2>

            <p className="text-base leading-relaxed text-white/60 max-w-[420px] animate-fade-up stagger-3">
              Modern cemetery management for Australian local government.
              Plots, bookings, records, and compliance — all in one place.
            </p>
          </div>

          {/* Bottom — Footer */}
          <p className="text-xs text-white/30 animate-fade-up stagger-4">
            &copy; {new Date().getFullYear()} Haven. All rights reserved.
          </p>
        </div>

        {/* drawLine keyframe for the underline animation */}
        <style>{`
          @keyframes drawLine {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
        `}</style>
      </div>

      {/* ── Right Panel — Auth Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-0 bg-surface overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only branding (hidden on lg+) */}
          <div className="lg:hidden text-center space-y-1 animate-fade-up stagger-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Haven
            </h1>
            <p className="text-sm text-muted-foreground">
              Cemetery Management Platform
            </p>
          </div>

          {/* Tabbed auth area */}
          <Tabs defaultValue="signin" className="animate-fade-up stagger-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="demo">Demo Users</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <LoginForm
                redirectTo={redirectTo}
                callbackError={callbackError}
              />
            </TabsContent>

            <TabsContent value="demo" className="mt-6">
              <DemoUserPicker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
