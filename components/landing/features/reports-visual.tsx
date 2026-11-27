"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recipients = [
  { name: "JD", color: "bg-blue-500" },
  { name: "SK", color: "bg-emerald-500" },
  { name: "MR", color: "bg-amber-500" },
];

export function ReportsVisual() {
  return (
    <div className="absolute inset-0 p-4">
      <div className="relative flex h-full min-h-[240px] flex-col rounded-xl border border-border/20 bg-card/30 p-3 backdrop-blur-sm [mask-image:linear-gradient(to_top,transparent,black_25%)]">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            automated reports
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Weekly */}
          <div className="flex flex-col justify-between rounded-lg border border-border/20 bg-card/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Weekly</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 px-1 text-[9px] text-emerald-400">
                Sent
              </Badge>
            </div>
            <div className="mt-2 flex items-end gap-0.5">
              {[40, 65, 45, 80, 55, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/40" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="mt-1.5 text-center text-[9px] text-muted-foreground">Mon 9:00 AM</p>
          </div>

          {/* Monthly */}
          <div className="flex flex-col justify-between rounded-lg border border-border/20 bg-card/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Monthly</span>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 px-1 text-[9px]">
                <span className="text-gradient">+12%</span>
              </Badge>
            </div>
            <svg className="mt-2 h-10 w-full text-primary/60" viewBox="0 0 100 30" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points="0,25 15,20 30,22 50,12 70,15 85,8 100,5"
              />
            </svg>
            <p className="mt-1.5 text-center text-[9px] text-muted-foreground">1st of month</p>
          </div>

          {/* Quarterly */}
          <div className="flex flex-col justify-between rounded-lg border border-border/20 bg-card/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Quarterly</span>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 px-1 text-[9px]">
                <span className="text-gradient">+28%</span>
              </Badge>
            </div>
            <div className="relative mt-2 h-10 overflow-hidden">
              <svg className="h-full w-full text-primary" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path fill="url(#areaGrad)" d="M0,30 L0,20 Q25,25 50,15 T100,8 L100,30 Z" />
                <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,20 Q25,25 50,15 T100,8" />
              </svg>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-muted-foreground">Q1 2025</p>
          </div>

          {/* Recipients */}
          <div className="flex flex-col justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Recipients</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 px-1 text-[9px] text-emerald-400">
                5
              </Badge>
            </div>
            <div className="mt-2 flex -space-x-2">
              {recipients.map((r) => (
                <Avatar key={r.name} className="h-7 w-7 border-2 border-card">
                  <AvatarFallback className={`${r.color} text-[8px] font-medium text-white`}>
                    {r.name}
                  </AvatarFallback>
                </Avatar>
              ))}
              <Avatar className="h-7 w-7 border-2 border-card">
                <AvatarFallback className="bg-muted text-[8px] text-muted-foreground">+2</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-1.5">
              <p className="text-[9px] text-muted-foreground">Next report</p>
              <p className="text-gradient text-lg font-bold leading-tight">2d 14h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
