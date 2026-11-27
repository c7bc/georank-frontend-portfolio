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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getKeywordMentions } from "@/app/actions/mentions";
import { MentionDetailSheet } from "@/components/mentions/mention-detail-sheet";
import { platformIcons } from "@/lib/constants";
import type { Platform } from "@/types";

interface KeywordMentionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keywordId: number | null;
  keyword: string;
}

interface MentionItem {
  id: number;
  keyword_id: number;
  platform: string;
  query: string;
  result: string;
  position?: number | null;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function KeywordMentionsSheet({
  open,
  onOpenChange,
  keywordId,
  keyword,
}: KeywordMentionsSheetProps) {
  const t = useTranslations("mentions");
  const [mentions, setMentions] = useState<MentionItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedMention, setSelectedMention] = useState<MentionItem | null>(null);

  useEffect(() => {
    if (!open || !keywordId) return;
    let active = true;
    startTransition(async () => {
      const res = await getKeywordMentions(keywordId);
      if (active) setMentions(res.data || []);
    });
    return () => { active = false; };
  }, [open, keywordId]);

  const handleViewDetail = (mention: MentionItem) => {
    setSelectedMention(mention);
  };

  return (
    <>
      <Sheet open={open && !selectedMention} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto border-l border-border bg-background p-0">
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 pt-6 pb-4">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-base font-semibold">
                {t("queriesTitle")}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">{keyword}</p>
            </SheetHeader>
          </div>

          <div className="px-6 py-4">
            {isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : mentions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">{t("noQueries")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground">{t("platform")}</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">{t("result")}</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">{t("date")}</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentions.map((mention) => {
                    const isMentioned = mention.result === "mentioned";
                    return (
                      <TableRow
                        key={mention.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewDetail(mention)}
                      >
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {platformIcons[mention.platform as keyof typeof platformIcons] || mention.platform}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            {isMentioned ? (
                              <Badge variant="outline" className="text-muted-foreground px-1.5 h-6 gap-1.5 font-medium border-border/50">
                                <Check className="h-3 w-3 text-green-500 dark:text-green-400" />
                                <span className="text-[11px] tabular-nums">#{mention.position}</span>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground px-1.5 h-6 gap-1.5 font-medium border-border/50">
                                <X className="h-3 w-3 text-red-500 dark:text-red-400 opacity-70" />
                                <span className="text-[11px]">{t("notMentioned")}</span>
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(mention.created_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Level 2: AI Analysis Details */}
      <MentionDetailSheet
        open={!!selectedMention}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedMention(null);
        }}
        mentionId={selectedMention?.id ?? null}
        keyword={keyword}
        platform={(selectedMention?.platform ?? "gemini") as Platform}
        result={selectedMention?.result ?? ""}
        position={selectedMention?.position ?? null}
        time={selectedMention ? timeAgo(selectedMention.created_at) : ""}
      />
    </>
  );
}
