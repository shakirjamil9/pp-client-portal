"use client"

import Link from "next/link"
import { LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePortalAuth } from "@/components/providers/portal-auth-provider"

export function PortalSidebarAuthFooter() {
  const { user, logout } = usePortalAuth()

  if (user) {
    return (
      <div className="border-t border-white/10 p-4">
        <p className="mb-2 truncate px-1 text-xs text-slate-400" title={user.domain}>
          <span className="font-mono text-slate-300">{user.domain}</span>
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className="border-t border-white/10 p-4">
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Sign in
      </Link>
    </div>
  )
}
