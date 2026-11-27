"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const recommendations = [
  { id: "faq", text: "Add FAQ section to homepage", done: true, impact: "High" as const },
  { id: "compare", text: "Create comparison pages", done: true, impact: "High" as const },
  { id: "meta", text: "Improve meta descriptions", done: false, impact: "Critical" as const },
  { id: "schema", text: "Add structured data markup", done: false, impact: "Medium" as const },
  { id: "blog", text: "Publish weekly blog posts", done: false, impact: "High" as const },
  { id: "internal", text: "Build internal linking strategy", done: false, impact: "Medium" as const },
  { id: "citations", text: "Add expert citations to content", done: false, impact: "Critical" as const },
  { id: "alt", text: "Optimize image alt attributes", done: true, impact: "Medium" as const },
];

export function RecommendationsVisual() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,black_50%)]">
      <div className="overflow-hidden rounded-lg border bg-card/30 h-full p-4 space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/40"
          >
            <Checkbox
              id={rec.id}
              checked={rec.done}
              className={
                rec.done
                  ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  : ""
              }
            />
            <Label
              htmlFor={rec.id}
              className={`flex-1 text-sm font-normal ${
                rec.done ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {rec.text}
            </Label>
            <Badge
              variant="outline"
              className={`text-[11px] font-medium h-6 px-2 ${
                rec.impact === "Critical"
                  ? "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400"
                  : rec.impact === "High"
                    ? "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400"
                    : "border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground"
              }`}
            >
              {rec.impact}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
