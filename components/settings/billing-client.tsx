"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Download, Check, AlertCircle, Sparkles, ExternalLink, Clock, X } from "lucide-react";
import { DowngradeDialog } from "@/components/settings/downgrade-dialog";
import type { PlanResponse, UsageResponse, InvoiceResponse, DowngradeImpact } from "@/types";

interface BillingClientProps {
  plan: PlanResponse | null;
  usage: UsageResponse | null;
  invoices: InvoiceResponse[];
  userEmail: string;
}

export function BillingClient({ plan, usage, invoices, userEmail }: BillingClientProps) {
  const t = useTranslations("billing");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [downgradeOpen, setDowngradeOpen] = useState(false);
  const [downgradeImpact, setDowngradeImpact] = useState<DowngradeImpact | null>(null);
  const [downgradeTargetPlan, setDowngradeTargetPlan] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const apiFetch = async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${apiBase}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json?.data ?? json;
  };

  const apiFetchGet = async (endpoint: string) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${apiBase}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json?.data ?? json;
  };

  const handleUpgrade = async (planKey: string) => {
    setIsLoading(true);
    try {
      const result = await apiFetch("/billing/checkout", {
        plan: planKey,
        success_url: window.location.origin + "/settings/billing?success=true",
        cancel_url: window.location.origin + "/settings/billing?canceled=true",
      });
      window.location.href = result.url;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      // Check for potential downgrade impact before opening Stripe portal
      const impact = await apiFetchGet(`/billing/downgrade-preview?plan=${plan?.name || "free"}`) as DowngradeImpact;

      const hasImpact =
        impact.keywords_over > 0 ||
        impact.competitors_over > 0 ||
        impact.domains_over > 0 ||
        impact.team_members_over > 0 ||
        impact.lose_team ||
        impact.lose_api ||
        impact.lose_integrations ||
        impact.lose_competitors;

      if (hasImpact) {
        setDowngradeImpact(impact);
        setDowngradeTargetPlan(plan?.name || "free");
        setDowngradeOpen(true);
        setIsLoading(false);
        return;
      }

      // No impact, proceed directly to Stripe portal
      await openStripePortal();
    } catch {
      // If downgrade preview fails, still allow access to Stripe portal
      await openStripePortal();
    }
  };

  const openStripePortal = async () => {
    try {
      const result = await apiFetch("/billing/portal", {
        return_url: window.location.origin + "/settings/billing",
      });
      window.location.href = result.url;
    } catch (error) {
      console.error("Failed to create portal session:", error);
      setIsLoading(false);
    }
  };

  const handleDowngradeConfirm = async () => {
    setDowngradeOpen(false);
    setIsLoading(true);
    await openStripePortal();
  };

  const domainsPercent = usage ? Math.round((usage.domains_used / Math.max(usage.domain_limit, 1)) * 100) : 0;
  const keywordsPercent = usage ? Math.round((usage.keywords_used / Math.max(usage.keyword_limit, 1)) * 100) : 0;
  const queriesPercent = usage && usage.query_limit > 0 ? Math.round((usage.queries_used / usage.query_limit) * 100) : 0;
  const competitorsPercent = usage && usage.competitor_limit > 0 ? Math.round((usage.competitors_used / usage.competitor_limit) * 100) : 0;
  const recommendationsPercent = usage && usage.recommendation_limit > 0 ? Math.round((usage.recommendation_runs_used / usage.recommendation_limit) * 100) : 0;
  const reportsPercent = usage && usage.report_limit > 0 ? Math.round((usage.reports_used / usage.report_limit) * 100) : 0;

  return (
    <div data-testid="billing-info" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-6 lg:grid-cols-2">
        {/* Current Plan */}
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>{t("currentPlan.title")}</CardTitle>
            <CardDescription>Your current subscription details</CardDescription>
            <CardAction>
              {plan && <Badge className="hero-gradient">{plan?.name?.toUpperCase()}</Badge>}
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan ? (
              <>
                <div>
                  <p className="text-3xl font-bold font-mono">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
            {usage ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("usage.domains")}</span>
                    <span className="font-mono">
                      {usage.domains_used}/{usage.domain_limit} {t("usage.used")}
                    </span>
                  </div>
                  <Progress value={domainsPercent} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("usage.keywords")}</span>
                    <span className="font-mono">
                      {usage.keywords_used}/{usage.keyword_limit} {t("usage.used")}
                    </span>
                  </div>
                  <Progress value={keywordsPercent} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("usage.queries")}</span>
                    <span className="font-mono">
                      {usage.queries_used}/{usage.query_limit} {t("usage.used")}
                    </span>
                  </div>
                  <Progress value={queriesPercent} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("usage.competitors")}</span>
                    <span className="font-mono">
                      {usage.competitors_used}/{usage.competitor_limit} {t("usage.used")}
                    </span>
                  </div>
                  <Progress value={competitorsPercent} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("usage.recommendations")}</span>
                    <span className="font-mono">
                      {usage.recommendation_runs_used}/{usage.recommendation_limit} {t("usage.used")}
                    </span>
                  </div>
                  <Progress value={recommendationsPercent} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t("usage.reports")}</span>
                    <span className="font-mono">
                      {usage.reports_used}/{usage.report_limit} {t("usage.used")}
                    </span>
                  </div>
                  <Progress value={reportsPercent} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Usage data not available</p>
            )}
                <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent-emerald" />
                    <span>Reports: {plan.report_frequency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent-emerald" />
                    <span>AI Recommendations {plan.recommendations_enabled ? "enabled" : "disabled"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent-emerald" />
                    <span>Up to {plan.team_member_limit} team members</span>
                  </div>
                  {plan.api_enabled && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent-emerald" />
                      <span>API access</span>
                    </div>
                  )}
                  {plan.integrations_enabled && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent-emerald" />
                      <span>Integrations</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  {plan.name === "free" || plan.name === "first_movers" ? (
                    <Button
                      className="flex-1 hero-gradient"
                      onClick={() => handleUpgrade("starter")}
                      disabled={isLoading}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t("currentPlan.upgrade")}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleManageSubscription}
                      disabled={isLoading}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("currentPlan.manageSub")}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 font-medium text-muted-foreground">{t("currentPlan.noPlanTitle")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("currentPlan.noPlanDesc")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>{t("paymentMethod.title")}</CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 bg-muted/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">
                  No payment method configured
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleManageSubscription} disabled={isLoading}>
              {t("paymentMethod.update")}
            </Button>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("paymentMethod.billingEmail")}
              </p>
              <p className="font-medium">{userEmail}</p>
              <Button variant="link" className="h-auto p-0 text-primary">
                {t("paymentMethod.updateEmail")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{t("invoices.title")}</h3>
          <p className="text-sm text-muted-foreground">View your past invoices and payments</p>
        </div>
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t("invoices.date")}</TableHead>
                <TableHead>{t("invoices.description")}</TableHead>
                <TableHead>{t("invoices.amount")}</TableHead>
                <TableHead>{t("invoices.status")}</TableHead>
                <TableHead>{t("invoices.download")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{formatDate(invoice.created_at)}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell className="font-mono">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {invoice.status === "paid" ? (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        {t("invoices.paid")}
                      </Badge>
                    ) : invoice.status === "pending" ? (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                        <X className="h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {invoice.pdf_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <CreditCard className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="font-medium">No invoices yet</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Downgrade Warning Dialog */}
      {downgradeImpact && (
        <DowngradeDialog
          open={downgradeOpen}
          onOpenChange={setDowngradeOpen}
          impact={downgradeImpact}
          onConfirm={handleDowngradeConfirm}
          targetPlan={downgradeTargetPlan}
        />
      )}
    </div>
  );
}
