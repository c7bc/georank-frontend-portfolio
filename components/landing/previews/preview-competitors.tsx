"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  BarChart2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const radarChartConfig = {
  yourBrand: { label: "Your Brand", color: "var(--chart-1)" },
  competitor: { label: "Competitor", color: "var(--chart-2)" },
} satisfies ChartConfig;

const competitors = [
  { id: 1, name: "Competitor A", domain: "competitor-a.com", geo_score: 85, comparison: "ahead", difference: 13, trend: 3, trend_type: "up", keywords_ranking: 12, mentions: 89, last_analyzed_at: "2024-02-15" },
  { id: 2, name: "Competitor B", domain: "competitor-b.com", geo_score: 61, comparison: "behind", difference: 11, trend: -2, trend_type: "down", keywords_ranking: 8, mentions: 45, last_analyzed_at: "2024-02-14" },
];

const radarData = [
  { axis: "ChatGPT", yourBrand: 54, competitor: 77 },
  { axis: "Claude", yourBrand: 58, competitor: 73 },
  { axis: "Perplexity", yourBrand: 47, competitor: 75 },
  { axis: "Gemini", yourBrand: 50, competitor: 78 },
  { axis: "Content Depth", yourBrand: 52, competitor: 81 },
  { axis: "Source Authority", yourBrand: 49, competitor: 72 },
];

const insights = [
  {
    icon: TrendingDown,
    iconColorClass: "text-red-500",
    bgColorClass: "bg-red-500/10 border-red-500/20",
    title: "You're 13 points behind",
    description: "Competitor A scores 85. Focus on content quality and platform presence to close the gap.",
  },
  {
    icon: BarChart2,
    iconColorClass: "text-primary",
    bgColorClass: "bg-primary/10 border-primary/20",
    title: "Strongest on ChatGPT",
    description: "Competitor A appears in 42 mentions on ChatGPT with avg. position 2.3.",
  },
  {
    icon: FileText,
    iconColorClass: "text-primary",
    bgColorClass: "bg-primary/10 border-primary/20",
    title: "AI Analysis",
    description: "Competitor A has stronger structured data coverage and more authoritative backlinks across AI platforms.",
  },
];

export function PreviewCompetitors() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Competitors</h2>
          <p className="text-muted-foreground">Track and compare your AI visibility against competitors.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">2/2 used</Badge>
          <Button className="gap-2 shadow-xs" disabled>
            <Plus className="h-4 w-4" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">{competitor.name}</CardTitle>
              <CardDescription>{competitor.domain}</CardDescription>
              <CardAction>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono">{competitor.geo_score}</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {competitor.comparison === "ahead" ? (
                  <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400">
                    {competitor.difference} pts ahead
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400">
                    {competitor.difference} pts behind
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Badge variant="outline" className="font-medium px-1.5 py-0 h-5 border-border/50 text-muted-foreground gap-1">
                  {competitor.trend_type === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {competitor.trend_type === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                  {competitor.trend_type === "stable" && <Minus className="h-3 w-3" />}
                  <span className={cn(
                    competitor.trend > 0 ? "text-green-600 dark:text-green-400" :
                    competitor.trend < 0 ? "text-red-600 dark:text-red-400" : ""
                  )}>
                    {competitor.trend > 0 ? "+" : ""}{competitor.trend} this week
                  </span>
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {competitor.keywords_ranking} ranking
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  {competitor.mentions} mentions
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Analysis →
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-[11px] text-muted-foreground/70 pt-0">
              Last analyzed {competitor.last_analyzed_at}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Head-to-Head Comparison */}
      <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>Head-to-Head</CardTitle>
          <CardDescription>Compare your brand visibility across AI platforms.</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" className="w-[180px] justify-start text-sm">
              Competitor A
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer config={radarChartConfig} className="mx-auto h-[250px] w-full max-w-lg">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Radar name="Your Brand" dataKey="yourBrand" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                <Radar name="Competitor A" dataKey="competitor" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Insights vs Competitor A</h3>
        <p className="text-sm text-muted-foreground">Key differences and opportunities.</p>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs mt-4 grid gap-4 md:grid-cols-3">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <Card key={i} className="@container/card transition-all hover:bg-muted/50">
                <CardContent className="p-6">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg border", insight.bgColorClass)}>
                    <Icon className={cn("h-5 w-5", insight.iconColorClass)} />
                  </div>
                  <h4 className="mt-4 font-semibold text-sm">{insight.title}</h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
