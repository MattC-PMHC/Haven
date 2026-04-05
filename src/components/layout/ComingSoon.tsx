// ComingSoon — shared placeholder for pages that haven't been built yet.
//
// Used as route stubs so sidebar links don't 404. Each stub page passes
// a title and optional milestone reference.

import { Construction } from "lucide-react"

interface ComingSoonProps {
  title: string
  milestone?: string // e.g. "Milestone 5"
}

export function ComingSoon({ title, milestone }: ComingSoonProps) {
  return (
    <div className="p-10 max-w-[1600px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-6">
        <Construction className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This feature is under development
        {milestone ? ` and will be available in ${milestone}` : ""}.
      </p>
    </div>
  )
}
