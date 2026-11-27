"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { GeoRankIcon } from "./georank-icon";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "./language-switcher";

const productHrefs = ["/features", "/integrations", "/pricing"];
const companyHrefs = ["/contact"];
const legalHrefs = ["/privacy", "/terms", "/cookie-policy"];

export function Footer() {
  const t = useTranslations("footer");

  const columns = [
    {
      title: t("product.title"),
      links: t.raw("product.links") as string[],
      hrefs: productHrefs,
    },
    {
      title: t("company.title"),
      links: t.raw("company.links") as string[],
      hrefs: companyHrefs,
    },
    {
      title: t("legal.title"),
      links: t.raw("legal.links") as string[],
      hrefs: legalHrefs,
    },
  ];

  return (
    <footer className="bg-primary dark:bg-muted/40 text-primary-foreground dark:text-foreground px-2.5 lg:px-0">
      <div className="container max-w-[1200px] mx-auto py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="md:min-w-[140px]">
            <Link href="/" aria-label="GeoRank" className="flex items-center gap-2">
              <GeoRankIcon className="text-primary-foreground dark:text-foreground" size={28} />
              <span className="text-xl font-semibold tracking-tight text-primary-foreground dark:text-foreground">
                GeoRank
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:flex md:w-[525px] md:items-start md:justify-between md:gap-0">
            {columns.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="text-primary-foreground/60 dark:text-muted-foreground mb-4 text-sm leading-tight font-medium">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link: string, i: number) => (
                    <li key={link}>
                      <Link
                        href={column.hrefs[i] || "#"}
                        className="text-primary-foreground/90 hover:text-primary-foreground dark:text-foreground/80 dark:hover:text-foreground text-sm font-normal transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-primary-foreground/20 dark:border-border mt-12 border-t" />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-primary-foreground/60 dark:text-muted-foreground text-sm font-normal">
            {t("copyright")}
          </p>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle variant="ghost" />
          </div>
        </div>
      </div>
    </footer>
  );
}
