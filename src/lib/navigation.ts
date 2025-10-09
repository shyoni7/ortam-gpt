import type { AppLocale } from "@/i18n/request";

const EXTERNAL_PATTERN = /^(https?:|mailto:|tel:)/i;

export function buildNavigationHref(locale: AppLocale, path: string | undefined | null) {
  if (!path || path === "/") {
    return `/${locale}`;
  }
  if (EXTERNAL_PATTERN.test(path) || path.startsWith("#")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function isExternalNavigationHref(href: string) {
  return EXTERNAL_PATTERN.test(href);
}
