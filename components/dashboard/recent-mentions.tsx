"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheckBig, XCircle, MessageSquare, ArrowRight, Loader } from "lucide-react";
import { platformIcons } from "@/lib/constants";
import { MentionDetailSheet } from "@/components/mentions/mention-detail-sheet";
import type { Platform } from "@/types";

interface Mention {
  id: string | number;
  platform: "chatgpt" | "claude" | "perplexity" | "gemini";
  query: string;
  result: string;
  position: number | null;
  time: string;
}

interface RecentMentionsProps {
  data?: Mention[];
}

export function RecentMentions({ data = [] }: RecentMentionsProps) {
  const t = useTranslations("dashboard.recentMentions");

  const [selectedMention, setSelectedMention] = useState<Mention | null>(null);

  return (
    <>
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
                <TableHead className="h-9 text-xs font-semibold px-4 text-muted-foreground">Platform</TableHead>
                <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Query</TableHead>
                <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Result</TableHead>
                <TableHead className="h-9 text-xs font-semibold px-4 text-right text-muted-foreground">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="font-medium text-sm">{t("emptyTitle")}</p>
                    <p className="text-xs">{t("emptyDescription")}</p>
                  </TableCell>
                </TableRow>
              )}
              {data.map((mention) => (
                <TableRow
                  key={mention.id}
                  className="cursor-pointer hover:bg-muted/40 transition-colors border-b last:border-0 h-12"
                  onClick={() => setSelectedMention(mention)}
                >
                  <TableCell className="px-4">
                    <Badge variant="outline" className="font-mono text-[10px] bg-background/50 text-muted-foreground py-0 h-5 px-1.5">
                      {platformIcons[mention.platform]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate font-medium text-sm py-2">
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
                        <span className="text-[11px]">{t("notMentioned")}</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs px-4 text-right tabular-nums py-2">
                    {mention.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <MentionDetailSheet
        open={!!selectedMention}
        onOpenChange={(open) => !open && setSelectedMention(null)}
        mentionId={selectedMention ? Number(selectedMention.id) : null}
        keyword={selectedMention?.query || ""}
        platform={(selectedMention?.platform || "gemini") as Platform}
        result={selectedMention?.result || ""}
        position={selectedMention?.position || null}
        time={selectedMention?.time || ""}
      />
    </>
  );
}
