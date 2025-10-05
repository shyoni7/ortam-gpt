"use client";

import { useEffect } from "react";
import { dirForLocale, type AppLocale } from "@/i18n/request";

export function LocaleAttributes({ locale }: { locale: AppLocale }) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", locale);
    html.setAttribute("dir", dirForLocale(locale));
  }, [locale]);

  return null;
}
