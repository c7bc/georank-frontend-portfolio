"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  visual: ReactNode;
  className?: string;
  visualPosition?: "top" | "bottom" | "right";
}

export function FeatureCard({
  title,
  description,
  icon,
  visual,
  className,
  visualPosition = "top",
}: FeatureCardProps) {
  const isHorizontal = visualPosition === "right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "border border-border/60 bg-card",
        "[box-shadow:0_-20px_80px_-20px_rgba(139,92,246,0.1)_inset]",
        "transition-all duration-300 hover:border-primary/30",
        isHorizontal ? "flex flex-col lg:flex-row" : "flex flex-col justify-between",
        className
      )}
    >
      {visualPosition === "top" && (
        <div className="relative min-h-[200px] flex-1 overflow-hidden">{visual}</div>
      )}

      <div
        className={cn(
          "pointer-events-none z-10 flex flex-col gap-2 p-6 transition-all duration-300 group-hover:-translate-y-2",
          isHorizontal && "lg:w-[45%] lg:shrink-0 lg:justify-center"
        )}
      >
        <div className="text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
      </div>

      {visualPosition === "bottom" && (
        <div className="relative min-h-[200px] overflow-hidden">{visual}</div>
      )}

      {visualPosition === "right" && (
        <div className="relative min-h-[180px] flex-1 overflow-hidden lg:min-h-0">
          {visual}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-primary/[0.02]" />
    </motion.div>
  );
}
