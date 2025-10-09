"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppLocale } from "@/i18n/request";
import { defaultContent } from "@/content/default-content";
import type { LocaleSiteContent, SiteContent } from "@/content/types";

const STORAGE_KEY = "ortam-ai-site-content";

export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

type ContentContextValue = {
  locale: AppLocale;
  content: LocaleSiteContent;
  contentMap: SiteContent;
  ready: boolean;
  setLocaleContent: (locale: AppLocale, next: LocaleSiteContent) => void;
  reset: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function mergeWithDefaults(stored: unknown): SiteContent {
  if (!stored || typeof stored !== "object") {
    return deepClone(defaultContent);
  }

  try {
    const parsed = stored as SiteContent;
    return {
      he: { ...defaultContent.he, ...(parsed.he ? deepClone(parsed.he) : {}) },
      en: { ...defaultContent.en, ...(parsed.en ? deepClone(parsed.en) : {}) },
    };
  } catch (error) {
    console.warn("Failed to parse stored content", error);
    return deepClone(defaultContent);
  }
}

export function ContentProvider({ locale, children }: { locale: AppLocale; children: ReactNode }) {
  const [contentMap, setContentMap] = useState<SiteContent>(() => deepClone(defaultContent));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SiteContent;
        setContentMap(mergeWithDefaults(parsed));
      }
    } catch (error) {
      console.warn("Failed to load stored content", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contentMap));
  }, [contentMap, ready]);

  const setLocaleContent = (targetLocale: AppLocale, next: LocaleSiteContent) => {
    setContentMap((previous) => ({ ...previous, [targetLocale]: deepClone(next) }));
  };

  const reset = () => {
    setContentMap(deepClone(defaultContent));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<ContentContextValue>(
    () => ({
      locale,
      content: contentMap[locale],
      contentMap,
      ready,
      setLocaleContent,
      reset,
    }),
    [locale, contentMap, ready]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within a ContentProvider");
  }
  return ctx;
}
