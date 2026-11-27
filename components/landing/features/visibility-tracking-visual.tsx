"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function VisibilityTrackingVisual() {
  const topKeywords = [
    {
      rank: 1,
      keyword: "best ai seo tools 2025",
      platform: "chatgpt",
      volume: "12.5k",
      difficulty: "Hard",
      change: "+12%",
      trend: "up",
    },
    {
      rank: 2,
      keyword: "brand visibility tracking",
      platform: "claude",
      volume: "8.2k",
      difficulty: "Medium",
      change: "+5%",
      trend: "up",
    },
    {
      rank: 3,
      keyword: "generative engine optimization",
      platform: "perplexity",
      volume: "5.4k",
      difficulty: "High",
      change: "-2%",
      trend: "down",
    },
    {
      rank: 4,
      keyword: "ai search monitoring",
      platform: "gemini",
      volume: "3.1k",
      difficulty: "Medium",
      change: "0%",
      trend: "stable",
    },
    {
      rank: 5,
      keyword: "georank alternatives",
      platform: "deepseek",
      volume: "1.2k",
      difficulty: "Low",
      change: "+28%",
      trend: "up",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div 
        data-slot="card" 
        className="ring-foreground/10 text-card-foreground gap-6 overflow-hidden rounded-xl py-6 text-sm shadow-xs ring-1 group/card flex flex-col w-full max-w-md [mask-image:linear-gradient(to_top,transparent_0%,black_40%)]"
      >
        <div 
          data-slot="card-header" 
          className="gap-1 px-6 pb-6 border-b border-border/50 grid auto-rows-min items-start relative"
        >
          <div data-slot="card-title" className="text-base leading-normal font-medium text-foreground">
            Top Performing Keywords
          </div>
          <div data-slot="card-description" className="text-muted-foreground text-sm">
            Highest visibility impact this month
          </div>
          <Image 
            src="/favicon.svg" 
            alt="GeoRank" 
            width={48} 
            height={48} 
            className="absolute right-6 top-0 rounded-md"
          />
        </div>
        
        <div data-slot="card-content" className="px-6 pt-6 space-y-6">
          {topKeywords.map((item) => (
            <div key={item.rank} className="flex items-center gap-4">
              <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                {item.rank}
              </span>
              
              <span 
                data-slot="avatar" 
                className="relative flex shrink-0 overflow-hidden rounded-full size-10 border border-border bg-muted/30 p-1.5"
              >
                <Image 
                  src={`/platforms/${
                    item.platform === "claude" ? "claude.webp" : item.platform + ".png"
                  }`}
                  alt={item.platform}
                  width={32}
                  height={32}
                  className="dark:brightness-0 dark:invert"
                />
              </span>
              
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.keyword}
                </p>
                <p className="truncate text-xs text-muted-foreground flex items-center gap-2">
                  <span>{item.volume} vol</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className={cn(
                    "font-medium",
                    item.difficulty === "Hard" || item.difficulty === "High" ? "text-orange-500" :
                    item.difficulty === "Medium" ? "text-yellow-500" : "text-green-500"
                  )}>{item.difficulty}</span>
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {item.change}
                </span>
                <span className={cn(
                  "text-[10px] flex items-center gap-0.5",
                  item.trend === "up" ? "text-green-500" :
                  item.trend === "down" ? "text-red-500" : "text-muted-foreground"
                )}>
                  {item.trend === "up" && <TrendingUp className="size-3" />}
                  {item.trend === "down" && <TrendingDown className="size-3" />}
                  {item.trend === "stable" && <Minus className="size-3" />}
                  {item.trend === "up" ? "Gain" : item.trend === "down" ? "Loss" : "Stable"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
