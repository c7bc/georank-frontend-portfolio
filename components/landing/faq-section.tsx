"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";

export function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Array<{
    question: string;
    answer: string;
  }>;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="metafi-faq" className="bg-background px-6 lg:px-0">
      <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 lg:py-28">
        <p className="text-primary mb-4 text-center text-sm leading-tight font-medium sm:text-base">
          {t("tagline")}
        </p>

        <h2 className="text-foreground mx-auto mb-4 max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>

        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base font-normal sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 sm:mt-14">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-card rounded-[16px] border px-4 py-2 sm:px-6 sm:py-4 border-border shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-4 text-left text-foreground text-xl leading-tight font-medium sm:text-2xl hover:no-underline py-1 sm:py-2"
                >
                  <span className="pr-2">{item.question}</span>
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-border text-muted-foreground"
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus className="size-3" />
                    ) : (
                      <Plus className="size-3" />
                    )}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[height] duration-200"
                  style={{ height: isOpen ? "auto" : "0px" }}
                >
                  <div className="text-muted-foreground mt-2 pb-2 text-sm font-normal whitespace-pre-wrap sm:text-base">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
