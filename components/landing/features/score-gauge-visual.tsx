"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const platforms = [
  { name: "ChatGPT", abbr: "GP", color: "bg-green-500", score: 85, trend: 8, trendType: "up" as const, logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ_jfzEhFaMwtNeD7wy1B78Yf7LVgqvD4xg&s" },
  { name: "Claude", abbr: "CL", color: "bg-amber-500", score: 72, trend: 15, trendType: "up" as const, logo: "https://cdn-1.webcatalog.io/catalog/claude/claude-icon-filled-256.webp?v=1769992737946" },
  { name: "Perplexity", abbr: "PX", color: "bg-blue-500", score: 58, trend: -3, trendType: "down" as const, logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLbKqia9h-6FPu4yhtOmldu5R33c1cC53hHA&s" },
  { name: "Gemini", abbr: "GM", color: "bg-purple-500", score: 64, trend: 5, trendType: "up" as const, logo: "https://static.vecteezy.com/system/resources/previews/055/687/055/non_2x/rectangle-gemini-google-icon-symbol-logo-free-png.png" },
];

export function ScoreGaugeVisual() {
  return (
    <div className="absolute inset-0 p-3 [mask-image:linear-gradient(to_top,transparent_10%,black_50%)]">
      <div className="flex flex-col gap-3 h-full">
        {/* Metric Card - same pattern as dashboard MetricCard */}
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs *:data-[slot=card-header]:pb-0 *:data-[slot=card-footer]:pt-0 py-4 gap-3">
          <CardHeader>
            <CardDescription>GEO Score</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[200px]/card:text-3xl">
              73
              <span className="ml-1 text-[11px] font-normal text-muted-foreground">/ 100</span>
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="gap-1.5 px-1.5 font-medium text-green-500 dark:text-green-400"
              >
                <TrendingUp className="size-3" />
                +12%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={73} className="h-1.5" />
          </CardContent>
          <CardFooter className="flex-col items-start gap-0.5 text-[11px] text-muted-foreground">
            <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-foreground text-xs">
              Trending up this month <TrendingUp className="size-3" />
            </div>
            <div className="line-clamp-1 opacity-70">
              +8 points from last month
            </div>
          </CardFooter>
        </Card>

        {/* Platform breakdown with avatars and trends */}
        <div className="overflow-hidden rounded-lg border bg-card/30 flex-1">
          <div className="p-3 space-y-2">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-2.5">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={p.logo} alt={p.name} />
                  <AvatarFallback className={cn("text-[7px] font-bold text-white", p.color)}>
                    {p.abbr}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium w-16 truncate">{p.name}</span>
                <Progress value={p.score} className="h-1 flex-1 bg-muted" />
                <span className="text-xs font-medium tabular-nums text-muted-foreground w-6 text-right">
                  {p.score}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-bold px-1 py-0 h-4 text-[9px] border-border/50",
                    p.trendType === "up" && "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50",
                    p.trendType === "down" && "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50"
                  )}
                >
                  {p.trendType === "up" ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                  {p.trend > 0 ? "+" : ""}{p.trend}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
