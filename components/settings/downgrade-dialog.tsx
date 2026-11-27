"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import type { DowngradeImpact } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  impact: DowngradeImpact;
  onConfirm: () => void;
  targetPlan: string;
};

export function DowngradeDialog({ open, onOpenChange, impact, onConfirm, targetPlan }: Props) {
  const [understood, setUnderstood] = useState(false);
  const t = useTranslations("billing");

  const impacts: string[] = [];
  if (impact.keywords_over > 0) impacts.push(t("downgrade.keywordsArchived", { count: impact.keywords_over }));
  if (impact.competitors_over > 0) impacts.push(t("downgrade.competitorsArchived", { count: impact.competitors_over }));
  if (impact.domains_over > 0) impacts.push(t("downgrade.domainsArchived", { count: impact.domains_over }));
  if (impact.team_members_over > 0) impacts.push(t("downgrade.membersDeactivated", { count: impact.team_members_over }));
  if (impact.lose_team) impacts.push(t("downgrade.loseTeam"));
  if (impact.lose_api) impacts.push(t("downgrade.loseAPI"));
  if (impact.lose_integrations) impacts.push(t("downgrade.loseIntegrations"));
  if (impact.lose_competitors) impacts.push(t("downgrade.loseCompetitors"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("downgrade.title")}
          </DialogTitle>
          <DialogDescription>
            {t("downgrade.description", { plan: targetPlan })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {impacts.map((impactText, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-destructive">
              <span>•</span>
              <span>{impactText}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="understand"
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked === true)}
          />
          <label htmlFor="understand" className="text-sm">
            {t("downgrade.understand")}
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("downgrade.cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={!understood}
            onClick={onConfirm}
          >
            {t("downgrade.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
