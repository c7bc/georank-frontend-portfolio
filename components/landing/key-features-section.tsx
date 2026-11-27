"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { TrendingUp, TrendingDown, Minus, CircleCheckBig, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

function KeywordsMiniVisual() {
  const keywords = [
    { keyword: "best SEO tools 2025", score: 82, trend: 12, status: "ranking" as const },
    { keyword: "AI brand monitoring", score: 68, trend: 5, status: "improving" as const },
    { keyword: "project management AI", score: 45, trend: -3, status: "needs_work" as const },
    { keyword: "competitor analysis tool", score: 73, trend: 8, status: "ranking" as const },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card/30">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-muted-foreground">Keyword</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Score</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Trend</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-right text-muted-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((kw) => (
            <TableRow key={kw.keyword} className="hover:bg-muted/40 transition-colors border-b last:border-0 h-9">
              <TableCell className="px-3 py-1.5 max-w-[140px] truncate font-medium text-xs">
                {kw.keyword}
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] tabular-nums font-medium text-muted-foreground">{kw.score}</span>
                  <Progress value={kw.score} className="w-10 h-1 bg-muted" />
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-bold px-1.5 py-0 h-5 border-border/50 text-[10px]",
                    kw.trend > 0 && "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50",
                    kw.trend < 0 && "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50",
                    kw.trend === 0 && "text-muted-foreground"
                  )}
                >
                  {kw.trend > 0 && <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
                  {kw.trend < 0 && <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                  {kw.trend === 0 && <Minus className="h-2.5 w-2.5 mr-0.5" />}
                  {kw.trend > 0 ? "+" : ""}{kw.trend}%
                </Badge>
              </TableCell>
              <TableCell className="px-3 text-right py-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-medium h-5 px-1.5",
                    kw.status === "ranking" && "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400",
                    kw.status === "improving" && "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400",
                    kw.status === "needs_work" && "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400"
                  )}
                >
                  {kw.status === "ranking" && "Ranking"}
                  {kw.status === "improving" && "Improving"}
                  {kw.status === "needs_work" && "Needs Work"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function InsightsMiniVisual() {
  const data = [
    { label: "Content Quality", yours: 78, competitor: 85 },
    { label: "Brand Authority", yours: 65, competitor: 72 },
    { label: "Citation Count", yours: 42, competitor: 38 },
    { label: "Response Rank", yours: 71, competitor: 68 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card/30">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-muted-foreground">Metric</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">You</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Competitor</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-right text-muted-foreground">Gap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const gap = row.yours - row.competitor;
            return (
              <TableRow key={row.label} className="hover:bg-muted/40 transition-colors border-b last:border-0 h-9">
                <TableCell className="px-3 py-1.5 text-xs font-medium">{row.label}</TableCell>
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Progress value={row.yours} className="w-8 h-1 bg-muted" />
                    <span className="text-[11px] tabular-nums font-medium text-primary">{row.yours}</span>
                  </div>
                </TableCell>
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Progress value={row.competitor} className="w-8 h-1 bg-muted" />
                    <span className="text-[11px] tabular-nums font-medium text-muted-foreground">{row.competitor}</span>
                  </div>
                </TableCell>
                <TableCell className="px-3 text-right py-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold px-1.5 py-0 h-5 text-[10px] border-border/50",
                      gap > 0 && "text-green-600 dark:text-green-400",
                      gap < 0 && "text-red-600 dark:text-red-400",
                      gap === 0 && "text-muted-foreground"
                    )}
                  >
                    {gap > 0 ? <CircleCheckBig className="h-2.5 w-2.5 mr-0.5" /> : null}
                    {gap > 0 ? "+" : ""}{gap}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DomainsMiniVisual() {
  const domains = [
    { name: "mysite.com", abbr: "MS", color: "bg-primary", score: 73, keywords: 24, trend: 8, status: "active" as const },
    { name: "blog.mysite.com", abbr: "BL", color: "bg-blue-500", score: 58, keywords: 12, trend: 3, status: "active" as const },
    { name: "docs.mysite.com", abbr: "DC", color: "bg-amber-500", score: 41, keywords: 6, trend: -2, status: "pending" as const },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card/30">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-muted-foreground">Domain</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Score</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Trend</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-right text-muted-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((d) => (
            <TableRow key={d.name} className="hover:bg-muted/40 transition-colors border-b last:border-0 h-9">
              <TableCell className="px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className={cn("text-[7px] font-bold text-white", d.color)}>
                      {d.abbr}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium truncate max-w-[100px]">{d.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] tabular-nums font-medium text-muted-foreground">{d.score}</span>
                  <Progress value={d.score} className="w-10 h-1 bg-muted" />
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-bold px-1.5 py-0 h-5 text-[10px] border-border/50",
                    d.trend > 0 && "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50",
                    d.trend < 0 && "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50"
                  )}
                >
                  {d.trend > 0 ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                  {d.trend > 0 ? "+" : ""}{d.trend}%
                </Badge>
              </TableCell>
              <TableCell className="px-3 text-right py-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-medium h-5 px-1.5",
                    d.status === "active" && "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400",
                    d.status === "pending" && "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400"
                  )}
                >
                  {d.status === "active" ? "Active" : "Pending"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SourcesMiniVisual() {
  const sources = [
    { domain: "wikipedia.org", abbr: "WK", color: "bg-neutral-700", citations: 24, influence: 92, trend: 5 },
    { domain: "techcrunch.com", abbr: "TC", color: "bg-green-600", citations: 18, influence: 78, trend: 12 },
    { domain: "g2.com", abbr: "G2", color: "bg-orange-500", citations: 12, influence: 65, trend: -1 },
    { domain: "reddit.com", abbr: "RD", color: "bg-red-500", citations: 9, influence: 54, trend: 3 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card/30">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-muted-foreground">Source</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Citations</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold text-muted-foreground">Influence</TableHead>
            <TableHead className="h-8 text-[11px] font-semibold px-3 text-right text-muted-foreground">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((s) => (
            <TableRow key={s.domain} className="hover:bg-muted/40 transition-colors border-b last:border-0 h-9">
              <TableCell className="px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className={cn("text-[7px] font-bold text-white", s.color)}>
                      {s.abbr}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium truncate max-w-[90px]">{s.domain}</span>
                  <ExternalLink className="size-2.5 text-muted-foreground/50 shrink-0" />
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-medium text-muted-foreground border-border/50">
                  <CircleCheckBig className="size-2.5 text-green-500 dark:text-green-400 mr-0.5" />
                  <span className="tabular-nums">{s.citations}</span>
                </Badge>
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex items-center gap-1.5">
                  <Progress value={s.influence} className="w-10 h-1 bg-muted" />
                  <span className="text-[11px] tabular-nums font-medium text-muted-foreground">{s.influence}</span>
                </div>
              </TableCell>
              <TableCell className="px-3 text-right py-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-bold px-1.5 py-0 h-5 text-[10px] border-border/50",
                    s.trend > 0 && "text-green-600 dark:text-green-400",
                    s.trend < 0 && "text-red-600 dark:text-red-400"
                  )}
                >
                  {s.trend > 0 ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                  {s.trend > 0 ? "+" : ""}{s.trend}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const features: React.ComponentType[] = [
  KeywordsMiniVisual,
  InsightsMiniVisual,
  DomainsMiniVisual,
  SourcesMiniVisual,
];

export function KeyFeaturesSection() {
  const t = useTranslations("keyFeatures");

  return (
    <section className="bg-background px-6 lg:px-0">
      <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-28">
        <p className="text-primary mb-4 text-center text-sm sm:text-base font-medium">
          {t("tagline")}
        </p>

        <h2 className="text-foreground mx-auto max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>

        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-14 md:gap-8">
          {features.map((Visual, i) => (
            <div
              key={i}
              className="bg-card border-border rounded-[16px] border p-6 shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]"
            >
              <h3 className="text-foreground text-lg font-medium">
                {t(`items.${i}.title`)}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {t(`items.${i}.description`)}
              </p>
              <div className="mt-4">
                <Visual />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
