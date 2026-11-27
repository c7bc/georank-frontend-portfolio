"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { TrendingUp } from "lucide-react"

const chartConfig = {
  score: {
    label: "Visibility Score",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface VisibilityDataPoint {
  date: string
  score: number
}

interface VisibilityChartProps {
  data?: VisibilityDataPoint[]
}

export function VisibilityChart({ data = [] }: VisibilityChartProps) {
  const t = useTranslations("dashboard.visibility")
  const [timeRange, setTimeRange] = React.useState("30d")

  const filteredData = React.useMemo(() => {
    if (data.length === 0) return []
    
    // Sort data by date just in case
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    if (timeRange === "all") return sorted

    const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const lastDate = new Date(sorted[sorted.length - 1].date)
    const startDate = new Date(lastDate)
    startDate.setDate(lastDate.getDate() - daysToSubtract)

    return sorted.filter(p => new Date(p.date) >= startDate)
  }, [data, timeRange])

  return (
    <Card className="@container/card" data-testid="visibility-chart">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              {t("subtitle")}
            </span>
            <span className="@[540px]/card:hidden">{timeRange === "30d" ? "Last 30 days" : timeRange === "7d" ? "Last 7 days" : "Last 90 days"}</span>
          </CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90D</ToggleGroupItem>
            <ToggleGroupItem value="30d">30D</ToggleGroupItem>
            <ToggleGroupItem value="7d">7D</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-24 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">90 Days</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 Days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 Days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {data.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground">
            <TrendingUp className="mb-2 h-8 w-8 opacity-50" />
            <p className="font-medium">{t("emptyTitle")}</p>
            <p className="text-sm">{t("emptyDescription")}</p>
          </div>
        ) : (
          <ChartContainer
            id="visibility-chart"
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.01}
                  />
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
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    className="bg-background/95 backdrop-blur-sm border-border"
                  />
                }
              />
              <Area
                dataKey="score"
                type="natural"
                fill="url(#fillScore)"
                stroke="var(--primary)"
                strokeWidth={2}
                animationDuration={1500}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
