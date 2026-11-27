"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Link,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  LucideIcon,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateRecommendationStatus, generateRecommendations } from "@/app/actions/recommendations";
import type {
  RecommendationResponse,
  RecommendationStatus,
  RecommendationCategory,
  Priority,
} from "@/types";

interface RecommendationsClientProps {
  initialRecommendations: RecommendationResponse[];
}

const priorityColors: Record<Priority, string> = {
  high: "badge-error",
  medium: "badge-warning",
  low: "badge-success",
};

const categoryIcons: Record<RecommendationCategory, LucideIcon> = {
  content: FileText,
  authority: Link,
  faq: MessageCircle,
  technical: TrendingUp,
};

export function RecommendationsClient({
  initialRecommendations,
}: RecommendationsClientProps) {
  const t = useTranslations("recommendations");
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const completedCount = recommendations.filter(
    (r) => r.status === "completed"
  ).length;
  const totalCount = recommendations.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Calculate potential impact from remaining recommendations
  const potentialImpact = recommendations
    .filter((r) => r.status !== "completed")
    .reduce((acc, r) => {
      // Parse impact string like "Could improve GEO Score by 8-12 points"
      const match = r.impact.match(/(\d+)-?(\d+)?/);
      if (match) {
        const min = parseInt(match[1], 10);
        const max = match[2] ? parseInt(match[2], 10) : min;
        return { min: acc.min + min, max: acc.max + max };
      }
      return acc;
    }, { min: 0, max: 0 });

  const handleStatusUpdate = async (
    id: number,
    newStatus: RecommendationStatus
  ) => {
    setLoadingId(id);
    startTransition(async () => {
      const result = await updateRecommendationStatus(id, newStatus);
      if (result.success && result.recommendation) {
        setRecommendations((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: result.recommendation!.status } : r
          )
        );
      }
      setLoadingId(null);
    });
  };

  const getNextStatus = (
    currentStatus: RecommendationStatus
  ): RecommendationStatus => {
    switch (currentStatus) {
      case "pending":
        return "in_progress";
      case "in_progress":
        return "completed";
      default:
        return currentStatus;
    }
  };

  const getButtonLabel = (status: RecommendationStatus): string => {
    switch (status) {
      case "pending":
        return t("actions.start");
      case "in_progress":
        return t("actions.markComplete");
      default:
        return "";
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    const result = await generateRecommendations();
    setIsGenerating(false);
    if (!result.success) {
      setGenerateError(result.error || "Failed to generate recommendations");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {t("generate")}
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{t("potentialImpact")}</p>
            <p className="text-2xl font-bold text-gradient">
              {potentialImpact.min > 0
                ? `+${potentialImpact.min}-${potentialImpact.max} pts`
                : t("allComplete")}
            </p>
          </div>
        </div>
      </div>

      {generateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generateError}</AlertDescription>
        </Alert>
      )}

      {/* Progress Overview */}
      <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("progress.title")}
              </p>
              <p className="text-2xl font-bold">
                {completedCount} {t("progress.of")} {totalCount}
              </p>
            </div>
            <Progress value={progressPercent} className="w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4" data-testid="recommendations-list">
        {recommendations.map((rec) => {
          const Icon = categoryIcons[rec.category] || Lightbulb;
          const isLoading = loadingId === rec.id && isPending;

          return (
            <Card
              key={rec.id}
              className={cn(
                "from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs",
                rec.status === "completed" && "opacity-60"
              )}
              data-testid={`recommendation-${rec.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={priorityColors[rec.priority]}
                      >
                        {rec.priority.charAt(0).toUpperCase() +
                          rec.priority.slice(1)}
                      </Badge>
                      <Badge variant="secondary">
                        {rec.category.charAt(0).toUpperCase() +
                          rec.category.slice(1)}
                      </Badge>
                      {rec.status === "completed" && (
                        <Badge className="badge-success">{t("status.completed")}</Badge>
                      )}
                      {rec.status === "in_progress" && (
                        <Badge className="badge-warning">{t("status.inProgress")}</Badge>
                      )}
                    </div>
                    <h3 className="mt-2 font-semibold">{rec.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                    <p className="mt-2 text-sm text-accent-emerald">
                      {rec.impact}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {rec.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-accent-emerald" />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusUpdate(rec.id, getNextStatus(rec.status))
                        }
                        data-testid="recommendation-status-toggle"
                      >
                        {isLoading ? t("actions.updating") : getButtonLabel(rec.status)}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <Card className="border-dashed shadow-xs border-border/50">
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lightbulb className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t("empty.title")}</h3>
            <p className="mt-2 text-muted-foreground">{t("empty.description")}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
