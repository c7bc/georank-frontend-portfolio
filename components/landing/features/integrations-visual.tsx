"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const integrations = [
  { name: "Slack", abbr: "SL", color: "bg-[#4A154B]", status: "Connected", events: "1.2k" },
  { name: "Zapier", abbr: "ZP", color: "bg-[#FF4A00]", status: "Connected", events: "856" },
  { name: "Webhooks", abbr: "WH", color: "bg-blue-500", status: "Active", events: "2.1k" },
];

export function IntegrationsVisual() {
  return (
    <div className="absolute inset-0 p-4">
      <div className="relative flex h-full min-h-[240px] flex-col rounded-xl border border-border/20 bg-card/30 p-3 backdrop-blur-sm [mask-image:linear-gradient(to_top,transparent,black_25%)]">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              integrations
            </span>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 px-1.5 text-[9px]">
            <span className="text-gradient">API Ready</span>
          </Badge>
        </div>

        {/* Integrations grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col items-center gap-2 rounded-lg border border-border/20 bg-card/50 p-3"
            >
              <Avatar className="h-8 w-8 border border-background shadow-sm">
                <AvatarFallback className={`${integration.color} text-[9px] font-bold text-white`}>
                  {integration.abbr}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-[10px] font-medium">{integration.name}</p>
                <p className="text-[9px] text-muted-foreground">{integration.events} events</p>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 px-1 text-[8px] text-emerald-400"
              >
                {integration.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* API Card */}
        <div className="mt-1.5 rounded-lg border border-primary/30 bg-primary/5 p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 font-mono text-[10px] text-primary">
                {"{ }"}
              </div>
              <div>
                <p className="text-[10px] font-medium">REST API</p>
                <p className="text-[9px] text-muted-foreground">Full access</p>
              </div>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 px-1 text-[9px] text-emerald-400">
              v2.0
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
