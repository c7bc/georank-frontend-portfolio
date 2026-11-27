"use client";

import Link from "next/link";
import { Lock, Sparkles, Swords, Users, Key, Plug, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const icons = {
  swords: Swords,
  users: Users,
  key: Key,
  plug: Plug,
  lightbulb: Lightbulb,
} as const;

type IconName = keyof typeof icons;

interface UpgradeRequiredProps {
  icon: IconName;
  title: string;
  subtitle: string;
  description: string;
  requiredPlan: string;
}

export function UpgradeRequired({
  icon,
  title,
  subtitle,
  description,
  requiredPlan,
}: UpgradeRequiredProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-1 flex-col overflow-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/50 shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-4 ring-background">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary">
                  <Lock className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto text-balance">
                {description}
              </p>
            </div>

            <Badge variant="outline" className="text-xs py-1 px-3 border-primary/20 bg-primary/5 text-primary">
              Available on {requiredPlan} plan and above
            </Badge>

            <Button asChild className="w-full gap-2 shadow-xs" size="lg">
              <Link href="/settings/billing">
                <Sparkles className="h-4 w-4" />
                Upgrade Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
