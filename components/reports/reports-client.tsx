"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, X, Check, Download, Eye, FileText, Loader2, Clock, Lock, AlertCircle } from "lucide-react";
import { generateReport, updateReportRecipients } from "@/app/actions/reports";
import { updateReportScheduling } from "@/app/actions/scheduling";
import type { ReportResponse, ReportScheduling, ReportType } from "@/types";

interface ReportsClientProps {
  initialReports: ReportResponse[];
  reportScheduling: ReportScheduling;
  canAddRecipients?: boolean;
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

export function ReportsClient({
  initialReports,
  reportScheduling: initialScheduling,
  canAddRecipients = false,
}: ReportsClientProps) {
  const t = useTranslations("reports");
  const [reports, setReports] = useState(initialReports);
  const [scheduling, setScheduling] = useState(initialScheduling);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [recipients, setRecipients] = useState<string[]>(
    initialScheduling?.recipients && initialScheduling.recipients.length > 0
      ? initialScheduling.recipients
      : initialScheduling?.owner_email
      ? [initialScheduling.owner_email]
      : []
  );

  const handleSchedulingToggle = (field: "auto_generate" | "send_email", value: boolean) => {
    setScheduling((prev) => ({ ...prev, [field]: value }));

    startTransition(async () => {
      const result = await updateReportScheduling({ [field]: value });
      if (result.success && result.scheduling) {
        setScheduling(result.scheduling.reports);
      } else {
        setScheduling(initialScheduling);
      }
    });
  };

  const handleGenerateReport = async (type: ReportType) => {
    setIsGenerating(true);
    setGenerateError(null);
    startTransition(async () => {
      const result = await generateReport({ type, format: "pdf" });
      if (result.success && result.report) {
        setReports((prev) => [result.report!, ...prev]);
      } else if (result.error) {
        setGenerateError(result.error);
      }
      setIsGenerating(false);
    });
  };

  const handleAddRecipient = async () => {
    if (newEmail && !recipients.includes(newEmail)) {
      const updated = [...recipients, newEmail];
      setRecipients(updated);
      setNewEmail("");
      await saveRecipients(updated);
    }
  };

  const handleRemoveRecipient = async (email: string) => {
    const updated = recipients.filter((r) => r !== email);
    setRecipients(updated);
    await saveRecipients(updated);
  };

  const saveRecipients = async (updatedRecipients: string[]) => {
    startTransition(async () => {
      const result = await updateReportRecipients({ recipients: updatedRecipients });
      if (!result.success) {
        console.error('Failed to save recipients:', result.error);
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const usagePercent = scheduling.limit > 0
    ? (scheduling.used / scheduling.limit) * 100
    : 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button
          data-testid="generate-report-button"
          className="gap-2 shadow-xs"
          onClick={() => handleGenerateReport("weekly")}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {t("generateNow")}
        </Button>
      </div>

      {generateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generateError}</AlertDescription>
        </Alert>
      )}

      {/* Settings Cards - with gradient like dashboard metric cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-6 lg:grid-cols-2">
        {/* Scheduled Reports */}
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>{t("settings.title")}</CardTitle>
            <CardDescription>{t("settings.subtitle")}</CardDescription>
            <CardAction>
              <Badge variant="outline" className="font-medium px-3 py-1">
                {scheduling.frequency.charAt(0).toUpperCase() + scheduling.frequency.slice(1)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-gen" className="text-sm font-medium">
                {t("settings.autoGenerate") || "Auto-generate"}
              </Label>
              <Switch
                id="auto-gen"
                checked={scheduling.auto_generate}
                onCheckedChange={(checked) => handleSchedulingToggle("auto_generate", checked)}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="send-email" className="text-sm font-medium">
                {t("settings.sendEmail") || "Email notifications"}
              </Label>
              <Switch
                id="send-email"
                checked={scheduling.send_email}
                onCheckedChange={(checked) => handleSchedulingToggle("send_email", checked)}
                disabled={isPending}
              />
            </div>

            <div className="border-t border-border/50 pt-3 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.frequency") || "Schedule"}</span>
                <span className="font-medium">{scheduling.cron_description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.nextRun") || "Next run"}</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">
                    {scheduling.auto_generate
                      ? formatNextRun(scheduling.next_run_at)
                      : t("settings.autoOff") || "Disabled"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.lastGenerated") || "Last generated"}</span>
                <span className="font-medium">{scheduling.last_generated_at ? formatDate(scheduling.last_generated_at) : "-"}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{t("settings.usage") || "Usage"}</span>
                <span className="font-mono text-xs text-muted-foreground">{scheduling.used}/{scheduling.limit}</span>
              </div>
              <Progress value={usagePercent} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>{t("recipients.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {canAddRecipients ? (
              <div className="flex gap-2">
                <Input
                  placeholder={t("recipients.placeholder")}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRecipient()}
                  className="bg-background"
                />
                <Button variant="outline" onClick={handleAddRecipient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-4 w-4 text-primary" />
                </div>
                <span>{t("recipients.upgradeHint")}</span>
              </div>
            )}
            <div className="space-y-2">
              {recipients.map((email, i) => (
                <div
                  key={email}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 bg-muted/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{email}</span>
                    {i === 0 && (
                      <Badge variant="secondary" className="text-[10px] h-5">{t("recipients.owner")}</Badge>
                    )}
                  </div>
                  {canAddRecipients && i !== 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveRecipient(email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report History - standalone table like keywords page */}
      <div className="space-y-4" data-testid="reports-list">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{t("history.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("history.subtitle")}</p>
        </div>
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">{t("history.report")}</TableHead>
                <TableHead className="w-[120px]">{t("history.date")}</TableHead>
                <TableHead className="w-[100px]">{t("history.type")}</TableHead>
                <TableHead className="w-[130px]">{t("history.status")}</TableHead>
                <TableHead className="w-[180px]">{t("history.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.name || `Report #${report.id}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(report.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono uppercase text-[10px] px-1 h-5">
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.status === "delivered" || report.status === "completed" ? (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        {t("history.delivered")}
                      </Badge>
                    ) : report.status === "generating" ? (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400 animate-pulse">
                         <Loader2 className="h-3 w-3 animate-spin" />
                         {t("history.generating")}
                      </Badge>
                    ) : report.status === "pending" ? (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                         <Clock className="h-3 w-3" />
                         {report.status}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] font-medium h-6 px-2 gap-1.5 border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                         <X className="h-3 w-3" />
                         {report.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={report.status !== "delivered" && report.status !== "completed"}
                        onClick={() => window.open(`/api/reports/${report.id}/download`, "_blank")}
                        className="h-8 px-2"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        {t("history.preview")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={report.status !== "delivered" && report.status !== "completed"}
                        onClick={() => window.open(`/api/reports/${report.id}/download`, "_blank")}
                        className="h-8 px-2"
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        {t("history.download")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="font-medium">{t("history.empty")}</p>
                    <p className="text-sm">Generate your first report to see it here.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Report Preview */}
      <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>{t("preview.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {(t.raw("preview.includes") as string[]).map((item: string) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
