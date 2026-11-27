"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Zap, BarChart3, Webhook, Mail, MessageSquare } from "lucide-react";

const integrationsBase = [
  { icon: MessageSquare, name: "Slack", color: "text-pink-500", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/500px-Slack_icon_2019.svg.png" },
  { icon: MessageSquare, name: "Discord", color: "text-indigo-500", logo: "https://pngimg.com/d/discord_PNG8.png" },
  { icon: Zap, name: "Zapier", color: "text-orange-500", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKO-Qo92EcDepDsm1eVJtZeIO-gYLYqvqVCQ&s" },
  { icon: Webhook, name: "Webhooks", color: "text-foreground" },
  { icon: Mail, name: "Email Notifications", color: "text-blue-500", logo: "https://cdn.iconscout.com/icon/free/png-256/free-gmail-logo-icon-svg-download-png-2476484.png?f=webp" },
  { icon: BarChart3, name: "Google Analytics", color: "text-yellow-500", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2JD4rqFRrEukP9ejsQl5jL-lhIXWxzGCVow&s" },
];

const integrations = [...integrationsBase, ...integrationsBase];

export function ToolkitVisual() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-background border border-border shadow-sm [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      
      <div className="relative z-10 flex flex-col justify-center gap-6 py-8 h-full">
        {/* Row 1 - Left to Right */}
        <div className="group flex overflow-hidden p-0 [--gap:0.5rem] [gap:var(--gap)] flex-row [--duration:40s]">
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
            {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
            {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="group flex overflow-hidden p-0 [--gap:0.5rem] [gap:var(--gap)] flex-row [--duration:40s]">
          <div 
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
            style={{ animationDirection: "reverse" }}
          >
             {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
          <div 
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
            style={{ animationDirection: "reverse" }}
            aria-hidden="true"
          >
             {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Left to Right */}
        <div className="group flex overflow-hidden p-0 [--gap:0.5rem] [gap:var(--gap)] flex-row [--duration:40s]">
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
            {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
            {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4 - Right to Left */}
        <div className="group flex overflow-hidden p-0 [--gap:0.5rem] [gap:var(--gap)] flex-row [--duration:40s]">
          <div 
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
            style={{ animationDirection: "reverse" }}
          >
             {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
          <div 
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
            style={{ animationDirection: "reverse" }}
            aria-hidden="true"
          >
             {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm transition-colors hover:bg-card hover:border-primary/20">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="size-5 object-contain rounded-[var(--radius)]" />
                ) : (
                  <item.icon className={cn("size-5", item.color)} />
                )}
                <p className="text-sm font-medium text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Side Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-36 bg-gradient-to-r from-background to-transparent z-20"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-36 bg-gradient-to-l from-background to-transparent z-20"></div>
    </div>
  );
}
