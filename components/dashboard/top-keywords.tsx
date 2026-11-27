"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
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
import { TrendingUp, TrendingDown, Minus, Search, ArrowRight } from "lucide-react";
import { statusColors } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TopKeyword {
  id: string | number;
  keyword: string;
  score: number;
  trend: number;
  trendType: "up" | "down" | "stable";
  status: "ranking" | "improving" | "needs_work" | "not_ranking";
  position: number | null;
}

interface TopKeywordsProps {
  data?: TopKeyword[];
}

export function TopKeywords({ data = [] }: TopKeywordsProps) {
  const t = useTranslations("dashboard.topKeywords");
  const tStatus = useTranslations("keywords.status");

  const statusLabels: Record<string, string> = {
    ranking: tStatus("ranking"),
    improving: tStatus("improving"),
    needs_work: tStatus("needsWork"),
    not_ranking: tStatus("notRanking"),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold">{t("title")}</h3>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link
          href="/keywords"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          {t("viewAll")} <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card/30">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground">{t("keyword")}</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">{t("score")}</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">{t("trend")}</TableHead>
              <TableHead className="h-9 text-xs font-semibold px-4 text-right text-muted-foreground">{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="font-medium text-sm">{t("emptyTitle")}</p>
                  <p className="text-xs">{t("emptyDescription")}</p>
                </TableCell>
              </TableRow>
            )}
            {data.map((keyword) => (
              <TableRow key={keyword.id} className="hover:bg-muted/40 transition-colors border-b last:border-0 h-12">
                <TableCell className="px-4 py-2 font-medium text-sm">{keyword.keyword}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Score: {keyword.score}</span>
                    <Progress
                      value={keyword.score}
                      className="w-12 h-1 bg-muted"
                    />
                  </div>
                </TableCell>
                <TableCell className="py-2">
                   <Badge
                    variant="outline"
                    className={cn(
                      "font-bold px-1.5 py-0 h-5 border-border/50 transition-colors cursor-default",
                      keyword.trend > 0 ? "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50" : 
                      keyword.trend < 0 ? "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50" : 
                      "text-muted-foreground"
                    )}
                  >
                    {keyword.trend > 0 && (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    )}
                    {keyword.trend < 0 && (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {keyword.trend === 0 && (
                      <Minus className="h-3 w-3 mr-1" />
                    )}
                    {keyword.trend > 0 ? "+" : ""}{keyword.trend}%
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-right py-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-medium h-6 px-2", 
                      keyword.status === "ranking" ? "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400" :
                      keyword.status === "improving" ? "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400" :
                      keyword.status === "needs_work" ? "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400" :
                      "border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground"
                    )}
                  >
                    {statusLabels[keyword.status]}
                    {keyword.position && ` #${keyword.position}`}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
