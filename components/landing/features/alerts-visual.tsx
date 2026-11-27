"use client";

import { Badge } from "@/components/ui/badge";

const alerts = [
  { title: "Visibility increased", desc: "+5 points", time: "2m ago", type: "success" },
  { title: "New competitor detected", desc: "Monday.com", time: "1h ago", type: "warning" },
  { title: "Mention in ChatGPT", desc: "Product recommendation", time: "3h ago", type: "info" },
  { title: "Ranking improved", desc: "#2 → #1 for 'project tools'", time: "5h ago", type: "success" },
];

const typeStyles = {
  success: { dot: "bg-emerald-500", badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  warning: { dot: "bg-amber-500", badge: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  info: { dot: "bg-primary", badge: "border-primary/30 bg-primary/10" },
};

export function AlertsVisual() {
  return (
    <div className="absolute inset-0 p-4">
      <div className="relative flex h-full min-h-[240px] flex-col rounded-xl border border-border/20 bg-card/30 p-3 backdrop-blur-sm [mask-image:linear-gradient(to_top,transparent,black_25%)]">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            live alerts
          </span>
        </div>

        {/* Alerts list */}
        <div className="space-y-1.5">
          {alerts.map((alert, i) => {
            const style = typeStyles[alert.type as keyof typeof typeStyles];
            return (
              <div
                key={alert.title}
                className="flex items-center gap-3 rounded-lg border border-border/20 bg-card/50 p-2.5"
                style={{ opacity: 1 - i * 0.12 }}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium">{alert.title}</p>
                  <p className="text-[10px] text-muted-foreground">{alert.desc}</p>
                </div>
                <Badge variant="outline" className={`px-1 text-[9px] ${style.badge}`}>
                  {alert.type === "info" ? <span className="text-gradient">New</span> : alert.time}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
