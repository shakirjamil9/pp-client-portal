import Link from "next/link"
import { ArrowLeft, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Client sign in · TappyPay",
  description: "Access your client transaction portal",
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-12 lg:py-8">
      <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 p-8 text-white shadow-2xl dark:border-slate-800 lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,109,0,0.45), transparent 45%), radial-gradient(circle at 80% 60%, rgba(14,165,233,0.25), transparent 40%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            Secure area
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your transactions, one calm dashboard.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Authentication and password flows will land here. For now, use{" "}
            <Link
              href="/"
              className="font-semibold text-orange-300 underline-offset-4 hover:underline"
            >
              analytics preview
            </Link>{" "}
            to review the layout.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center lg:py-4">
        <Card className="w-full max-w-md border-slate-200/90 shadow-xl dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
            <CardDescription>
              User ID and password (placeholder fields — not wired yet).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client-user-id">User ID</Label>
              <Input
                id="client-user-id"
                name="userId"
                autoComplete="username"
                placeholder="e.g. user_…"
                disabled
                className="bg-slate-50 dark:bg-slate-900/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-password">Password</Label>
              <Input
                id="client-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled
                className="bg-slate-50 dark:bg-slate-900/50"
              />
            </div>
            <Button type="button" className="w-full gap-2" disabled>
              <Lock className="h-4 w-4" aria-hidden />
              Continue
            </Button>
            <Button variant="ghost" className="w-full gap-2 text-slate-600" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to analytics preview
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
