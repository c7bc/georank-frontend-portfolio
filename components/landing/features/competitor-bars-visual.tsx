"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { TrendingUp, TrendingDown, Minus, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const competitors = [
  { name: "HubSpot", abbr: "HS", color: "bg-orange-500", score: 85, trend: 5, status: "ranking" as const, rank: 1, logo: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/1200/external-hubspot-a-developer-and-marketer-of-software-products-logo-color-tal-revivo.jpg" },
  { name: "Your Brand", abbr: "YB", color: "bg-primary", score: 73, trend: 12, status: "improving" as const, isYou: true, rank: 2, logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT56ADZTFAOWTzOnS5HV-d94_2bOzMgyZUhog&s" },
  { name: "Notion", abbr: "NO", color: "bg-neutral-800", score: 68, trend: 3, status: "ranking" as const, rank: 3, logo: "https://prowly-prod.s3.eu-west-1.amazonaws.com/uploads/60169/assets/601039/-1f98f505180d14739e58c06d7a11eaea.png" },
  { name: "Slack", abbr: "SL", color: "bg-purple-500", score: 61, trend: -2, status: "ranking" as const, rank: 4, logo: "https://www.conversion.com.br/wp-content/uploads/2019/03/ahrefs-thumb.jpg" },
  { name: "Asana", abbr: "AS", color: "bg-rose-500", score: 52, trend: 1, status: "needs_work" as const, rank: 5, logo: "https://images.softwaresuggest.com/software_logo/surferseo-20240715151729.png" },
  { name: "Monday", abbr: "MO", color: "bg-yellow-500", score: 45, trend: -5, status: "needs_work" as const, rank: 6, logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR--Fpsaw5ph9kGWQqYcvZ74ICNvAkZH0L2sg&s" },
  { name: "Zendesk", abbr: "ZD", color: "bg-emerald-500", score: 38, trend: 0, status: "needs_work" as const, rank: 7, logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Iv89ZPJrVl58F2emJT25iTS1ES9ZIIj-jg&s" },
  { name: "Intercom", abbr: "IC", color: "bg-blue-500", score: 31, trend: -3, status: "needs_work" as const, rank: 8, logo: "https://images.icon-icons.com/2429/PNG/512/intercom_logo_icon_147276.png" },
];

export function CompetitorBarsVisual() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,black_50%)]">
      <div className="overflow-hidden rounded-lg border bg-card/30 h-full">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground w-8">#</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Competitor</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Score</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Trend</TableHead>
              <TableHead className="h-9 text-xs font-semibold px-4 text-right text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((comp) => (
              <TableRow
                key={comp.name}
                className={cn(
                  "hover:bg-muted/40 transition-colors border-b last:border-0 h-10",
                  comp.isYou && "bg-primary/5"
                )}
              >
                <TableCell className="px-4 py-2">
                  <span className={cn(
                    "text-xs font-bold tabular-nums",
                    comp.rank === 1 && "text-amber-500",
                    comp.rank === 2 && "text-muted-foreground",
                    comp.rank >= 3 && "text-muted-foreground/60"
                  )}>
                    {comp.rank === 1 ? <Crown className="size-3.5 text-amber-500" /> : comp.rank}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      {comp.logo && <AvatarImage src={comp.logo} alt={comp.name} />}
                      <AvatarFallback className={cn("text-[7px] font-bold text-white", comp.color)}>
                        {comp.abbr}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn("text-sm", comp.isYou ? "font-semibold text-primary" : "font-medium")}>
                      {comp.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-xs whitespace-nowrap tabular-nums font-medium", comp.isYou ? "text-primary" : "text-muted-foreground")}>
                      {comp.score}
                    </span>
                    <Progress value={comp.score} className="w-14 h-1 bg-muted" />
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold px-1.5 py-0 h-5 border-border/50 transition-colors",
                      comp.trend > 0 && "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50",
                      comp.trend < 0 && "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50",
                      comp.trend === 0 && "text-muted-foreground"
                    )}
                  >
                    {comp.trend > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
                    {comp.trend < 0 && <TrendingDown className="h-3 w-3 mr-1" />}
                    {comp.trend === 0 && <Minus className="h-3 w-3 mr-1" />}
                    {comp.trend > 0 ? "+" : ""}{comp.trend}%
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-right py-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-medium h-6 px-2",
                      comp.status === "ranking" && "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400",
                      comp.status === "improving" && "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400",
                      comp.status === "needs_work" && "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400"
                    )}
                  >
                    {comp.status === "ranking" && "Ranking"}
                    {comp.status === "improving" && "Improving"}
                    {comp.status === "needs_work" && "Needs Work"}
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
