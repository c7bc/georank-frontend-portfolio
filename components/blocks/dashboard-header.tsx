"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useUser } from "@/contexts/user-context";
import { CommandSearch, SearchTrigger } from "@/components/search/command-search";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardHeader({ title }: { title?: string }) {
  const t = useTranslations("common");
  const user = useUser();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b border-border/50">
        <div className="flex w-full items-center gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 h-8 w-8" />
            <Separator
              orientation="vertical"
              className="mx-2 h-4"
            />
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden h-9 gap-2 px-4 sm:flex border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-bold">
              <Link href="/settings/billing">
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
            
            <ModeToggle />
            
            <NotificationPanel />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative overflow-hidden ring-1 ring-border p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-[10px] bg-muted">{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <Separator className="my-1" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive" 
                  onClick={() => logout()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
