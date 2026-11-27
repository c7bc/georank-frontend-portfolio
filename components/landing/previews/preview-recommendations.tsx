"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Link,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const recommendations = [
  {
    id: 1,
    priority: "high",
    category: "content",
    icon: FileText,
    title: "Add structured data to product pages",
    description: "AI models prioritize structured content. Adding schema markup will improve your visibility in AI-generated responses.",
    impact: "Could improve GEO Score by 8-12 points",
    status: "pending",
  },
  {
    id: 2,
    priority: "high",
    category: "authority",
    icon: Link,
    title: "Build citations on high-authority sources",
    description: "Competitor A has 3x more citations from authoritative domains. Target industry publications and review sites.",
    impact: "Could improve GEO Score by 5-8 points",
    status: "in_progress",
  },
  {
    id: 3,
    priority: "medium",
    category: "faq",
    icon: MessageCircle,
    title: "Create FAQ content for common queries",
    description: "AI platforms frequently cite FAQ-style content. Create comprehensive answers for your top 10 tracked keywords.",
    impact: "Could improve GEO Score by 3-5 points",
    status: "pending",
  },
  {
    id: 4,
    priority: "low",
    category: "technical",
    icon: TrendingUp,
    title: "Optimize meta descriptions for AI crawlers",
    description: "Updated descriptions should include key terms that AI models associate with your brand category.",
    impact: "Could improve GEO Score by 2-3 points",
    status: "completed",
  },
  {
    id: 5,
    priority: "medium",
    category: "content",
    icon: FileText,
    title: "Expand comparison pages",
    description: "Create detailed comparison content between your product and alternatives. AI models frequently cite these in recommendations.",
    impact: "Could improve GEO Score by 4-7 points",
    status: "pending",
  },
];

const priorityColors: Record<string, string> = {
  high: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  low: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
};

export function PreviewRecommendations() {
  const completedCount = recommendations.filter(r => r.status === "completed").length;
  const totalCount = recommendations.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recommendations</h2>
          <p className="text-muted-foreground">AI-powered suggestions to improve your visibility.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Potential Impact</p>
            <p className="text-2xl font-bold text-primary">+20-32 pts</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedCount} of {totalCount}</p>
            </div>
            <Progress value={progressPercent} className="w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card
              key={rec.id}
              className={cn(
                "from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs",
                rec.status === "completed" && "opacity-60"
              )}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={priorityColors[rec.priority]}>
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                      </Badge>
                      <Badge variant="secondary">
                        {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                      </Badge>
                      {rec.status === "completed" && (
                        <Badge className="border-green-500/20 bg-green-500/10 text-green-500">Completed</Badge>
                      )}
                      {rec.status === "in_progress" && (
                        <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-500">In Progress</Badge>
                      )}
                    </div>
                    <h3 className="mt-2 font-semibold">{rec.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">{rec.impact}</p>
                    <div className="flex items-center gap-2 mt-3 sm:hidden">
                      {rec.status === "completed" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Button variant="outline" size="sm">
                          {rec.status === "pending" ? "Start" : "Mark Complete"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    {rec.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Button variant="outline" size="sm">
                        {rec.status === "pending" ? "Start" : "Mark Complete"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
