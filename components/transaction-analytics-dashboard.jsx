"use client"

import { useMemo, useId, useSyncExternalStore } from "react"
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
import {
  MOCK_USER,
  MOCK_SUMMARY,
  MOCK_METHOD_STATS,
  MOCK_RECENT_TRANSACTIONS,
} from "@/components/mock-analytics"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

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
  }).format(n)}`

function KpiTile({
  title,
  count,
  amount,
  icon: Icon,
  variant,
  description,
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-lg transition-shadow duration-200 hover:shadow-xl",
        variant === "in"
          ? "bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white"
          : "bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 text-white"
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        aria-hidden
        style={{
          background: variant === "in" ? "#34d399" : "#fb7185",
        }}
      />
      <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-white/70">
            {title}
          </CardTitle>
          <p className="mt-1 text-xs text-white/50">{description}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/10">
          <Icon className="h-5 w-5 text-white/90" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4 pb-6">
        <div>
          <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
            {tnd(amount)}
          </p>
          <p className="mt-1 text-sm text-white/60">
            <span className="font-semibold text-white/90">{count.toLocaleString()}</span>{" "}
            transactions
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function MethodRow({ m }) {
  const totalVol = m.deposits.total + m.withdrawals.total
  const depPct = totalVol > 0 ? (m.deposits.total / totalVol) * 100 : 0

  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700">
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
          In:{" "}
          <strong className="text-emerald-700 dark:text-emerald-400">
            {m.deposits.count} · {tnd(m.deposits.total)}
          </strong>
        </span>
        <span>
          Out:{" "}
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
  const net = MOCK_SUMMARY.deposits.totalAmount - MOCK_SUMMARY.withdrawals.totalAmount

  const barData = useMemo(
    () => ({
      labels: MOCK_METHOD_STATS.map((x) => x.shortLabel),
      datasets: [
        {
          label: "Deposits",
          data: MOCK_METHOD_STATS.map((x) => x.deposits.total),
          backgroundColor: MOCK_METHOD_STATS.map((x) => `${x.color}cc`),
          borderColor: MOCK_METHOD_STATS.map((x) => x.color),
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "Withdrawals",
          data: MOCK_METHOD_STATS.map((x) => x.withdrawals.total),
          backgroundColor: MOCK_METHOD_STATS.map((x) => `${x.color}40`),
          borderColor: MOCK_METHOD_STATS.map((x) => `${x.color}99`),
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    []
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
          data: [MOCK_SUMMARY.deposits.totalAmount, MOCK_SUMMARY.withdrawals.totalAmount],
          backgroundColor: ["#059669", "#e11d48"],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    []
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Transaction analytics
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Deposits and withdrawals by volume and count, broken down by payment rail. Live data
            will connect to your{" "}
            <code className="rounded bg-slate-200/80 px-1 py-0.5 text-xs dark:bg-slate-800">
              userId
            </code>{" "}
            scope when the API is ready.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          >
            Preview · mock data
          </Badge>
          <Button type="button" variant="outline" size="sm" className="pointer-events-none opacity-70">
            Export report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          title="Deposits"
          count={MOCK_SUMMARY.deposits.count}
          amount={MOCK_SUMMARY.deposits.totalAmount}
          icon={ArrowDownLeft}
          variant="in"
          description={MOCK_SUMMARY.periodLabel}
        />
        <KpiTile
          title="Withdrawals"
          count={MOCK_SUMMARY.withdrawals.count}
          amount={MOCK_SUMMARY.withdrawals.totalAmount}
          icon={ArrowUpRight}
          variant="out"
          description={MOCK_SUMMARY.periodLabel}
        />
        <Card className="border-slate-200/90 bg-white/90 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Net flow
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" aria-hidden />
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-3xl font-bold tabular-nums sm:text-4xl",
                net >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
              )}
            >
              {net >= 0 ? "+" : ""}
              {tnd(net)}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Deposits minus withdrawals for the selected window.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/90 bg-gradient-to-br from-[#FF6D00]/12 via-white to-white shadow-md dark:border-slate-800 dark:from-[#FF6D00]/20 dark:via-slate-900 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Payment rails
            </CardTitle>
            <Layers className="h-4 w-4 text-[#FF6D00]" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-4xl">
              {MOCK_METHOD_STATS.length}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              D17, Flouci, card, IZI, mandate — same flags as your transaction model.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-slate-200/90 shadow-lg dark:border-slate-800 lg:col-span-2">
          <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
              In vs out
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Share of total amount by request type.
            </p>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0 sm:px-6 sm:pb-6">
            <div
              className="relative mx-auto w-full max-w-full sm:max-w-xs"
              id={`${chartId}-donut`}
            >
              <p className="sr-only">
                Deposits total {tnd(MOCK_SUMMARY.deposits.totalAmount)}, withdrawals total{" "}
                {tnd(MOCK_SUMMARY.withdrawals.totalAmount)}.
              </p>
              <div className="h-[200px] w-full min-h-[200px] sm:h-[240px] sm:min-h-[240px] lg:h-[260px] lg:min-h-[260px]">
                <Doughnut key={`donut-${isNarrow}`} data={doughnutData} options={doughnutOptions} aria-hidden />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-slate-200/90 shadow-lg dark:border-slate-800 lg:col-span-3">
          <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
              Volume by method
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isNarrow
                ? "Horizontal bars: deposit vs withdrawal for each payment method."
                : "Grouped bars: deposit and withdrawal totals per rail."}
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
                <Bar key={`bar-${isNarrow}`} data={barData} options={barOptions} aria-hidden />
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MOCK_METHOD_STATS.map((m) => (
            <MethodRow key={m.key} m={m} />
          ))}
        </div>
      </div>

      <Card className="border-slate-200/90 shadow-lg dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Recent activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest rows (design only). Columns map to transaction id, type, amount, method, and time.
          </p>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px]">Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden text-right sm:table-cell">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_TRANSACTIONS.map((row) => (
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
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-500 dark:text-slate-500">
        Signed-in context will use <span className="font-mono">{MOCK_USER.userId}</span> under client{" "}
        <span className="font-mono">{MOCK_USER.clientId}</span> · {MOCK_USER.displayName}
      </p>
    </div>
  )
}
