"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Hash, Globe, Target } from "lucide-react";
import { searchApi } from "@/lib/api/search";
import type { SearchResult } from "@/lib/api/search";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: Props) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      {open && <CommandContent onSelect={() => onOpenChange(false)} />}
    </CommandDialog>
  );
}

function CommandContent({ onSelect }: { onSelect: () => void }) {
  const t = useTranslations("common");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<{ query: string; results: SearchResult | null } | null>(null);
  const term = query.trim();
  const results = search?.query === term ? search.results : null;
  const isLoading = term.length >= 2 && search?.query !== term;

  useEffect(() => {
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      let results: SearchResult | null;
      try {
        results = await searchApi.search({ q: term, limit: 5 }, controller.signal);
      } catch {
        results = null;
      }
      if (!controller.signal.aborted) setSearch({ query: term, results });
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const navigate = (type: "keyword" | "competitor" | "domain") => {
    onSelect();
    switch (type) {
      case "keyword":
        router.push("/keywords");
        break;
      case "competitor":
        router.push("/competitors");
        break;
      case "domain":
        router.push("/keywords");
        break;
    }
  };

  const hasResults = results && (
    results.keywords.length > 0 ||
    results.competitors.length > 0 ||
    results.domains.length > 0
  );

  return (
    <>
      <CommandInput
        placeholder={t("search.placeholder")}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t("search.typeToSearch")}
          </div>
        )}
        {!isLoading && term.length >= 2 && !hasResults && (
          <CommandEmpty>{t("search.noResults")}</CommandEmpty>
        )}
        {!isLoading && term.length < 2 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t("search.typeToSearch")}
          </div>
        )}

        {results && results.keywords.length > 0 && (
          <CommandGroup heading={t("search.keywords")}>
            {results.keywords.map((item) => (
              <CommandItem
                key={`kw-${item.id}`}
                onSelect={() => navigate("keyword")}
                className="cursor-pointer"
              >
                <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{item.name}</span>
                {item.status && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {item.status}
                  </Badge>
                )}
                <span className="ml-2 text-xs text-muted-foreground">
                  {item.score}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.competitors.length > 0 && (
          <CommandGroup heading={t("search.competitors")}>
            {results.competitors.map((item) => (
              <CommandItem
                key={`comp-${item.id}`}
                onSelect={() => navigate("competitor")}
                className="cursor-pointer"
              >
                <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {item.score}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.domains.length > 0 && (
          <CommandGroup heading={t("search.domains")}>
            {results.domains.map((item) => (
              <CommandItem
                key={`dom-${item.id}`}
                onSelect={() => navigate("domain")}
                className="cursor-pointer"
              >
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {item.score}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </>
  );
}
