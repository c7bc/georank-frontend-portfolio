"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface LegalPageProps {
  translationNamespace: string;
}

export function LegalPage({ translationNamespace }: LegalPageProps) {
  const t = useTranslations(translationNamespace);
  const sections = t.raw("sections") as {
    heading: string;
    content: string;
  }[];

  return (
    <div className="container mx-auto max-w-6xl px-0 py-16 sm:py-20 md:px-6 md:py-24">
      {/* Hero */}
      <div className="bg-card/30 relative overflow-hidden rounded-[24px] border border-border/60 px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20">
        <p className="text-primary text-sm font-medium sm:text-base">
          {t("tagline")}
        </p>
        <h1 className="text-foreground mt-4 text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-base sm:text-lg">
          {t("subtitle")}
        </p>
        <p className="text-muted-foreground/80 mt-3 text-xs">
          {t("updated")}
        </p>
      </div>

      {/* Content */}
      <div className="mt-8 sm:mt-10 md:mt-12">
        <div className="mx-auto max-w-3xl rounded-[16px] p-6 sm:p-8 md:p-10">
          <article className="space-y-6">
            {/* Intro */}
            <p className="text-muted-foreground text-base leading-7 sm:text-lg italic">
              {t("lastUpdated")}
            </p>
            <p className="text-muted-foreground text-base leading-7 sm:text-lg">
              {t("intro")}
            </p>

            {/* Sections */}
            {sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl mt-8">
                  {section.heading}
                </h2>
                <div
                  className="text-muted-foreground text-base leading-7 sm:text-lg
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mt-2
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mt-2
                    [&_li]:text-muted-foreground
                    [&_strong]:text-foreground [&_strong]:font-semibold
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80
                    [&_code]:text-foreground [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm
                    [&_p]:mt-3 [&_p]:first:mt-0"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}

            {/* Contact */}
            <hr className="border-border my-8" />
            <p className="text-muted-foreground text-base leading-7 sm:text-lg">
              {t.rich("contact", {
                email: (chunks) => (
                  <a
                    href="mailto:contact@georank.site"
                    className="text-primary underline underline-offset-2 hover:opacity-80"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </article>
        </div>
      </div>

      <div className="h-10 sm:h-12 md:h-14" />
    </div>
  );
}
