import Link from "next/link"
import { ArrowLeft, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Sign in · TappyPay Client Portal",
  description: "Sign in to view your transaction analytics",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <header className="shrink-0 border-b border-slate-200/90 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 sm:max-w-lg">
          <Link
            href="/"
            className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg py-1.5 pr-2 text-left ring-offset-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6D00]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9E43] to-[#FF6D00] shadow-md shadow-orange-500/20">
              <Sparkles className="h-5 w-5 text-white" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                TappyPay
              </span>
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                Client portal
              </span>
            </span>
          </Link>
          <Button variant="ghost" size="sm" className="min-h-11 shrink-0 touch-manipulation px-3 sm:px-4" asChild>
            <Link href="/" className="gap-2 text-slate-600 dark:text-slate-300">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-slate-200/90 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:shadow-none">
            <CardHeader className="space-y-1 pb-4 pt-6 sm:pt-8">
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">Sign in</CardTitle>
              <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Enter your user ID and password. Auth will connect here when the API is ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-5 pb-8 sm:pb-10">
              <div className="space-y-2">
                <Label htmlFor="client-user-id" className="text-base sm:text-sm">
                  User ID
                </Label>
                <Input
                  id="client-user-id"
                  name="userId"
                  autoComplete="username"
                  inputMode="text"
                  placeholder="Your user ID"
                  disabled
                  className="h-12 min-h-[48px] touch-manipulation bg-slate-50 text-base sm:h-11 sm:min-h-0 sm:text-sm dark:bg-slate-900/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password" className="text-base sm:text-sm">
                  Password
                </Label>
                <Input
                  id="client-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled
                  className="h-12 min-h-[48px] touch-manipulation bg-slate-50 text-base sm:h-11 sm:min-h-0 sm:text-sm dark:bg-slate-900/60"
                />
              </div>
              <Button
                type="button"
                className="h-12 w-full touch-manipulation text-base font-semibold sm:h-11 sm:text-sm"
                disabled
              >
                <Lock className="h-4 w-4" aria-hidden />
                Continue
              </Button>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                <span className="text-slate-400 dark:text-slate-500">Forgot password?</span>{" "}
                <span className="font-medium text-slate-600 dark:text-slate-300">Coming soon</span>
              </p>
            </CardContent>
          </Card>

          <p className="mt-8 px-1 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500 sm:mt-10">
            After sign-in you will see deposits, withdrawals, and activity for your account only.
          </p>
        </div>
      </div>

      <footer className="shrink-0 border-t border-slate-200/80 bg-white/80 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-500 sm:px-6">
        © {new Date().getFullYear()} TappyPay · Client portal
      </footer>
    </div>
  )
}
