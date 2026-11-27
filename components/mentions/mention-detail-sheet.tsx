"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Target, ExternalLink, Check, X } from "lucide-react";
import { getMentionRecommendations } from "@/app/actions/mentions";
import { platformIcons } from "@/lib/constants";
import type { AIRecommendation, Platform } from "@/types";

interface MentionDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentionId: number | null;
  keyword: string;
  platform: Platform;
  result: string;
  position: number | null;
  time: string;
}

export function MentionDetailSheet({
  open,
  onOpenChange,
  mentionId,
  keyword,
  platform,
  result,
  position,
  time,
}: MentionDetailSheetProps) {
  const t = useTranslations("mentions");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !mentionId) return;

    startTransition(async () => {
      const res = await getMentionRecommendations(mentionId);
      setRecommendations(res.data || []);
    });
  }, [open, mentionId]);

  const totalRecs = recommendations.length;
  const isMentioned = result === "mentioned";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l border-border bg-background p-0">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 pt-6 pb-4">
          <SheetHeader className="space-y-0">
            <SheetTitle className="text-base font-semibold">
              {t("detailTitle")}
            </SheetTitle>
          </SheetHeader>

          {/* Mention context */}
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs shrink-0">
              {platformIcons[platform]}
            </Badge>
            <span className="text-sm text-muted-foreground truncate">{keyword}</span>
            <span className="text-xs text-muted-foreground ml-auto shrink-0">{time}</span>
          </div>

          {/* Status badge */}
          {!isPending && totalRecs > 0 && (
            <div className="mt-3">
              {isMentioned ? (
                <div className="flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/20 px-3 py-2">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" />
                  <span className="text-sm font-medium text-green-500 dark:text-green-400">
                    {t("ranked", { position: String(position), total: String(totalRecs) })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md bg-muted/50 border border-border px-3 py-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {t("notRanked", { total: String(totalRecs) })}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommendations list */}
        <div className="px-6 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("recommendations")}
          </h3>

          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">{t("noData")}</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`group relative rounded-lg border px-3 py-2.5 transition-colors ${
                    rec.is_target
                      ? "border-green-500/30 bg-green-500/5 dark:border-green-800/60 dark:bg-green-950/20"
                      : "border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Position */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        rec.position === 1
                          ? "bg-amber-100/50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                          : rec.is_target
                            ? "bg-green-100/50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rec.position === 1 ? (
                        <Crown className="h-3.5 w-3.5" />
                      ) : (
                        `#${rec.position}`
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm leading-tight">{rec.name}</span>
                        {rec.is_target && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-[10px] px-1 py-0 leading-tight"
                          >
                            <Target className="h-2.5 w-2.5 mr-0.5" />
                            {t("targetDomain")}
                          </Badge>
                        )}
                      </div>

                      {rec.domain && (
                        <a
                          href={`https://${rec.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5"
                        >
                          {rec.domain}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}

                      <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
