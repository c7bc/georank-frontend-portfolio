"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Copy, Trash2, Eye, EyeOff, Loader2, Check, Key, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAPIKey, deleteAPIKey } from "@/app/actions/api-keys";
import type { APIKeyResponse, APIKeyType } from "@/types";

interface APIKeysClientProps {
  apiKeys: APIKeyResponse[];
}

export function APIKeysClient({ apiKeys }: APIKeysClientProps) {
  const t = useTranslations("sidebar");
  const tEmpty = useTranslations("emptyStates");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState<APIKeyType>("live");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createAPIKey({ name: newKeyName, type: newKeyType });

    setIsSubmitting(false);

    if (result.success && result.apiKey) {
      setCreatedKey(result.apiKey.key);
      setNewKeyName("");
      setNewKeyType("live");
      startTransition(() => {
        router.refresh();
      });
    } else {
      setError(result.error || "Failed to create API key");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsSubmitting(true);

    const result = await deleteAPIKey(deleteId);

    setIsSubmitting(false);

    if (result.success) {
      setDeleteId(null);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const copyToClipboard = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const closeCreateDialog = () => {
    setIsCreateOpen(false);
    setCreatedKey(null);
    setError(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("apiKeys")}</h2>
          <p className="text-muted-foreground">
            Manage API keys for external integrations
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => !createdKey && setIsCreateOpen(open)}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {createdKey ? "API Key Created" : "Create API Key"}
              </DialogTitle>
              <DialogDescription>
                {createdKey
                  ? "Make sure to copy your API key now. You won't be able to see it again!"
                  : "Create a new API key for external integrations."}
              </DialogDescription>
            </DialogHeader>
            {createdKey ? (
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted p-4">
                  <code className="text-sm break-all">{createdKey}</code>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => copyToClipboard(createdKey, -1)}
                >
                  {copiedId === -1 ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Key Type</Label>
                  <Select value={newKeyType} onValueChange={(v) => setNewKeyType(v as APIKeyType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live (Production)</SelectItem>
                      <SelectItem value="test">Test (Development)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              {createdKey ? (
                <Button onClick={closeCreateDialog}>Done</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={closeCreateDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Key"
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Active keys for external integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Key className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 font-medium text-muted-foreground">{tEmpty("apiKeys")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {tEmpty("apiKeysDesc")}
                </p>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border border-border/50 p-4 bg-muted/20",
                    isPending && "opacity-50"
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{apiKey.name}</p>
                      <Badge variant="outline" className={apiKey.type === "live"
                        ? "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400"
                        : "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400"
                      }>
                        {apiKey.type === "live" ? "Live" : "Test"}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">
                      {apiKey.key_prefix}••••••••••••
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created: {formatDate(apiKey.created_at)}
                      {apiKey.last_used_at && ` • Last used: ${formatDate(apiKey.last_used_at)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key_prefix, apiKey.id)}
                    >
                      {copiedId === apiKey.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Learn how to integrate GeoRank data into your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">View Documentation →</Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? Any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
