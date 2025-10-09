"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import defaultContent from "@/content/default-content";
import type { LocaleSiteContent, SiteContent } from "@/content/types";
import type { AppLocale } from "@/i18n/request";

const STORAGE_KEY = "ortam-ai-site-content";

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeWithDefaults(stored?: Partial<LocaleSiteContent>): LocaleSiteContent {
  return {
    he: {
      ...defaultContent.he,
      ...(stored?.he ? clone(stored.he) : {}),
    },
    en: {
      ...defaultContent.en,
      ...(stored?.en ? clone(stored.en) : {}),
    },
  } satisfies LocaleSiteContent;
}

function readFromStorage(): LocaleSiteContent {
  if (typeof window === "undefined") {
    return clone(defaultContent);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultContent);
    }
    const parsed = JSON.parse(raw) as Partial<LocaleSiteContent>;
    return mergeWithDefaults(parsed);
  } catch (error) {
    console.warn("Failed to parse stored content", error);
    return clone(defaultContent);
  }
}

function writeToStorage(content: LocaleSiteContent) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    console.warn("Failed to persist admin content", error);
  }
}

interface ContentContextValue {
  locale: AppLocale;
  content: SiteContent;
  updateContent: (next: SiteContent) => void;
  resetLocale: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

interface ContentProviderProps {
  locale: AppLocale;
  initialContent: SiteContent;
  children: ReactNode;
}

export function ContentProvider({ locale, initialContent, children }: ContentProviderProps) {
  const storedRef = useRef<LocaleSiteContent>(readFromStorage());
  const [current, setCurrent] = useState<SiteContent>(() => {
    return storedRef.current[locale] ?? clone(initialContent);
  });

  useEffect(() => {
    setCurrent(storedRef.current[locale] ?? clone(initialContent));
  }, [initialContent, locale]);

  useEffect(() => {
    const nextCache: LocaleSiteContent = {
      ...storedRef.current,
      [locale]: clone(current),
    } as LocaleSiteContent;
    storedRef.current = nextCache;
    writeToStorage(nextCache);
  }, [current, locale]);

  const value = useMemo<ContentContextValue>(
    () => ({
      locale,
      content: current,
      updateContent: (next) => {
        setCurrent(clone(next));
      },
      resetLocale: () => {
        const merged: LocaleSiteContent = {
          ...storedRef.current,
          [locale]: clone(initialContent),
        } as LocaleSiteContent;
        storedRef.current = merged;
        setCurrent(clone(initialContent));
        writeToStorage(merged);
      },
    }),
    [current, initialContent, locale]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentContext(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return ctx;
}

export function clearStoredContent() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear stored content", error);
  }
}
