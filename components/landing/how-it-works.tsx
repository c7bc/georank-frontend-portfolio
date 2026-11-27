"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Globe, Bot, Lightbulb } from "lucide-react";
import { useState } from "react";

const icons = [Globe, Bot, Lightbulb];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{
    number: string;
    title: string;
    description: string;
  }>;

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </motion.div>

        <div className="mt-16 grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = icons[index];
            return <StepCard key={step.number} step={step} index={index} Icon={Icon} />;
          })}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  Icon,
}: {
  step: { number: string; title: string; description: string };
  index: number;
  Icon: typeof Globe;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full"
    >
      <div
        className="group relative h-full overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-primary/5 to-transparent p-4 md:p-6 md:py-8"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover glow effect */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: isHovered
              ? `radial-gradient(500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 60%)`
              : undefined,
          }}
        />

        <div className="flex w-full flex-col items-start justify-center">
          <Icon className="h-10 w-10 text-foreground" strokeWidth={1.5} />

          <div className="relative flex w-full flex-col items-start">
            {/* Number badge */}
            <span className="absolute -top-6 right-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border pt-0.5 text-2xl font-medium text-foreground">
              {index + 1}
            </span>

            <h3 className="mt-6 text-base font-medium text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
