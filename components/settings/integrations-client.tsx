"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MessageSquare, Webhook, Mail, BarChart3, Loader2, Plug, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleIntegration, saveIntegrationConfig, testIntegrationConnection } from "@/app/actions/integrations";
import type { IntegrationResponse, IntegrationType } from "@/types";

interface IntegrationsClientProps {
  integrations: IntegrationResponse[];
}

const integrationMeta: Record<IntegrationType, { name: string; description: string; icon: typeof MessageSquare; placeholder: string }> = {
  slack: {
    name: "Slack",
    description: "Get notifications in your Slack channels",
    icon: MessageSquare,
    placeholder: "https://hooks.slack.com/services/...",
  },
  discord: {
    name: "Discord",
    description: "Get notifications in your Discord server",
    icon: MessageSquare,
    placeholder: "https://discord.com/api/webhooks/...",
  },
  webhook: {
    name: "Webhooks",
    description: "Send data to custom endpoints",
    icon: Webhook,
    placeholder: "https://your-app.com/webhook",
  },
  zapier: {
    name: "Zapier",
    description: "Connect with thousands of apps",
    icon: Webhook,
    placeholder: "https://hooks.zapier.com/hooks/catch/...",
  },
  email: {
    name: "Email Notifications",
    description: "Receive updates via email",
    icon: Mail,
    placeholder: "",
  },
  google_analytics: {
    name: "Google Analytics",
    description: "Track AI referral traffic",
    icon: BarChart3,
    placeholder: "",
  },
};

export function IntegrationsClient({ integrations }: IntegrationsClientProps) {
  const t = useTranslations("sidebar");
  const tEmpty = useTranslations("emptyStates");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({});
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [savingType, setSavingType] = useState<string | null>(null);
  const [testingType, setTestingType] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const handleToggle = async (integration: IntegrationResponse) => {
    setTogglingId(integration.id);
    const result = await toggleIntegration(integration.type, !integration.enabled);
    setTogglingId(null);
    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleSaveConfig = async (type: IntegrationType) => {
    const url = webhookUrls[type];
    if (!url) return;
    setSavingType(type);
    const secret = secrets[type];
    const result = await saveIntegrationConfig(type, url, secret || undefined);
    setSavingType(null);
    if (result.success) {
      setTestResults((prev) => ({ ...prev, [type]: { success: true, message: "Configuration saved" } }));
      startTransition(() => {
        router.refresh();
      });
    } else {
      setTestResults((prev) => ({ ...prev, [type]: { success: false, message: result.error || "Failed to save" } }));
    }
  };

  const handleTestConnection = async (type: IntegrationType) => {
    setTestingType(type);
    setTestResults((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
    const result = await testIntegrationConnection(type);
    setTestingType(null);
    setTestResults((prev) => ({
      ...prev,
      [type]: result.success
        ? { success: true, message: "Test notification sent!" }
        : { success: false, message: result.error || "Test failed" },
    }));
  };

  const getWebhookUrl = (integration: IntegrationResponse) => {
    if (webhookUrls[integration.type] !== undefined) return webhookUrls[integration.type];
    return (integration.config?.webhook_url as string) || "";
  };

  const getSecret = (integration: IntegrationResponse) => {
    if (secrets[integration.type] !== undefined) return secrets[integration.type];
    return "";
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("integrations")}</h2>
        <p className="text-muted-foreground">
          Connect GeoRank with your favorite tools
        </p>
      </div>

      {integrations.length === 0 ? (
        <Card className="border-dashed shadow-xs border-border/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plug className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium text-muted-foreground">{tEmpty("integrations")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {tEmpty("integrationsDesc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => {
            const meta = integrationMeta[integration.type];
            if (!meta) return null;

            const Icon = meta.icon;
            const isToggling = togglingId === integration.id;
            const testResult = testResults[integration.type];

            return (
              <Card key={integration.id} className={cn("@container/card", isPending && "opacity-50")}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{meta.name}</span>
                        {integration.enabled && (
                          <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400">
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {meta.description}
                      </p>
                      {integration.last_sync_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {new Date(integration.last_sync_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {isToggling ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={() => handleToggle(integration)}
                      />
                    )}
                  </div>
                </CardHeader>

                {integration.enabled && (
                  <CardContent className="space-y-3 border-t border-border/50 pt-4">
                      <div>
                        <label className="text-sm font-medium">Webhook URL</label>
                        <Input
                          type="url"
                          placeholder={meta.placeholder}
                          value={getWebhookUrl(integration)}
                          onChange={(e) =>
                            setWebhookUrls((prev) => ({
                              ...prev,
                              [integration.type]: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      {integration.type === "webhook" && (
                        <div>
                          <label className="text-sm font-medium">
                            Signing Secret <span className="text-muted-foreground font-normal">(optional)</span>
                          </label>
                          <Input
                            type="password"
                            placeholder="your-signing-secret"
                            value={getSecret(integration)}
                            onChange={(e) =>
                              setSecrets((prev) => ({
                                ...prev,
                                [integration.type]: e.target.value,
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveConfig(integration.type)}
                          disabled={savingType === integration.type || !getWebhookUrl(integration)}
                        >
                          {savingType === integration.type && (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          )}
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestConnection(integration.type)}
                          disabled={testingType === integration.type}
                        >
                          {testingType === integration.type && (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          )}
                          Test Connection
                        </Button>
                      </div>

                    {testResult && (
                      <div className={cn(
                        "flex items-center gap-1.5 text-sm",
                        testResult.success ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                      )}>
                        {testResult.success ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {testResult.message}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>Need a custom integration?</CardTitle>
          <CardDescription>Contact us to discuss custom integration options for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Contact Support</Button>
        </CardContent>
      </Card>
    </>
  );
}
