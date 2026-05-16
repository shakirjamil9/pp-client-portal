"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePortalAuth } from "@/components/providers/portal-auth-provider"
import { Loader2 } from "lucide-react"

export function PortalGuard({ children }) {
  const { user, initializing } = usePortalAuth()
  const router = useRouter()

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login")
    }
  }, [initializing, user, router])

  if (initializing) {
    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-600 dark:text-slate-400"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6D00]" aria-hidden />
        <p className="text-sm">Loading your workspace…</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return children
}
