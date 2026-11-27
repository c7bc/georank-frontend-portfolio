"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Search, FileText, Lightbulb, Clock, ArrowRight } from "lucide-react";
import { platformLabels } from "@/lib/constants";
import { updateReportScheduling, updateRecommendationScheduling } from "@/app/actions/scheduling";
import { updateKeyword } from "@/app/actions/keywords";
import type { SchedulingResponse, KeywordResponse } from "@/types";

interface SchedulingClientProps {
  scheduling: SchedulingResponse;
  keywords: KeywordResponse[];
}

function formatNextRun(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "< 1 hour";
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "tomorrow";
  return `in ${diffDays} days`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function SchedulingClient({ scheduling: initial, keywords: initialKeywords }: SchedulingClientProps) {
  const t = useTranslations("scheduling");
  const [scheduling, setScheduling] = useState(initial);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [isPending, startTransition] = useTransition();

  const handleReportToggle = (field: "auto_generate" | "send_email", value: boolean) => {
    setScheduling((prev) => ({
      ...prev,
      reports: { ...prev.reports, [field]: value },
    }));

    startTransition(async () => {
      const result = await updateReportScheduling({ [field]: value });
      if (result.success && result.scheduling) {
        setScheduling(result.scheduling);
      } else {
        setScheduling(initial);
      }
    });
  };

  const allowedPlatforms = scheduling.keywords.allowed_platforms ?? [];

  const handleKeywordPlatformToggle = (keywordId: number, platform: string, checked: boolean) => {
    const kw = keywords.find((k) => k.id === keywordId);
    if (!checked && kw && (kw.platforms || []).filter((p) => p !== platform).length === 0) return;

    setKeywords((prev) =>
      prev.map((k) => {
        if (k.id !== keywordId) return k;
        const platforms = checked
          ? [...(k.platforms || []), platform]
          : (k.platforms || []).filter((p) => p !== platform);
        return { ...k, platforms };
      })
    );

    startTransition(async () => {
      if (!kw) return;
      const platforms = checked
        ? [...(kw.platforms || []), platform]
        : (kw.platforms || []).filter((p) => p !== platform);
      const result = await updateKeyword(keywordId, { platforms });
      if (result.success && result.keyword) {
        setKeywords((prev) =>
          prev.map((k) => (k.id === keywordId ? { ...k, platforms: result.keyword!.platforms } : k))
        );
      } else if (!result.success) {
        setKeywords((prev) =>
          prev.map((k) => (k.id === keywordId ? { ...k, platforms: kw.platforms } : k))
        );
      }
    });
  };

  const handleKeywordAutoQuery = (keywordId: number, checked: boolean) => {
    setKeywords((prev) =>
      prev.map((kw) => (kw.id === keywordId ? { ...kw, auto_query: checked } : kw))
    );

    startTransition(async () => {
      const result = await updateKeyword(keywordId, { auto_query: checked });
      if (result.success && result.keyword) {
        setKeywords((prev) =>
          prev.map((kw) => (kw.id === keywordId ? { ...kw, auto_query: result.keyword!.auto_query } : kw))
        );
      } else if (!result.success) {
        setKeywords((prev) =>
          prev.map((kw) => (kw.id === keywordId ? { ...kw, auto_query: !checked } : kw))
        );
      }
    });
  };

  const autoQueryCount = keywords.filter((kw) => kw.auto_query !== false).length;
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const KEYWORDS_LIMIT = 5;
  const visibleKeywords = showAllKeywords ? keywords : keywords.slice(0, KEYWORDS_LIMIT);
  const hasMore = keywords.length > KEYWORDS_LIMIT;

  const handleRecommendationToggle = (value: boolean) => {
    setScheduling((prev) => ({
      ...prev,
      recommendations: { ...prev.recommendations, auto_generate: value },
    }));

    startTransition(async () => {
      const result = await updateRecommendationScheduling({ auto_generate: value });
      if (result.success && result.scheduling) {
        setScheduling(result.scheduling);
      } else {
        setScheduling(initial);
      }
    });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Keyword Queries */}
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("keywords.title")}</CardTitle>
                <CardDescription>{scheduling.keywords.cron_description}</CardDescription>
              </div>
            </div>
            <CardAction>
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                {capitalizeFirst(scheduling.keywords.frequency)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t("nextRun")}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatNextRun(scheduling.keywords.next_run_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{t("lastQueried")}</div>
                    <div className="text-sm text-muted-foreground">
                      {scheduling.keywords.last_queried_at ? formatDate(scheduling.keywords.last_queried_at) : t("neverRun")}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Queries</span>
                  <span className="font-mono text-xs">
                    {scheduling.keywords.used}/{scheduling.keywords.limit}
                  </span>
                </div>
                <Progress value={scheduling.keywords.limit > 0 ? (scheduling.keywords.used / scheduling.keywords.limit) * 100 : 0} />
              </div>

              {keywords.length > 0 && (
                <>
                  <Separator />
                  <div className="rounded-lg border border-border/50">
                    <div className="divide-y divide-border/50">
                      {visibleKeywords.map((kw) => (
                        <div key={kw.id} className="px-3 py-2 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm truncate mr-3">{kw.keyword}</span>
                            <Switch
                              checked={kw.auto_query !== false}
                              onCheckedChange={(checked) => handleKeywordAutoQuery(kw.id, checked)}
                              disabled={isPending}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {allowedPlatforms.map((platform) => {
                              const active = kw.platforms?.includes(platform);
                              const isLastActive = active && (kw.platforms || []).length === 1;
                              return (
                                <button
                                  key={platform}
                                  type="button"
                                  onClick={() => handleKeywordPlatformToggle(kw.id, platform, !active)}
                                  disabled={isPending || isLastActive}
                                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs transition-colors ${
                                    active
                                      ? isLastActive
                                        ? "border-primary/50 bg-primary/10 text-primary opacity-60 cursor-not-allowed"
                                        : "border-primary/50 bg-primary/10 text-primary"
                                      : "border-border bg-transparent text-muted-foreground hover:border-primary/30"
                                  }`}
                                >
                                  {platformLabels[platform] || platform}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {hasMore && (
                      <button
                        type="button"
                        className="w-full border-t border-border/50 px-3 py-2 text-xs text-primary hover:bg-muted/50 transition-colors"
                        onClick={() => setShowAllKeywords((prev) => !prev)}
                      >
                        {showAllKeywords
                          ? t("keywords.showLess")
                          : t("keywords.showMore", { count: keywords.length - KEYWORDS_LIMIT })}
                      </button>
                    )}
                    <div className="flex items-center justify-between border-t border-border/50 px-3 py-2">
                      <span className="text-xs text-muted-foreground">
                        {t("keywords.autoQueryCount", {
                          count: autoQueryCount,
                          total: keywords.length,
                        })}
                      </span>
                      <Link
                        href="/keywords"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {t("keywords.manageKeywords")}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {keywords.length === 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      {t("keywords.autoQueryCount", {
                        count: 0,
                        total: 0,
                      })}
                    </span>
                    <Link
                      href="/keywords"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {t("keywords.manageKeywords")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("reports.title")}</CardTitle>
                <CardDescription>{scheduling.reports.cron_description}</CardDescription>
              </div>
            </div>
            <CardAction>
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                {capitalizeFirst(scheduling.reports.frequency)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t("reports.autoGenerate")}</div>
                  <div className="text-sm text-muted-foreground">Automatically generate reports on schedule</div>
                </div>
                <Switch
                  checked={scheduling.reports.auto_generate}
                  onCheckedChange={(checked) => handleReportToggle("auto_generate", checked)}
                  disabled={isPending}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t("reports.sendEmail")}</div>
                  <div className="text-sm text-muted-foreground">Send reports via email when ready</div>
                </div>
                <Switch
                  checked={scheduling.reports.send_email}
                  onCheckedChange={(checked) => handleReportToggle("send_email", checked)}
                  disabled={isPending}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t("nextRun")}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {scheduling.reports.auto_generate
                      ? formatNextRun(scheduling.reports.next_run_at)
                      : t("autoOff")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{t("lastGenerated")}</div>
                  <div className="text-sm text-muted-foreground">
                    {scheduling.reports.last_generated_at ? formatDate(scheduling.reports.last_generated_at) : t("neverRun")}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Reports</span>
                  <span className="font-mono text-xs">
                    {scheduling.reports.used}/{scheduling.reports.limit}
                  </span>
                </div>
                <Progress value={scheduling.reports.limit > 0 ? (scheduling.reports.used / scheduling.reports.limit) * 100 : 0} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("recommendations.title")}</CardTitle>
                {scheduling.recommendations.enabled && (
                  <CardDescription>{scheduling.recommendations.cron_description}</CardDescription>
                )}
              </div>
            </div>
            <CardAction>
              <Badge variant="outline" className={scheduling.recommendations.enabled
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400"
              }>
                {scheduling.recommendations.enabled
                  ? capitalizeFirst(scheduling.recommendations.frequency)
                  : t("recommendations.disabled")}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {scheduling.recommendations.enabled ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t("recommendations.autoGenerate")}</div>
                    <div className="text-sm text-muted-foreground">Automatically generate recommendations</div>
                  </div>
                  <Switch
                    checked={scheduling.recommendations.auto_generate}
                    onCheckedChange={handleRecommendationToggle}
                    disabled={isPending}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t("nextRun")}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {scheduling.recommendations.auto_generate
                        ? formatNextRun(scheduling.recommendations.next_run_at)
                        : t("autoOff")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{t("lastGenerated")}</div>
                    <div className="text-sm text-muted-foreground">
                      {scheduling.recommendations.last_generated_at ? formatDate(scheduling.recommendations.last_generated_at) : t("neverRun")}
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Recommendations</span>
                    <span className="font-mono text-xs">
                      {scheduling.recommendations.used}/{scheduling.recommendations.limit}
                    </span>
                  </div>
                  <Progress value={scheduling.recommendations.limit > 0 ? (scheduling.recommendations.used / scheduling.recommendations.limit) * 100 : 0} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Lightbulb className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 font-medium text-muted-foreground">{t("recommendations.disabled")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
