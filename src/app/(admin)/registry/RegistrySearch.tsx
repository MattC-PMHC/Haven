"use client"

import { useRouter, usePathname } from "next/navigation"
import { useRef, useTransition } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface RegistrySearchProps {
  defaultValue: string
}

export function RegistrySearch({ defaultValue }: RegistrySearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  function handleSearch(term: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams()
        if (term.trim()) params.set("q", term.trim())
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname)
      })
    }, 300)
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder="Search by name, certificate number..."
        className="pl-10"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          Searching...
        </span>
      )}
    </div>
  )
}
