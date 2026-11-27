"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  MoreHorizontal,
  AlertCircle,
  CircleCheckBig,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { platformIcons, platformLabels, statusColors } from "@/lib/constants";
import { createKeyword, deleteKeyword, updateKeyword } from "@/app/actions/keywords";
import { GenerateQueryDialog } from "@/components/keywords/generate-query-dialog";
import { KeywordMentionsSheet } from "@/components/keywords/keyword-mentions-sheet";
import type { KeywordResponse } from "@/types";

interface DomainOption {
  id: number;
  name: string;
  url: string;
}

interface KeywordsTableProps {
  initialKeywords: KeywordResponse[];
  total: number;
  page: number;
  totalPages: number;
  initialSearch?: string;
  initialPlatform?: string;
  initialStatus?: string;
  initialSort?: string;
  initialDomainId?: string;
  allowedPlatforms: string[];
  queriesUsed: number;
  queryLimit: number;
  domains?: DomainOption[];
}

export function KeywordsTable({
  initialKeywords,
  total,
  page,
  totalPages,
  initialSearch,
  initialPlatform,
  initialStatus,
  initialSort,
  initialDomainId,
  allowedPlatforms,
  queriesUsed,
  queryLimit,
  domains = [],
}: KeywordsTableProps) {
  const t = useTranslations("keywords");
  const tStatus = useTranslations("keywords.status");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(allowedPlatforms);
  const [selectedDomainId, setSelectedDomainId] = useState<number | undefined>(
    domains.length === 1 ? domains[0].id : undefined
  );

  const domainMap = Object.fromEntries(domains.map((d) => [d.id, d]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // View keyword mentions state
  const [viewKeyword, setViewKeyword] = useState<{
    id: number;
    keyword: string;
  } | null>(null);

  // Edit modal state
  const [editKeyword, setEditKeyword] = useState<KeywordResponse | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDomainId, setEditDomainId] = useState<number | undefined>(undefined);

  const updateSearchParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router, startTransition]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      updateSearchParams("search", value);
    }, 300);
  }, [updateSearchParams]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleEditKeyword = async () => {
    if (!editKeyword) return;
    setIsSubmitting(true);
    const result = await updateKeyword(editKeyword.id, {
      keyword: editValue,
      category: editCategory,
      domain_id: editDomainId,
    });
    setIsSubmitting(false);
    if (result.success) {
      setEditKeyword(null);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const statusLabels: Record<string, string> = {
    ranking: tStatus("ranking"),
    improving: tStatus("improving"),
    needs_work: tStatus("needsWork"),
    not_ranking: tStatus("notRanking"),
  };

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const domainId = domains.length === 1 ? domains[0].id : selectedDomainId;
    const result = await createKeyword({
      keyword: newKeyword,
      platforms: selectedPlatforms,
      domain_id: domainId,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsAddOpen(false);
      setNewKeyword("");
      startTransition(() => {
        router.refresh();
      });
    } else {
      setError(result.error || "Failed to add keyword");
    }
  };

  const handleDeleteKeyword = async () => {
    if (!deleteId) return;

    setIsSubmitting(true);

    const result = await deleteKeyword(deleteId);

    setIsSubmitting(false);

    if (result.success) {
      setDeleteId(null);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Map API response to UI format
  const mapStatus = (status: string): keyof typeof statusColors => {
    const statusMap: Record<string, keyof typeof statusColors> = {
      ranking: "ranking",
      improving: "improving",
      needs_work: "needs_work",
      not_ranking: "not_ranking",
    };
    return statusMap[status] || "not_ranking";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <GenerateQueryDialog
            keywords={initialKeywords}
            allowedPlatforms={allowedPlatforms}
            queriesUsed={queriesUsed}
            queryLimit={queryLimit}
            domains={domains}
          />
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (open) {
              setSelectedPlatforms(allowedPlatforms);
              setNewKeyword("");
              setError(null);
              setSelectedDomainId(domains.length === 1 ? domains[0].id : undefined);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-keyword-button">
                <Plus className="h-4 w-4" />
                {t("addKeyword")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addModal.title")}</DialogTitle>
                <DialogDescription>{t("addModal.subtitle")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="keyword">{t("addModal.label")}</Label>
                  <Input
                    id="keyword"
                    placeholder={t("addModal.placeholder")}
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("addModal.helper")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{t("addModal.platformsLabel")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allowedPlatforms.map((platform) => (
                      <div key={platform} className="flex items-center gap-2">
                        <Checkbox
                          id={`add-${platform}`}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={() => togglePlatform(platform)}
                        />
                        <Label htmlFor={`add-${platform}`} className="font-normal">
                          {platformLabels[platform] || platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {domains.length >= 1 && (
                  <div className="space-y-2">
                    <Label>{t("addModal.domainLabel")}</Label>
                    <Select
                      value={selectedDomainId ? String(selectedDomainId) : ""}
                      onValueChange={(v) => setSelectedDomainId(Number(v))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("addModal.domainPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>
                            {d.name || d.url}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  {t("addModal.cancel")}
                </Button>
                <Button onClick={handleAddKeyword} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    t("addModal.add")
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("addModal.placeholder")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-9 w-[250px] lg:w-[350px] pl-9 bg-background"
            />
          </div>
          <Select defaultValue={initialPlatform || "all"} onValueChange={(value) => updateSearchParams("platform", value)}>
            <SelectTrigger className="h-9 w-[150px] bg-background">
              <SelectValue placeholder={t("allPlatforms")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allPlatforms")}</SelectItem>
              {Object.entries(platformIcons).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={initialStatus || "all"} onValueChange={(value) => updateSearchParams("status", value)}>
            <SelectTrigger className="h-9 w-[150px] bg-background">
              <SelectValue placeholder={t("allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatus")}</SelectItem>
              <SelectItem value="ranking">{tStatus("ranking")}</SelectItem>
              <SelectItem value="improving">{tStatus("improving")}</SelectItem>
              <SelectItem value="needs_work">{tStatus("needsWork")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={initialSort || "score"} onValueChange={(value) => updateSearchParams("sort", value)}>
            <SelectTrigger className="h-9 w-[150px] bg-background">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">{t("score")}</SelectItem>
              <SelectItem value="recent">{t("recent")}</SelectItem>
              <SelectItem value="alphabetical">{t("alphabetical")}</SelectItem>
            </SelectContent>
          </Select>
          {domains.length > 1 && (
            <Select defaultValue={initialDomainId || "all"} onValueChange={(value) => updateSearchParams("domain_id", value)}>
              <SelectTrigger className="h-9 w-[150px] bg-background">
                <SelectValue placeholder={t("allDomains")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allDomains")}</SelectItem>
                {domains.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name || d.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background">
        <Table data-testid="keywords-table">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12 pl-4">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[250px]">{t("table.keyword")}</TableHead>
              <TableHead className="w-[140px]">{t("table.domain")}</TableHead>
              <TableHead className="w-[100px]">{t("table.platforms")}</TableHead>
              <TableHead className="w-[200px]">{t("table.score")}</TableHead>
              <TableHead className="w-[150px]">{t("table.trend")}</TableHead>
              <TableHead className="w-[100px]">{t("table.mentions")}</TableHead>
              <TableHead className="w-[150px]">{t("table.status")}</TableHead>
              <TableHead className="w-[100px]">{t("table.autoQuery") || "Auto"}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialKeywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="font-medium">{t("empty.title")}</p>
                  <p className="text-sm">{t("empty.description")}</p>
                </TableCell>
              </TableRow>
            ) : (
              initialKeywords.map((keyword) => {
                const status = mapStatus(keyword.status);
                const trendType = keyword.trend;

                return (
                  <TableRow key={keyword.id} className={isPending ? "opacity-50" : ""}>
                    <TableCell className="pl-4">
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{keyword.keyword}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground truncate block max-w-[130px]">
                        {keyword.domain_id && domainMap[keyword.domain_id]
                          ? domainMap[keyword.domain_id].name || domainMap[keyword.domain_id].url
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {keyword.platforms?.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-[10px] px-1 h-5">
                            {platform.slice(0, 3).toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Score: {keyword.score || 0}</span>
                        <Progress value={keyword.score} className="w-12 h-1 bg-muted" />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold px-1.5 py-0 h-5 border-border/50 transition-colors cursor-default",
                          trendType === "up" ? "text-green-600 border-green-200 dark:text-green-400 dark:border-green-900/50" : 
                          trendType === "down" ? "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/50" : 
                          "text-muted-foreground"
                        )}
                      >
                        {trendType === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                        {trendType === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                        {trendType === "stable" && <Minus className="mr-1 h-3 w-3" />}
                        {keyword.visibility > 0 ? "+" : ""}
                        {keyword.visibility.toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center text-muted-foreground">
                        <span className="text-sm">{keyword.mentions}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px] font-medium h-6 px-2 gap-1.5", 
                          status === "ranking" ? "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400" :
                          status === "improving" ? "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400" :
                          status === "needs_work" ? "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400" :
                          "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                        )}
                      >
                         {status === "ranking" && <CircleCheckBig className="h-3 w-3" />}
                         {status === "improving" && <TrendingUp className="h-3 w-3" />}
                         {status === "needs_work" && <AlertCircle className="h-3 w-3" />}
                         {status === "not_ranking" && <XCircle className="h-3 w-3" />}
                        {statusLabels[status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={keyword.auto_query !== false}
                        onCheckedChange={async (checked) => {
                          await updateKeyword(keyword.id, { auto_query: checked });
                          startTransition(() => {
                            router.refresh();
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewKeyword({ id: keyword.id, keyword: keyword.keyword })}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Mentions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setEditKeyword(keyword);
                            setEditValue(keyword.keyword);
                            setEditCategory(keyword.category || "");
                            setEditDomainId(keyword.domain_id);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Keyword
                          </DropdownMenuItem>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(keyword.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, total)}</span> of <span className="font-medium">{total}</span> keywords
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Keyword</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this keyword? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteKeyword} disabled={isSubmitting}>
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

      {/* View Keyword Mentions Sheet */}
      <KeywordMentionsSheet
        key={viewKeyword?.id ?? "closed"}
        open={!!viewKeyword}
        onOpenChange={(open) => !open && setViewKeyword(null)}
        keywordId={viewKeyword?.id ?? null}
        keyword={viewKeyword?.keyword ?? ""}
      />

      {/* Edit Keyword Dialog */}
      <Dialog open={!!editKeyword} onOpenChange={(open) => !open && setEditKeyword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Keyword</DialogTitle>
            <DialogDescription>Update the keyword text and category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-keyword">Keyword</Label>
              <Input
                id="edit-keyword"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="e.g. brand, product, general"
              />
            </div>
            {domains.length >= 1 && (
              <div className="space-y-2">
                <Label>{t("addModal.domainLabel")}</Label>
                <Select
                  value={editDomainId ? String(editDomainId) : ""}
                  onValueChange={(v) => setEditDomainId(Number(v))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t("addModal.domainPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name || d.url}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditKeyword(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditKeyword} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
