import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section id="georank-404" className="bg-background relative overflow-hidden px-6 lg:px-0">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[500px]">
          <div className="from-background/0 to-background absolute inset-0 bg-gradient-to-b"></div>
        </div>
      </div>
      <div className="relative container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32 md:py-44">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-primary mb-3 text-sm font-medium tracking-wide uppercase">
            {t("tagline")}
          </h1>
          <h2 className="text-foreground text-[80px] leading-none font-semibold sm:text-[120px] md:text-[160px]">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-12 px-6 py-[14px] w-full sm:w-auto"
            >
              {t("backHome")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background text-foreground border border-border shadow-sm hover:bg-muted h-12 px-6 py-[14px] w-full sm:w-auto"
            >
              {t("contactSupport")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
