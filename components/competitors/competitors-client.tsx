"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Plus, TrendingUp, TrendingDown, Minus, FileText, Link, MessageCircle, Trash2, Loader2, Users, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { createCompetitor, deleteCompetitor } from "@/app/actions/competitors";
import { cn } from "@/lib/utils";
import type { CompetitorResponse } from "@/types";

interface CompetitorsClientProps {
  initialCompetitors: CompetitorResponse[];
  userGeoScore: number;
}

interface RadarDataPoint {
  axis: string;
  yourBrand: number;
  competitor: number;
}

interface Insight {
  id: string;
  icon: "FileText" | "Link" | "MessageCircle";
  title: string;
  description: string;
  action: string;
}

const chartConfig = {
  yourBrand: {
    label: "Your Brand",
    color: "var(--chart-1)",
  },
  competitor: {
    label: "Competitor",
    color: "var(--chart-2)",
  },
};

// Generate radar data based on competitor analysis
function generateRadarData(userScore: number, competitorScore: number): RadarDataPoint[] {
  const userMultiplier = userScore / 100;
  const compMultiplier = competitorScore / 100;

  return [
    { axis: "ChatGPT", yourBrand: Math.round(75 * userMultiplier), competitor: Math.round(90 * compMultiplier) },
    { axis: "Claude", yourBrand: Math.round(80 * userMultiplier), competitor: Math.round(85 * compMultiplier) },
    { axis: "Perplexity", yourBrand: Math.round(65 * userMultiplier), competitor: Math.round(88 * compMultiplier) },
    { axis: "Gemini", yourBrand: Math.round(70 * userMultiplier), competitor: Math.round(92 * compMultiplier) },
    { axis: "Content Depth", yourBrand: Math.round(72 * userMultiplier), competitor: Math.round(95 * compMultiplier) },
    { axis: "Source Authority", yourBrand: Math.round(68 * userMultiplier), competitor: Math.round(85 * compMultiplier) },
  ];
}

export function CompetitorsClient({ initialCompetitors, userGeoScore }: CompetitorsClientProps) {
  const t = useTranslations("competitors");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCompetitor, setSelectedCompetitor] = useState<string>(
    initialCompetitors[0]?.name || ""
  );

  const selectedCompetitorData = initialCompetitors.find(c => c.name === selectedCompetitor);
  const radarData = generateRadarData(
    userGeoScore,
    selectedCompetitorData?.geo_score || 0
  );

  const icons = { FileText, Link, MessageCircle };

  // Generate insights based on selected competitor
  const hasAnalysisData = selectedCompetitorData && (userGeoScore > 0 || selectedCompetitorData.geo_score > 0);
  const insights: Insight[] = hasAnalysisData ? [
    {
      id: "1",
      icon: "FileText",
      title: "More comprehensive content",
      description: selectedCompetitorData.geo_score > userGeoScore
        ? `${selectedCompetitor} has a higher geo score. Consider expanding your content coverage in areas where they rank higher.`
        : `You have a higher geo score. Continue optimizing your content to maintain this advantage.`,
      action: "View content gaps",
    },
    {
      id: "2",
      icon: "Link",
      title: "Stronger source presence",
      description: `${selectedCompetitor} is mentioned in ${selectedCompetitorData.mentions} sources. Focus on building more authoritative backlinks.`,
      action: "View source opportunities",
    },
    {
      id: "3",
      icon: "MessageCircle",
      title: "Platform coverage",
      description: `Compare your visibility across different AI platforms against ${selectedCompetitor} to identify opportunities.`,
      action: "View platform analysis",
    },
  ] : [];

  const handleAddCompetitor = async () => {
    if (!newDomain.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createCompetitor({ domain: newDomain });

    setIsSubmitting(false);

    if (result.success) {
      setIsAddOpen(false);
      setNewDomain("");
      startTransition(() => {
        router.refresh();
      });
    } else {
      setError(result.error || "Failed to add competitor");
    }
  };

  const handleDeleteCompetitor = async () => {
    if (!deleteId) return;

    setIsSubmitting(true);

    const result = await deleteCompetitor(deleteId);

    setIsSubmitting(false);

    if (result.success) {
      setDeleteId(null);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {initialCompetitors.length}/2 {t("usage")}
          </Badge>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-xs" disabled={initialCompetitors.length >= 2}>
              <Plus className="h-4 w-4" />
              {t("addCompetitor")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("addModal.title")}</DialogTitle>
              <DialogDescription>
                Add a competitor domain to track and compare their AI visibility.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="domain">{t("addModal.label")}</Label>
                <Input
                  id="domain"
                  placeholder={t("addModal.placeholder")}
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="bg-background"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  {t("addModal.helper")}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                {t("addModal.cancel")}
              </Button>
              <Button onClick={handleAddCompetitor} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  t("addModal.add")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Empty State */}
      {initialCompetitors.length === 0 && (
        <Card className="border-dashed shadow-xs border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
               <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t("empty.title")}</h3>
            <p className="text-muted-foreground mt-2 max-w-md text-sm">{t("empty.description")}</p>
          </CardContent>
        </Card>
      )}

      {/* Competitor Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initialCompetitors.map((competitor, index) => (
          <motion.div
            key={competitor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={isPending ? "opacity-50" : ""}
          >
            <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">{competitor.name}</CardTitle>
                <CardDescription>{competitor.domain}</CardDescription>
                <CardAction>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-mono">{competitor.geo_score}</p>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {competitor.comparison === "ahead" ? (
                    <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400">
                      {competitor.difference} {t("pointsAhead")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400">
                      {competitor.difference} {t("pointsBehind")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Badge
                    variant="outline"
                    className="font-medium px-1.5 py-0 h-5 border-border/50 text-muted-foreground gap-1"
                  >
                     {competitor.trend_type === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                     {competitor.trend_type === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                     {competitor.trend_type === "stable" && <Minus className="h-3 w-3" />}
                     <span className={cn(
                        competitor.trend > 0 ? "text-green-600 dark:text-green-400" :
                        competitor.trend < 0 ? "text-red-600 dark:text-red-400" :
                        ""
                     )}>
                       {competitor.trend > 0 ? "+" : ""}
                       {competitor.trend} {t("thisWeek")}
                     </span>
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {competitor.keywords_ranking} {t("keywordsRanking")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    {competitor.mentions} {t("mentions")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setSelectedCompetitor(competitor.name);
                    document.getElementById("head-to-head")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    {t("viewAnalysis")} →
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(competitor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Head-to-Head Comparison */}
      {initialCompetitors.length > 0 && (
        <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs" id="head-to-head">
          <CardHeader>
            <CardTitle>{t("headToHead.title")}</CardTitle>
            <CardDescription>{t("headToHead.subtitle")}</CardDescription>
            <CardAction>
              <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("headToHead.compareWith")} />
                </SelectTrigger>
                <SelectContent>
                  {initialCompetitors.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer id="competitors-radar-chart" config={chartConfig} className="mx-auto h-[300px] w-full max-w-lg">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar
                    name="Your Brand"
                    dataKey="yourBrand"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={selectedCompetitor}
                    dataKey="competitor"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {t("insights.title", { competitor: selectedCompetitor })}
          </h3>
          <p className="text-sm text-muted-foreground">{t("insights.subtitle")}</p>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs mt-4 grid gap-4 md:grid-cols-3">
            {insights.map((insight) => {
              const Icon = icons[insight.icon];
              return (
                <Card key={insight.id} className="@container/card transition-all hover:bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="mt-4 font-semibold text-sm">{insight.title}</h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                    <Button variant="link" className="mt-2 h-auto p-0 text-primary text-xs">
                      {insight.action} →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Competitor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this competitor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompetitor}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
