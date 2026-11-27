"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeOverlayProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function UpgradeOverlay({ title, description, children }: UpgradeOverlayProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-md opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-background px-8 py-6 text-center shadow-lg border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button asChild size="sm">
            <Link href="/settings/billing">
              {t("upgrade")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
