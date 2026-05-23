"use client"

import Link from "next/link"
import { LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePortalAuth } from "@/components/providers/portal-auth-provider"
import { portalMerchantLabel } from "@/lib/portal-api"

/** Header actions: desktop shows compact user label; mobile shows sign in/out. */
export function PortalHeaderBar() {
  const { user, logout } = usePortalAuth()

  if (user) {
    const label = portalMerchantLabel(user)
    return (
      <div className="flex max-w-[min(100%,20rem)] shrink-0 items-center gap-2 sm:gap-3">
        <span
          className="hidden truncate text-xs font-medium text-slate-600 dark:text-slate-300 lg:inline xl:max-w-[12rem]"
          title={label}
        >
          <span className="text-slate-400">Merchant</span>{" "}
          <span className="font-mono text-slate-800 dark:text-slate-100">{label}</span>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden border-slate-200 lg:inline-flex dark:border-slate-700"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-slate-200 lg:hidden dark:border-slate-700"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 sm:mr-1" aria-hidden />
          <span className="hidden sm:inline">Out</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="shrink-0">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Sign in
      </Link>
    </div>
  )
}
