"use client";

import {
  LayoutDashboard,
  Globe,
  Search,
  Users,
  FileText,
  Lightbulb,
  CreditCard,
  Key,
  Plug,
  PanelLeft,
  Sparkles,
  Bell,
  Sun,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

/* ── Sidebar nav ───────────────────────────────────────── */

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Globe, label: "Domains" },
  { icon: Search, label: "Keywords" },
  { icon: Users, label: "Competitors" },
  { icon: FileText, label: "Reports" },
  { icon: Lightbulb, label: "Recommendations" },
];

const settingsNav = [
  { icon: Users, label: "Team" },
  { icon: CreditCard, label: "Billing" },
  { icon: Key, label: "API Keys" },
  { icon: Plug, label: "Integrations" },
];

/* ── Metric cards data ─────────────────────────────────── */

const metrics: { title: string; value: string; suffix: string; change: number; trend: "up" | "down" | "stable"; footer: string; context: string }[] = [
  { title: "Geo Score", value: "72", suffix: "/100", change: 8, trend: "up", footer: "Trending up", context: "Overall AI visibility" },
  { title: "AI Mentions", value: "24", suffix: "this month", change: 12, trend: "up", footer: "Trending up", context: "Across all platforms" },
  { title: "Keywords Tracked", value: "3", suffix: "/ 3 limit", change: 0, trend: "stable", footer: "Stable", context: "Active monitoring" },
  { title: "Best Ranking", value: "#2", suffix: "avg position", change: 3, trend: "up", footer: "Trending up", context: "Average across platforms" },
];

/* ── Chart data ─────────────────────────────────────────── */

const visibilityData = [
  { date: "January", score: 42 },
  { date: "February", score: 48 },
  { date: "March", score: 55 },
  { date: "April", score: 52 },
  { date: "May", score: 65 },
  { date: "June", score: 72 },
];

const chartConfig = {
  score: { label: "Visibility", color: "var(--primary)" },
} satisfies ChartConfig;

/* ── Component ─────────────────────────────────────────── */

export function DashboardPreview() {
  return (
    <div className="flex w-full overflow-hidden rounded-t-[16px] border border-b-0 border-border bg-sidebar text-foreground" style={{ fontSize: 0 }}>
      {/* Sidebar */}
      <div className="hidden w-[180px] shrink-0 flex-col border-r border-border bg-sidebar sm:flex">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5">
          <Image src="/favicon.svg" alt="GeoRank" width={22} height={22} className="rounded" />
          <span className="text-[13px] font-bold tracking-tight text-foreground">GeoRank</span>
        </div>

        {/* Main nav */}
        <div className="px-2">
          <p className="mb-1 px-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">Main</p>
          {mainNav.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-[6px] text-[11px]",
                item.active
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="size-3.5" />
              <span className="leading-none">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Settings nav */}
        <div className="mt-4 px-2">
          <p className="mb-1 px-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">Settings</p>
          {settingsNav.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-[6px] text-[11px] text-muted-foreground"
            >
              <item.icon className="size-3.5" />
              <span className="leading-none">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Header */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 px-4">
          <div className="flex items-center gap-2">
            <PanelLeft className="size-3.5 text-muted-foreground" />
            <div className="mx-1 h-3.5 w-px bg-border" />
            <div className="flex h-6 w-32 items-center rounded-md border border-border/60 bg-muted/30 px-2">
              <Search className="mr-1.5 size-2.5 text-muted-foreground/50" />
              <span className="text-[9px] text-muted-foreground/50">Search...</span>
              <span className="ml-auto rounded border border-border/50 bg-muted/50 px-1 text-[7px] text-muted-foreground/40">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5">
              <Sparkles className="size-2.5 text-primary" />
              <span className="text-[9px] font-bold text-primary">Upgrade to Pro</span>
            </div>
            <Sun className="size-3.5 text-muted-foreground/50" />
            <Bell className="size-3.5 text-muted-foreground/50" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-1 ring-border">
              <span className="text-[8px] font-medium text-muted-foreground">JD</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 p-5 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-[14px] font-bold tracking-tight text-foreground">Dashboard</h2>
            <p className="text-[9px] text-muted-foreground">Your AI visibility overview and key metrics.</p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.title} className="rounded-lg border border-border bg-gradient-to-t from-primary/5 to-card p-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">{m.title}</span>
                  {m.change !== 0 && (
                    <span className={cn(
                      "flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[8px] font-medium",
                      m.trend === "up" && "border-green-200 text-green-500 dark:border-green-900/50 dark:text-green-400",
                      m.trend === "down" && "border-red-200 text-red-500 dark:border-red-900/50 dark:text-red-400",
                    )}>
                      {m.trend === "up" && <TrendingUp className="size-2" />}
                      {m.trend === "down" && <TrendingDown className="size-2" />}
                      {m.change > 0 ? "+" : ""}{m.change}%
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-[18px] font-semibold tabular-nums leading-none text-foreground">{m.value}</span>
                  {m.suffix && <span className="text-[8px] text-muted-foreground">{m.suffix}</span>}
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center gap-1 text-[8px] font-medium text-foreground">
                    {m.footer}
                    {m.trend === "up" && <TrendingUp className="size-2" />}
                    {m.trend === "stable" && <Minus className="size-2" />}
                  </div>
                  <p className="text-[7px] text-muted-foreground/70">{m.context}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visibility Chart */}
          <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-semibold text-foreground">Visibility Score</h3>
                <p className="text-[8px] text-muted-foreground">AI visibility trend over the last 30 days</p>
              </div>
              <div className="flex items-center rounded-md border border-border">
                <span className="px-2 py-0.5 text-[8px] text-muted-foreground">90D</span>
                <span className="border-x border-border bg-muted/50 px-2 py-0.5 text-[8px] font-medium text-foreground">30D</span>
                <span className="px-2 py-0.5 text-[8px] text-muted-foreground">7D</span>
              </div>
            </div>
            <ChartContainer id="dashboard-preview-chart" config={chartConfig} className="mt-2 aspect-auto h-[100px] w-full">
              <AreaChart
                accessibilityLayer
                data={visibilityData}
                margin={{ left: 8, right: 8 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{ fontSize: 8 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="score"
                  type="natural"
                  fill="var(--color-score)"
                  fillOpacity={0.4}
                  stroke="var(--color-score)"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Tables peek (partially visible) */}
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Recent Mentions */}
            <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
              <h3 className="text-[11px] font-semibold text-foreground">Recent Mentions</h3>
              <p className="text-[8px] text-muted-foreground">Latest AI platform mentions</p>
              <div className="mt-2 space-y-0">
                {[
                  { platform: "chatgpt", query: "best project management tools", result: "Mentioned", pos: "#2", time: "2h ago" },
                  { platform: "perplexity", query: "top SaaS analytics platforms", result: "Mentioned", pos: "#1", time: "5h ago" },
                  { platform: "gemini", query: "enterprise collaboration software", result: "Not mentioned", pos: "", time: "8h ago" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2 border-t border-border/50 py-1.5 first:border-0">
                    <Image src={`/platforms/${m.platform}.png`} alt={m.platform} width={12} height={12} className="rounded-sm" />
                    <span className="flex-1 truncate text-[9px] text-foreground/70">{m.query}</span>
                    <span className={cn(
                      "rounded-full px-1.5 py-px text-[7px] font-medium",
                      m.pos ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-muted text-muted-foreground"
                    )}>
                      {m.result} {m.pos}
                    </span>
                    <span className="text-[7px] text-muted-foreground/50">{m.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Keywords */}
            <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
              <h3 className="text-[11px] font-semibold text-foreground">Top Keywords</h3>
              <p className="text-[8px] text-muted-foreground">Best performing tracked keywords</p>
              <div className="mt-2 space-y-0">
                {[
                  { keyword: "best CRM software 2025", score: 85, trend: 5, status: "ranking" },
                  { keyword: "project management tools", score: 73, trend: 12, status: "improving" },
                  { keyword: "team collaboration platform", score: 45, trend: -2, status: "needs_work" },
                ].map((k, i) => (
                  <div key={i} className="flex items-center gap-2 border-t border-border/50 py-1.5 first:border-0">
                    <span className="flex-1 truncate text-[9px] text-foreground/70">{k.keyword}</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-10 rounded-full bg-muted">
                        <div className="h-1 rounded-full bg-primary" style={{ width: `${k.score}%` }} />
                      </div>
                      <span className="text-[8px] tabular-nums text-muted-foreground">{k.score}</span>
                    </div>
                    <span className={cn(
                      "rounded-full px-1.5 py-px text-[7px] font-medium",
                      k.status === "ranking" && "bg-green-500/10 text-green-500 dark:text-green-400",
                      k.status === "improving" && "bg-blue-500/10 text-blue-500 dark:text-blue-400",
                      k.status === "needs_work" && "bg-amber-500/10 text-amber-500 dark:text-amber-400",
                    )}>
                      {k.status === "ranking" ? "Ranking" : k.status === "improving" ? "Improving" : "Needs Work"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
