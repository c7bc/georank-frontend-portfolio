import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { locales, defaultLocale } from "./routing";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requested = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../dictionaries/${locale}.json`)).default,
  };
});
