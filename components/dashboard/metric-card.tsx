"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string | number;
  suffix?: string;
  change?: number;
  trendLabel?: string;
  contextLabel?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function MetricCard({
  title,
  value,
  suffix,
  change,
  trendLabel,
  contextLabel,
  icon,
  className,
}: Props) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <Card className={cn("@container/card", className)} data-testid="metric-card">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          {title}
          {icon && <div className="text-muted-foreground/30">{icon}</div>}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[200px]/card:text-3xl" data-testid="metric-value">
          {value}
          {suffix && (
            <span className="ml-1 text-[11px] font-normal text-muted-foreground whitespace-nowrap">
              {suffix}
            </span>
          )}
        </CardTitle>
        {change !== undefined && (
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
        )}
      </CardHeader>
      {(trendLabel || contextLabel || change !== undefined) && (
        <CardFooter className="flex-col items-start gap-0.5 text-[11px] text-muted-foreground">
          {(trendLabel || change !== undefined) && (
            <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-foreground text-xs h-6">
               {trendLabel || (isPositive ? "Trending up" : isNegative ? "Trending down" : "Stable performance")}
               {isPositive && <TrendingUp className="size-3" />}
               {isNegative && <TrendingDown className="size-3" />}
            </div>
          )}
          {contextLabel && (
            <div className="line-clamp-1 opacity-70">
              {contextLabel}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
