import Link from "next/link"
import { BarChart3, Sparkles } from "lucide-react"
import { PortalGuard } from "@/components/portal-guard"
import { PortalSidebarAuthFooter } from "@/components/portal-shell-auth"
import { PortalHeaderBar } from "@/components/portal-header-bar"

export const metadata = {
  title: "Client Portal · TappyPay",
  description: "Transaction analytics and activity for your integration",
}

export default function PortalShellLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-slate-950 text-slate-100 lg:flex dark:border-slate-800">
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9E43] to-[#FF6D00] shadow-lg shadow-orange-500/25">
              <Sparkles className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">TappyPay</p>
              <p className="text-sm font-semibold text-white">Client portal</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Portal navigation">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/15"
            >
              <BarChart3 className="h-4 w-4 text-orange-300" aria-hidden />
              Analytics
            </Link>
            <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 opacity-60">
              <span className="h-4 w-4 rounded border border-slate-600" aria-hidden />
              Transactions
              <span className="ml-auto text-[10px] uppercase">Soon</span>
            </span>
          </nav>
          <PortalSidebarAuthFooter />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#FF9E43] to-[#FF6D00] lg:h-9 lg:w-9">
                <Sparkles className="h-3.5 w-3.5 text-white lg:h-4 lg:w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">Client portal</p>
                <p className="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
                  Transaction analytics
                </p>
              </div>
            </div>
            <PortalHeaderBar />
          </header>

          <main
            className="flex-1 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,109,0,0.12),transparent)] p-4 sm:p-6 lg:p-10 dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,109,0,0.08),transparent)]"
            id="client-portal-main"
          >
            <PortalGuard>{children}</PortalGuard>
          </main>
        </div>
      </div>
    </div>
  )
}
