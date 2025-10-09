export const locales = ["he", "en"] as const;
export const defaultLocale = "he" as const;

export type AppLocale = typeof locales[number];

export function resolveLocale(input: string | string[] | undefined): AppLocale | null {
  if (!input) {
    return defaultLocale;
  }

  const value = Array.isArray(input) ? input[0] : input;
  return locales.includes(value as AppLocale) ? (value as AppLocale) : null;
}

export function dirForLocale(locale: AppLocale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}
