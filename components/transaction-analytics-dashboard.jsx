"use client"

import { useMemo, useId, useSyncExternalStore, useState, useEffect, useCallback } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Layers,
  TrendingUp,
  RefreshCcw,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { usePortalAuth } from "@/components/providers/portal-auth-provider"
import { getStoredToken, portalAnalytics } from "@/lib/portal-api"
import { withMethodColors } from "@/lib/analytics-colors"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
]

/** Narrow viewport (max-width 639px): chart layout tuned for phones; SSR uses desktop layout. */
function useIsNarrowScreen() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 639px)")
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false
  )
}

const tnd = (n) =>
  `TND ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n ?? 0)}`

const STATUS_KPI_STYLES = {
  "deposit-approved": {
    card: "border-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white shadow-lg shadow-emerald-950/25",
    glow: "#34d399",
    glowOpacity: 0.25,
    title: "text-white/70",
    meta: "text-white/50",
    amount: "text-white",
    count: "text-white/90",
    iconWrap: "bg-white/10 ring-white/10",
    icon: "text-white/90",
  },
  "deposit-rejected": {
    card: "border-2 border-emerald-500/80 bg-white/50 shadow-md backdrop-blur-sm dark:border-emerald-500/55 dark:bg-slate-900/30",
    glow: null,
    title: "text-emerald-800 dark:text-emerald-300",
    meta: "text-emerald-700/75 dark:text-emerald-400/80",
    amount: "text-emerald-950 dark:text-emerald-50",
    count: "text-emerald-800 dark:text-emerald-200",
    iconWrap: "bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:ring-emerald-700/60",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  "withdrawal-approved": {
    card: "border-0 bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 text-white shadow-lg shadow-rose-950/25",
    glow: "#fb7185",
    glowOpacity: 0.25,
    title: "text-white/70",
    meta: "text-white/50",
    amount: "text-white",
    count: "text-white/90",
    iconWrap: "bg-white/10 ring-white/10",
    icon: "text-white/90",
  },
  "withdrawal-rejected": {
    card: "border-2 border-rose-500/80 bg-white/50 shadow-md backdrop-blur-sm dark:border-rose-500/55 dark:bg-slate-900/30",
    glow: null,
    title: "text-rose-800 dark:text-rose-300",
    meta: "text-rose-700/75 dark:text-rose-400/80",
    amount: "text-rose-950 dark:text-rose-50",
    count: "text-rose-800 dark:text-rose-200",
    iconWrap: "bg-rose-50 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:ring-rose-700/60",
    icon: "text-rose-600 dark:text-rose-400",
  },
}

function StatusKpiTile({
  title,
  count,
  amount,
  icon: Icon,
  flow,
  status,
  description,
}) {
  const variantKey = `${flow}-${status}`
  const s = STATUS_KPI_STYLES[variantKey] ?? STATUS_KPI_STYLES["deposit-approved"]

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-shadow duration-200 hover:shadow-xl",
        s.card
      )}
    >
      {s.glow ? (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
          aria-hidden
          style={{
            background: s.glow,
            opacity: s.glowOpacity ?? 0.25,
          }}
        />
      ) : null}
      <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0">
          <CardTitle
            className={cn("text-xs font-medium uppercase tracking-wider sm:text-sm", s.title)}
          >
            {title}
          </CardTitle>
          <p className={cn("mt-1 text-[11px]", s.meta)}>{description}</p>
        </div>
        <div className={cn("shrink-0 rounded-lg p-2 ring-1", s.iconWrap)}>
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", s.icon)} aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="relative pb-6 pt-0">
        <p className={cn("text-2xl font-bold tabular-nums tracking-tight sm:text-3xl", s.amount)}>
          {tnd(amount)}
        </p>
        <p className={cn("mt-1 text-sm", s.meta)}>
          <span className={cn("font-semibold", s.count)}>{count.toLocaleString()}</span>{" "}
          {count === 1 ? "transaction" : "transactions"}
        </p>
      </CardContent>
    </Card>
  )
}

function MethodRow({ m }) {
  const totalVol = m.deposits.total + m.withdrawals.total
  const depPct = totalVol > 0 ? (m.deposits.total / totalVol) * 100 : 0

  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-800/40 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-950"
            style={{ backgroundColor: m.color }}
            aria-hidden
          />
          <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {m.label}
          </span>
        </div>
        <Badge variant="secondary" className="shrink-0 font-mono text-xs tabular-nums">
          {tnd(totalVol)}
        </Badge>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={Math.round(depPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${m.label}: deposits ${Math.round(depPct)} percent of volume`}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${depPct}%`, backgroundColor: m.color }}
        />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        <span>
          Deposits (approved):{" "}
          <strong className="text-emerald-700 dark:text-emerald-400">
            {m.deposits.count} · {tnd(m.deposits.total)}
          </strong>
        </span>
        <span>
          Withdrawals (approved):{" "}
          <strong className="text-rose-700 dark:text-rose-400">
            {m.withdrawals.count} · {tnd(m.withdrawals.total)}
          </strong>
        </span>
      </div>
    </div>
  )
}

export function TransactionAnalyticsDashboard() {
  const chartId = useId()
  const isNarrow = useIsNarrowScreen()
  const { user: portalUser, initializing } = usePortalAuth()

  const [days, setDays] = useState("30")
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAnalytics = useCallback(async () => {
    const token = getStoredToken()
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await portalAnalytics({
        days,
        recentLimit: 20,
        token,
      })
      setAnalytics(res.data)
    } catch (err) {
      setError(err.message || "Failed to load analytics")
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    if (initializing) return
    if (!getStoredToken()) {
      setLoading(false)
      return
    }
    loadAnalytics()
  }, [initializing, loadAnalytics])

  const summary = analytics?.summary
  const methodStats = useMemo(
    () => withMethodColors(analytics?.methodStats ?? []),
    [analytics?.methodStats]
  )
  const recentTransactions = analytics?.recentTransactions ?? []
  const activeRails =
    analytics?.activeRails ?? methodStats.filter((m) => m.key !== "unknown").length
  const periodLabel =
    summary?.periodLabel ??
    (days === "all" ? "All time" : days === "today" ? "Today" : `Last ${days} days`)

  const depositsApproved = summary?.deposits?.approved ?? { count: 0, totalAmount: 0 }
  const depositsRejected = summary?.deposits?.rejected ?? { count: 0, totalAmount: 0 }
  const withdrawalsApproved = summary?.withdrawals?.approved ?? { count: 0, totalAmount: 0 }
  const withdrawalsRejected = summary?.withdrawals?.rejected ?? { count: 0, totalAmount: 0 }

  const net = depositsApproved.totalAmount - withdrawalsApproved.totalAmount

  const barData = useMemo(
    () => ({
      labels: methodStats.map((x) => x.shortLabel),
      datasets: [
        {
          label: "Deposits",
          data: methodStats.map((x) => x.deposits.total),
          backgroundColor: methodStats.map((x) => `${x.color}cc`),
          borderColor: methodStats.map((x) => x.color),
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "Withdrawals",
          data: methodStats.map((x) => x.withdrawals.total),
          backgroundColor: methodStats.map((x) => `${x.color}40`),
          borderColor: methodStats.map((x) => `${x.color}99`),
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [methodStats]
  )

  const barOptions = useMemo(() => {
    const tickColor = "#64748b"
    const gridColor = "rgba(148, 163, 184, 0.15)"
    const fmtY = (v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : v)

    if (isNarrow) {
      return {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", intersect: true },
        datasets: {
          bar: {
            categoryPercentage: 0.78,
            barPercentage: 0.9,
            maxBarThickness: 22,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 6,
              boxHeight: 6,
              padding: 12,
              font: { size: 10 },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${tnd(ctx.parsed.x)}`,
            },
          },
        },
        scales: {
          x: {
            stacked: false,
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { size: 9 },
              maxTicksLimit: 6,
              callback: (v) => fmtY(v),
            },
          },
          y: {
            stacked: false,
            grid: { display: false },
            ticks: {
              color: tickColor,
              font: { size: 10 },
              autoSkip: false,
            },
          },
        },
      }
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: false },
      datasets: {
        bar: { categoryPercentage: 0.72, barPercentage: 0.85 },
      },
      plugins: {
        legend: {
          position: "top",
          labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${tnd(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 11 }, maxRotation: 0 },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            callback: (v) => fmtY(v),
          },
        },
      },
    }
  }, [isNarrow])

  const doughnutData = useMemo(
    () => ({
      labels: ["Deposits", "Withdrawals"],
      datasets: [
        {
          data: [depositsApproved.totalAmount, withdrawalsApproved.totalAmount],
          backgroundColor: ["#059669", "#e11d48"],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    [depositsApproved.totalAmount, withdrawalsApproved.totalAmount]
  )

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: isNarrow ? "56%" : "68%",
      layout: {
        padding: isNarrow ? { top: 4, bottom: 4, left: 4, right: 4 } : { top: 8, bottom: 8, left: 8, right: 8 },
      },
      plugins: {
        legend: {
          position: "bottom",
          align: "center",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: isNarrow ? 6 : 8,
            padding: isNarrow ? 10 : 16,
            font: { size: isNarrow ? 10 : 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${tnd(ctx.parsed)}`,
          },
        },
      },
    }),
    [isNarrow]
  )

  if (initializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6D00] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Transaction analytics
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Payments for{" "}
            <code className="rounded bg-slate-200/80 px-1 py-0.5 text-xs dark:bg-slate-800">
              {portalUser?.domain}
            </code>{" "}
            (from your return URL domain). Approved totals, net flow, and charts use amounts{" "}
            <strong className="font-medium text-slate-700 dark:text-slate-300">
              after 1% platform fee
            </strong>{" "}
            (99% of gross). Rejected totals show gross amounts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="analytics-period">
            Time period
          </label>
          <select
            id="analytics-period"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            disabled={loading}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
            <RefreshCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40">
          <CardContent className="flex items-center gap-3 p-4 text-red-800 dark:text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {loading && !analytics ? (
        <div className="flex min-h-[280px] items-center justify-center text-muted-foreground">
          Loading analytics…
        </div>
      ) : (
        <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusKpiTile
          title="Deposits approved"
          count={depositsApproved.count}
          amount={depositsApproved.totalAmount}
          icon={ArrowDownLeft}
          flow="deposit"
          status="approved"
          description={periodLabel}
        />
        <StatusKpiTile
          title="Deposits rejected"
          count={depositsRejected.count}
          amount={depositsRejected.totalAmount}
          icon={ArrowDownLeft}
          flow="deposit"
          status="rejected"
          description={periodLabel}
        />
        <StatusKpiTile
          title="Withdrawals approved"
          count={withdrawalsApproved.count}
          amount={withdrawalsApproved.totalAmount}
          icon={ArrowUpRight}
          flow="withdrawal"
          status="approved"
          description={periodLabel}
        />
        <StatusKpiTile
          title="Withdrawals rejected"
          count={withdrawalsRejected.count}
          amount={withdrawalsRejected.totalAmount}
          icon={ArrowUpRight}
          flow="withdrawal"
          status="rejected"
          description={periodLabel}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "relative overflow-hidden border-0 text-white shadow-lg",
            net >= 0
              ? "bg-gradient-to-br from-teal-950 via-cyan-900 to-slate-900 shadow-teal-950/30"
              : "bg-gradient-to-br from-orange-950 via-red-900 to-slate-900 shadow-orange-950/30"
          )}
        >
          <div
            className="pointer-events-none absolute -left-6 -bottom-10 h-36 w-36 rounded-full opacity-20 blur-2xl"
            aria-hidden
            style={{ background: net >= 0 ? "#2dd4bf" : "#fb923c" }}
          />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-white/70">
              Net flow
            </CardTitle>
            <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/10">
              <TrendingUp className="h-4 w-4 text-white/90" aria-hidden />
            </div>
          </CardHeader>
          <CardContent className="relative pb-6">
            <p className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
              {net >= 0 ? "+" : ""}
              {tnd(net)}
            </p>
            <p className="mt-2 text-xs text-white/55">
              Approved deposits minus approved withdrawals (
              {periodLabel.toLowerCase()}).
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#FF6D00] via-[#FF8533] to-amber-900 text-white shadow-lg shadow-orange-900/35">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-15 blur-2xl"
            aria-hidden
          />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-white/80">
              Payment rails
            </CardTitle>
            <div className="rounded-lg bg-white/15 p-2 ring-1 ring-white/20">
              <Layers className="h-4 w-4 text-white" aria-hidden />
            </div>
          </CardHeader>
          <CardContent className="relative pb-6">
            <p className="text-3xl font-bold tabular-nums text-white sm:text-4xl">{activeRails}</p>
            <p className="mt-2 text-xs text-white/70">
              Methods with approved activity in this period.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="relative overflow-hidden border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 lg:col-span-2">
          <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              In vs out
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Share of approved volume: deposits vs withdrawals.
            </p>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0 sm:px-6 sm:pb-6">
            <div
              className="relative mx-auto w-full max-w-full sm:max-w-xs"
              id={`${chartId}-donut`}
            >
              <p className="sr-only">
                Approved deposits {tnd(depositsApproved.totalAmount)}, approved withdrawals{" "}
                {tnd(withdrawalsApproved.totalAmount)}.
              </p>
              <div className="h-[200px] w-full min-h-[200px] sm:h-[240px] sm:min-h-[240px] lg:h-[260px] lg:min-h-[260px]">
                <Doughnut key={`donut-${isNarrow}-${days}`} data={doughnutData} options={doughnutOptions} aria-hidden />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative min-w-0 overflow-hidden border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20 lg:col-span-3">
          <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />
              Volume by method
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isNarrow
                ? "Horizontal bars: deposit vs withdrawal for each payment method."
                : "Grouped bars: approved deposit and withdrawal totals per rail."}
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-4 pt-0 sm:px-6 sm:pb-6">
            <div
              className={cn(
                "w-full min-w-0 px-2 sm:px-0",
                !isNarrow &&
                  "overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] sm:overflow-x-visible"
              )}
            >
              <div
                className={cn(
                  "w-full min-w-0",
                  isNarrow
                    ? "h-[min(52vh,320px)] min-h-[260px] max-h-[360px]"
                    : "h-[280px] min-h-[260px] min-w-[min(100%,520px)] lg:min-w-0"
                )}
              >
                <Bar key={`bar-${isNarrow}-${days}`} data={barData} options={barOptions} aria-hidden />
              </div>
            </div>
            <p className="sr-only">
              Bar chart comparing deposit and withdrawal totals for D17, Flouci, credit card, IZI,
              and mandate.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-slate-500" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Method breakdown</h2>
        </div>
        {methodStats.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {methodStats.map((m) => (
              <MethodRow key={m.key} m={m} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No transactions in this period.</p>
        )}
      </div>

      <Card className="border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-950/80">
        <CardHeader>
          <CardTitle className="text-lg">Recent activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest processed payments linked to your client and user IDs.
          </p>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {recentTransactions.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              No recent transactions in this period.
            </p>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px]">Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden text-right sm:table-cell">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((row) => (
                <TableRow key={row.transactionId}>
                  <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {row.transactionId}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-medium capitalize",
                        row.requestType === "deposit"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                          : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
                      )}
                    >
                      {row.requestType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium capitalize">
                      {(row.status || "pending").replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">{row.method}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {tnd(row.amount)}
                  </TableCell>
                  <TableCell className="hidden text-right text-sm text-muted-foreground sm:table-cell">
                    {format(new Date(row.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
        </>
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-500">
        Signed in as <span className="font-mono">{portalUser?.domain}</span>
      </p>
    </div>
  )
}
