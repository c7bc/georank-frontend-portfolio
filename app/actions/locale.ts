"use server";

import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { locales } from "@/i18n/routing";

export async function setPublicLocale(locale: string) {
  if (!hasLocale(locales, locale)) return;
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
