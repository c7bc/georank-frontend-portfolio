"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, YAxis, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus, CircleCheckBig, XCircle, ArrowRight, Search, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const visibilityConfig = {
  score: { label: "Visibility", color: "var(--primary)" },
} satisfies ChartConfig;

const competitorConfig = {
  score: { label: "GEO Score", color: "var(--primary)" },
} satisfies ChartConfig;

const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
  score: Math.round(40 + Math.sin(i / 4) * 20 + (i / 30) * 15),
}));

const platformImages: Record<string, { src: string; label: string }> = {
  chatgpt: { src: "/platforms/chatgpt.png", label: "GPT" },
  claude: { src: "/platforms/claude.webp", label: "Claude" },
  perplexity: { src: "/platforms/perplexity.png", label: "Pplx" },
  gemini: { src: "/platforms/gemini.png", label: "Gem" },
};

const mentionsData = [
  { id: 1, platform: "chatgpt", query: "best ai seo tools 2024", result: "mentioned", position: 2, time: "2h ago" },
  { id: 2, platform: "perplexity", query: "how to track ai visibility", result: "mentioned", position: 1, time: "5h ago" },
  { id: 3, platform: "claude", query: "geo optimization tools", result: "not_mentioned", position: null, time: "1d ago" },
  { id: 4, platform: "gemini", query: "top marketing tools 2024", result: "mentioned", position: 4, time: "1d ago" },
  { id: 5, platform: "chatgpt", query: "ai visibility tracking", result: "mentioned", position: 3, time: "2d ago" },
];

const keywordsData = [
  { id: 1, keyword: "ai visibility tool", score: 82, trend: 12, status: "ranking", mentions: 45, visibility: 82 },
  { id: 2, keyword: "geo optimization", score: 71, trend: 5, status: "improving", mentions: 28, visibility: 71 },
  { id: 3, keyword: "llm brand monitoring", score: 45, trend: -3, status: "needs_work", mentions: 12, visibility: 45 },
  { id: 4, keyword: "ai search ranking", score: 68, trend: 8, status: "ranking", mentions: 34, visibility: 68 },
  { id: 5, keyword: "chatgpt seo strategy", score: 23, trend: 0, status: "not_ranking", mentions: 5, visibility: 23 },
];

const competitorData = [
  { name: "Your Brand", score: 72 },
  { name: "Competitor A", score: 85 },
  { name: "Competitor B", score: 61 },
  { name: "Competitor C", score: 48 },
];

const statusLabels: Record<string, string> = {
  ranking: "Ranking",
  improving: "Improving",
  needs_work: "Needs Work",
  not_ranking: "Not Ranking",
};

export function PreviewDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor your AI visibility and ranking performance.</p>
      </div>

      {/* Metric Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PreviewMetricCard title="GEO Score" value={72} suffix="/100" change={12.5} trendLabel="Trending up" contextLabel="Compared to last period" />
        <PreviewMetricCard title="AI Mentions" value={156} suffix="this month" change={8.1} trendLabel="Trending up" contextLabel="Across all platforms" />
        <PreviewMetricCard title="Keywords Tracked" value={24} suffix="/ 50 limit" change={0} trendLabel="Stable performance" contextLabel="Active keyword tracking" />
        <PreviewMetricCard title="Best Ranking" value="#2" suffix="avg position" change={4.5} trendLabel="Trending up" contextLabel="Position improved" />
      </div>

      {/* Visibility Chart */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Visibility Trends</CardTitle>
            <CardDescription>AI visibility score over time.</CardDescription>
          </div>
          <CardAction>
            <ToggleGroup type="single" value="30d" variant="outline" className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
              <ToggleGroupItem value="90d">90D</ToggleGroupItem>
              <ToggleGroupItem value="30d">30D</ToggleGroupItem>
              <ToggleGroupItem value="7d">7D</ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={visibilityConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="prevFillScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="score"
                type="basis"
                fill="url(#prevFillScore)"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Separator className="opacity-50" />

      {/* Two-column grid: Recent Mentions + Top Keywords */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Mentions */}
        <div className="min-w-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold">Recent Mentions</h3>
                <p className="text-xs text-muted-foreground">Latest brand appearances in AI.</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                View All <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border bg-card/30">
              <Table className="table-fixed">
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground">Platform</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Query</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Result</TableHead>
                    <TableHead className="h-9 text-xs font-semibold px-4 text-right text-muted-foreground hidden sm:table-cell">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentionsData.map((m) => (
                    <TableRow key={m.id} className="cursor-pointer hover:bg-muted/40 transition-colors border-b last:border-0 h-12">
                      <TableCell className="px-4">
                        <Badge variant="outline" className="font-mono text-[10px] bg-background/50 text-muted-foreground py-0 h-5 px-1.5 gap-1 items-center">
                          {platformImages[m.platform] && (
                            <img src={platformImages[m.platform].src} alt={platformImages[m.platform].label} width={11} height={11} className="rounded-sm object-contain shrink-0 dark:invert" />
                          )}
                          {platformImages[m.platform]?.label ?? m.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate font-medium text-sm py-2">
                        {m.query}
                      </TableCell>
                      <TableCell className="py-2">
                        {m.result === "mentioned" ? (
                          <Badge variant="outline" className="text-muted-foreground px-1.5 h-6 gap-1.5 font-medium border-border/50">
                            <CircleCheckBig className="size-3 text-green-500 dark:text-green-400" />
                            <span className="text-[11px] tabular-nums">#{m.position}</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground px-1.5 h-6 gap-1.5 font-medium border-border/50">
                            <XCircle className="size-3 text-red-500 dark:text-red-400 opacity-70" />
                            <span className="text-[11px]">Not found</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs px-4 text-right tabular-nums py-2 hidden sm:table-cell">
                        {m.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="min-w-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold">Top Keywords</h3>
                <p className="text-xs text-muted-foreground">Best performing tracked keywords.</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                View All <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border bg-card/30">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground w-[45%]">Keyword</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground w-[25%]">Score</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Trend</TableHead>
                    <TableHead className="h-9 text-xs font-semibold px-4 text-right text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordsData.map((k) => (
                    <TableRow key={k.id} className="hover:bg-muted/40 transition-colors border-b last:border-0">
                      <TableCell className="px-4 py-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm leading-tight truncate">{k.keyword}</span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {k.mentions} mention{k.mentions !== 1 ? "s" : ""} · {k.visibility}% visibility
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold tabular-nums">{k.score}</span>
                          <Progress value={k.score} className="w-12 h-1 bg-muted" />
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-bold px-1.5 py-0 h-5 border-border/50 transition-colors cursor-default",
                            k.trend > 0 ? "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50" :
                            k.trend < 0 ? "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50" :
                            "text-muted-foreground"
                          )}
                        >
                          {k.trend > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
                          {k.trend < 0 && <TrendingDown className="h-3 w-3 mr-1" />}
                          {k.trend === 0 && <Minus className="h-3 w-3 mr-1" />}
                          {k.trend > 0 ? "+" : ""}{k.trend}%
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 text-right py-2.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] font-medium h-6 px-2",
                            k.status === "ranking" ? "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400" :
                            k.status === "improving" ? "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400" :
                            k.status === "needs_work" ? "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400" :
                            "border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground"
                          )}
                        >
                          {statusLabels[k.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold">Competitor Comparison</h3>
            <p className="text-xs text-muted-foreground">How you rank against competitors.</p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
            View Details <ArrowRight className="size-3" />
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border bg-card/30 px-2 sm:px-6 pt-8 pb-4">
          <ChartContainer config={competitorConfig} className="h-[200px] w-full">
            <BarChart data={competitorData} layout="vertical" margin={{ left: 80, right: 30 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 500 }}
                width={70}
              />
              <ChartTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={28}>
                {competitorData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === 0 ? "var(--primary)" : "var(--muted-foreground)"}
                    opacity={index === 0 ? 1 : 0.2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

interface PreviewMetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  change: number;
  trendLabel: string;
  contextLabel: string;
}

function PreviewMetricCard({ title, value, suffix, change, trendLabel, contextLabel }: PreviewMetricCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[200px]/card:text-3xl">
          {value}
          {suffix && (
            <span className="ml-1 text-[11px] font-normal text-muted-foreground whitespace-nowrap">
              {suffix}
            </span>
          )}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={cn(
              "gap-1.5 px-1.5 font-medium",
              isPositive && "text-green-500 dark:text-green-400",
              isNegative && "text-red-500 dark:text-red-400",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            <TrendingUp className={cn("size-3", !isPositive && "hidden")} />
            <TrendingDown className={cn("size-3", !isNegative && "hidden")} />
            {!isPositive && !isNegative && <Minus className="size-3" />}
            {isPositive ? "+" : ""}{change}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-0.5 text-[11px] text-muted-foreground">
        <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-foreground text-xs h-6">
          {trendLabel}
          {isPositive && <TrendingUp className="size-3" />}
          {isNegative && <TrendingDown className="size-3" />}
        </div>
        <div className="line-clamp-1 opacity-70">{contextLabel}</div>
      </CardFooter>
    </Card>
  );
}
