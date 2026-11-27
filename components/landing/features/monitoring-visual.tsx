"use client";

import { Activity, ArrowUpRight, Globe, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function MonitoringVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
           <div>
             <h3 className="text-lg font-semibold text-foreground">Usage Overview</h3>
             <p className="text-sm text-muted-foreground">Real-time monitoring metrics</p>
           </div>
           <div className="rounded-lg border border-border bg-muted/40 p-2">
             <Activity className="h-5 w-5 text-primary" />
           </div>
        </div>

        <div className="mt-8 grid gap-4">
          {/* Usage Bar 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Globe className="h-4 w-4 text-blue-500" /> Domains Tracked
              </span>
              <span className="text-muted-foreground">2 / 5</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[40%] rounded-full bg-blue-500" />
            </div>
          </div>

          {/* Usage Bar 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Zap className="h-4 w-4 text-yellow-500" /> API Calls
              </span>
              <span className="text-muted-foreground">8,432 / 10,000</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[84%] rounded-full bg-yellow-500" />
            </div>
          </div>

          {/* Usage Bar 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Layers className="h-4 w-4 text-purple-500" /> Keywords
              </span>
              <span className="text-muted-foreground">450 / 500</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[90%] rounded-full bg-purple-500" />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Scale Automatically</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your plan auto-scales based on usage. No interruption in service even during traffic spikes.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Graph Placeholder */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-border bg-muted/10 px-6 py-4">
         <div className="flex items-end justify-between gap-1 h-full">
            {[40, 60, 45, 70, 50, 80, 65, 90, 75, 60, 80, 50, 70, 90, 100].map((h, i) => (
              <div 
                key={i} 
                className="w-full rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
         </div>
      </div>
    </div>
  );
}
