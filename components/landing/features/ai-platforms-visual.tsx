"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheckBig, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const platformColors: Record<string, { bg: string; text: string; badge: string; logo: string }> = {
  ChatGPT: {
    bg: "bg-green-500",
    text: "text-white",
    badge: "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ_jfzEhFaMwtNeD7wy1B78Yf7LVgqvD4xg&s",
  },
  Claude: {
    bg: "bg-amber-500",
    text: "text-white",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    logo: "https://cdn-1.webcatalog.io/catalog/claude/claude-icon-filled-256.webp?v=1769992737946",
  },
  Perplexity: {
    bg: "bg-blue-500",
    text: "text-white",
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLbKqia9h-6FPu4yhtOmldu5R33c1cC53hHA&s",
  },
  Gemini: {
    bg: "bg-purple-500",
    text: "text-white",
    badge: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    logo: "https://static.vecteezy.com/system/resources/previews/055/687/055/non_2x/rectangle-gemini-google-icon-symbol-logo-free-png.png",
  },
};

const mentions = [
  { platform: "ChatGPT", query: "Best SEO tools 2025", result: "mentioned", position: 2, sentiment: "positive", time: "2m ago" },
  { platform: "Claude", query: "Top brand monitoring", result: "mentioned", position: 1, sentiment: "positive", time: "5m ago" },
  { platform: "Perplexity", query: "AI visibility tools", result: "not_mentioned", position: null, sentiment: "neutral", time: "8m ago" },
  { platform: "Gemini", query: "GEO optimization", result: "mentioned", position: 5, sentiment: "negative", time: "12m ago" },
  { platform: "ChatGPT", query: "Project management AI", result: "mentioned", position: 3, sentiment: "positive", time: "15m ago" },
  { platform: "Claude", query: "Best analytics platforms", result: "not_mentioned", position: null, sentiment: "neutral", time: "18m ago" },
  { platform: "Perplexity", query: "Marketing automation", result: "mentioned", position: 4, sentiment: "positive", time: "22m ago" },
];

export function AiPlatformsVisual() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,black_50%)]">
      <div className="overflow-hidden rounded-lg border bg-card/30 h-full">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground">Platform</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Query</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Result</TableHead>
              <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Sentiment</TableHead>
              <TableHead className="h-9 text-xs font-semibold px-4 text-right text-muted-foreground">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentions.map((mention, i) => {
              const colors = platformColors[mention.platform];
              return (
                <TableRow key={`${mention.query}-${i}`} className="hover:bg-muted/40 transition-colors border-b last:border-0 h-10">
                  <TableCell className="px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={colors.logo} alt={mention.platform} />
                        <AvatarFallback className={cn("text-[7px] font-bold", colors.bg, colors.text)}>
                          {mention.platform.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className={cn("text-[10px] py-0 h-5 px-1.5 font-medium", colors.badge)}>
                        {mention.platform}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate font-medium text-sm py-2">
                    {mention.query}
                  </TableCell>
                  <TableCell className="py-2">
                    {mention.result === "mentioned" ? (
                      <Badge variant="outline" className="text-muted-foreground px-1.5 h-6 gap-1.5 font-medium border-border/50">
                        <CircleCheckBig className="size-3 text-green-500 dark:text-green-400" />
                        <span className="text-[11px] tabular-nums">#{mention.position}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground px-1.5 h-6 gap-1.5 font-medium border-border/50">
                        <XCircle className="size-3 text-red-500 dark:text-red-400 opacity-70" />
                        <span className="text-[11px]">Not found</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-medium h-5 px-1.5",
                        mention.sentiment === "positive" && "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400",
                        mention.sentiment === "negative" && "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400",
                        mention.sentiment === "neutral" && "border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground"
                      )}
                    >
                      {mention.sentiment === "positive" && "Positive"}
                      {mention.sentiment === "negative" && "Negative"}
                      {mention.sentiment === "neutral" && "Neutral"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs px-4 text-right tabular-nums py-2">
                    {mention.time}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
