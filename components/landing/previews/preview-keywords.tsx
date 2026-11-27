"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Search,
  CircleCheckBig,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const keywords = [
  { id: 1, keyword: "best ai seo tools", domain: "yourbrand.com", platforms: ["chatgpt", "claude", "perplexity"], score: 85, trend: "up", visibility: 12, mentions: 48, status: "ranking", auto: true },
  { id: 2, keyword: "ai visibility tracking", domain: "yourbrand.com", platforms: ["chatgpt", "gemini"], score: 72, trend: "up", visibility: 8, mentions: 31, status: "improving", auto: true },
  { id: 3, keyword: "geo optimization tool", domain: "yourbrand.com", platforms: ["perplexity", "claude"], score: 58, trend: "stable", visibility: 0, mentions: 18, status: "needs_work", auto: false },
  { id: 4, keyword: "llm brand monitoring", domain: "yourbrand.com", platforms: ["chatgpt", "claude", "gemini"], score: 91, trend: "up", visibility: 15, mentions: 62, status: "ranking", auto: true },
  { id: 5, keyword: "chatgpt seo strategy", domain: "yourbrand.com", platforms: ["chatgpt"], score: 34, trend: "down", visibility: -5, mentions: 8, status: "not_ranking", auto: true },
  { id: 6, keyword: "ai search ranking", domain: "yourbrand.com", platforms: ["perplexity", "gemini"], score: 67, trend: "up", visibility: 6, mentions: 25, status: "improving", auto: true },
  { id: 7, keyword: "generative engine optimization", domain: "yourbrand.com", platforms: ["chatgpt", "claude", "perplexity", "gemini"], score: 78, trend: "up", visibility: 10, mentions: 39, status: "ranking", auto: true },
];

const statusConfig: Record<string, { label: string; className: string; icon: typeof CircleCheckBig }> = {
  ranking: { label: "Ranking", className: "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400", icon: CircleCheckBig },
  improving: { label: "Improving", className: "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400", icon: TrendingUp },
  needs_work: { label: "Needs Work", className: "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400", icon: AlertCircle },
  not_ranking: { label: "Not Ranking", className: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400", icon: XCircle },
};

const platformImages: Record<string, string> = {
  chatgpt: "/platforms/chatgpt.png",
  claude: "/platforms/claude.webp",
  perplexity: "/platforms/perplexity.png",
  gemini: "/platforms/gemini.png",
};

export function PreviewKeywords() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Keywords</h2>
          <p className="text-muted-foreground">Track how AI platforms mention your brand for key queries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Queries
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Keyword
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search keywords..."
            className="h-9 w-[250px] lg:w-[350px] pl-9 bg-background"
            readOnly
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
          All Platforms
        </Button>
        <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
          All Status
        </Button>
        <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
          Score
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12 pl-4">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[200px]">Keyword</TableHead>
              <TableHead className="w-[100px]">Platforms</TableHead>
              <TableHead className="w-[160px]">Score</TableHead>
              <TableHead className="w-[120px]">Trend</TableHead>
              <TableHead className="w-[80px]">Mentions</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[70px]">Auto</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((k) => {
              const st = statusConfig[k.status];
              const StatusIcon = st.icon;
              return (
                <TableRow key={k.id}>
                  <TableCell className="pl-4">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{k.keyword}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {k.platforms.map((p) => (
                        platformImages[p] && (
                          <img key={p} src={platformImages[p]} alt={p} width={20} height={20} className="rounded-sm object-contain shrink-0 dark:invert" />
                        )
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Score: {k.score}</span>
                      <Progress value={k.score} className="w-12 h-1 bg-muted" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-bold px-1.5 py-0 h-5 border-border/50 cursor-default",
                        k.trend === "up" ? "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50" :
                        k.trend === "down" ? "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50" :
                        "text-muted-foreground"
                      )}
                    >
                      {k.trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                      {k.trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                      {k.trend === "stable" && <Minus className="mr-1 h-3 w-3" />}
                      {k.visibility > 0 ? "+" : ""}{k.visibility}%
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-sm text-muted-foreground">{k.mentions}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn("text-[11px] font-medium h-6 px-2 gap-1.5", st.className)}>
                      <StatusIcon className="h-3 w-3" />
                      {st.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={k.auto} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of <span className="font-medium">24</span> keywords
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
