"use client";

import { useEffect } from "react";
import { dirForLocale, type AppLocale } from "@/i18n/request";

export function LocaleAttributes({ locale }: { locale: AppLocale }) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", locale);
    const dir = dirForLocale(locale);
    html.setAttribute("dir", dir);
    document.body.setAttribute("dir", dir);
    document.body.setAttribute("lang", locale);
  }, [locale]);

  return null;
}
