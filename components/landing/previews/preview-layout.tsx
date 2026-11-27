"use client";

import {
  LayoutDashboard,
  Globe,
  Search,
  Users,
  FileText,
  Lightbulb,
  CreditCard,
  Key,
  Plug,
  Sparkles,
  Bell,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GeoRankIcon } from "@/components/shared/georank-icon";

interface PreviewLayoutProps {
  children: React.ReactNode;
  activePage: "dashboard" | "keywords" | "competitors" | "recommendations" | "reports";
}

const navItems = [
  { icon: LayoutDashboard, page: "dashboard" },
  { icon: Globe, page: null },
  { icon: Search, page: "keywords" },
  { icon: Users, page: "competitors" },
  { icon: FileText, page: "reports" },
  { icon: Lightbulb, page: "recommendations" },
];

const settingsItems = [
  { icon: Users },
  { icon: CreditCard },
  { icon: Key },
  { icon: Plug },
];

export function PreviewLayout({ children, activePage }: PreviewLayoutProps) {
  return (
    <div className="flex h-[800px] w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar - collapsed/icon-only mode (48px) */}
      <div className="hidden w-12 flex-col bg-sidebar md:flex shrink-0">
        {/* Sidebar Header - GeoRank icon only */}
        <div className="flex items-center justify-center py-6">
          <GeoRankIcon size={28} className="text-primary shrink-0" />
        </div>

        {/* Sidebar Content - icons only */}
        <div className="flex-1 overflow-auto flex flex-col items-center gap-0.5 px-1.5">
          {/* Main Group */}
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = item.page === activePage;
            return (
              <div
                key={i}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md cursor-pointer transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            );
          })}

          {/* Separator between groups */}
          <Separator className="my-2 w-6" />

          {/* Settings Group */}
          {settingsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-md cursor-pointer text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer - icon only */}
        <div className="flex items-center justify-center py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors">
            <GeoRankIcon size={22} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Dashboard Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50">
          <div className="flex w-full items-center gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="-ml-1 h-8 w-8">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Button variant="outline" className="h-9 w-64 justify-start text-sm text-muted-foreground shadow-none bg-muted/50">
                <Search className="mr-2 h-4 w-4" />
                Search...
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden h-9 gap-2 px-4 sm:flex border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-bold">
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ring-1 ring-border p-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  J
                </div>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="@container/main space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
