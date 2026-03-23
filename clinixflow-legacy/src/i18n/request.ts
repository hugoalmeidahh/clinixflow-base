import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["pt-BR", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt-BR";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // Priority: cookie > Accept-Language header > default
  let locale: Locale = defaultLocale;

  const cookieLocale = cookieStore.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    const acceptLanguage = headerStore.get("accept-language") || "";
    const browserLocale = acceptLanguage.split(",")[0]?.trim();
    if (browserLocale) {
      const matched = locales.find(
        (l) =>
          browserLocale.startsWith(l) ||
          browserLocale.startsWith(l.split("-")[0]),
      );
      if (matched) locale = matched;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}/index.ts`)).default,
  };
});
