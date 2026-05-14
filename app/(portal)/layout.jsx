import Link from "next/link"
import { BarChart3, LogIn, Sparkles } from "lucide-react"

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
          <div className="border-t border-white/10 p-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Sign in
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#FF9E43] to-[#FF6D00]">
                <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Client portal</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 sm:inline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Design preview
              </span>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                Sign in
              </Link>
            </div>
          </header>

          <main
            className="flex-1 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,109,0,0.12),transparent)] p-4 sm:p-6 lg:p-10 dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,109,0,0.08),transparent)]"
            id="client-portal-main"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
