"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const logos = [
  {
    name: "ChatGPT",
    src: "https://freelogopng.com/images/all_img/1681038472chatgpt-logo.png",
  },
  {
    name: "Claude",
    src: "https://i.logos-download.com/114232/31116-05a1502c46130721c61b3a89eb569886.png/Claude_Logo_2023.png?dl",
  },
  {
    name: "Perplexity",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Perplexity_AI_logo.svg/1280px-Perplexity_AI_logo.svg.png",
  },
  {
    name: "Gemini",
    src: "https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-PNG-Photos.png",
  },
  {
    name: "Grok",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Grok-feb-2025-logo.svg/330px-Grok-feb-2025-logo.svg.png",
  },
  {
    name: "DeepSeek",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/DeepSeek_logo.svg/1280px-DeepSeek_logo.svg.png",
  },
];

export function SocialProofCarousel() {
  const t = useTranslations("socialProof");

  return (
    <section className="bg-background py-10 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h1 className="my-6 max-w-4xl text-2xl font-medium tracking-tighter text-foreground md:text-3xl text-center mx-auto">
          Monitor your visibility across <span className="text-muted-foreground/60">leading AI platforms</span>
        </h1>
        
        <div className="relative mx-auto flex flex-col items-center justify-center pt-8 md:pt-16 overflow-hidden">
           <div className="group flex overflow-hidden p-0 [--gap:0rem] [gap:var(--gap)] flex-row w-full [--duration:40s]">
             <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row min-w-full group-hover:[animation-play-state:paused]">
               {[...logos, ...logos, ...logos].map((logo, index) => (
                 <div key={`${logo.name}-${index}`} className="flex w-[200px] h-32 flex-col items-center justify-center p-6 relative border-y border-r border-border -ml-px group/item hover:bg-muted/30 transition-colors">
                    <p className="absolute top-3 left-3 text-xs font-mono text-muted-foreground/50 tracking-tighter">
                      {String((index % logos.length) + 1).padStart(2, "0")}
                    </p>
                    <img
                      alt={logo.name}
                      src={logo.src}
                      className="h-8 w-auto brightness-0 contrast-[90%] hue-rotate-[190deg] invert-[0.43] saturate-[180%] sepia-[0.06] opacity-70 group-hover/item:opacity-100 transition-opacity"
                    />
                 </div>
               ))}
             </div>
             <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row min-w-full group-hover:[animation-play-state:paused]" aria-hidden="true">
               {[...logos, ...logos, ...logos].map((logo, index) => (
                 <div key={`${logo.name}-duplicate-${index}`} className="flex w-[200px] h-32 flex-col items-center justify-center p-6 relative border-y border-r border-border -ml-px group/item hover:bg-muted/30 transition-colors">
                    <p className="absolute top-3 left-3 text-xs font-mono text-muted-foreground/50 tracking-tighter">
                      {String((index % logos.length) + 1).padStart(2, "0")}
                    </p>
                    <img
                      alt={logo.name}
                      src={logo.src}
                      className="h-8 w-auto brightness-0 contrast-[90%] hue-rotate-[190deg] invert-[0.43] saturate-[180%] sepia-[0.06] opacity-70 group-hover/item:opacity-100 transition-opacity"
                    />
                 </div>
               ))}
             </div>
           </div>
          
           <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
