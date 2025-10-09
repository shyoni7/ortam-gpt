import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import { assertValidSiteContent, parseSiteContent } from "@/content/schema";
import type { Locale, SiteContent } from "@/content/types";

const contentCache = new Map<Locale, SiteContent>();

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function contentFilePath(locale: Locale) {
  return path.join(process.cwd(), "content", `site.${locale}.json`);
}

async function loadFromDisk(locale: Locale): Promise<SiteContent> {
  const filePath = contentFilePath(locale);
  const file = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(file);
  const siteContent = parseSiteContent(parsed);
  assertValidSiteContent(siteContent);
  return siteContent;
}

const loadContent = cache(async (locale: Locale) => {
  if (contentCache.has(locale)) {
    return contentCache.get(locale)!;
  }
  const data = await loadFromDisk(locale);
  const snapshot = clone(data);
  contentCache.set(locale, snapshot);
  return snapshot;
});

export async function getSiteContent(locale: Locale): Promise<SiteContent> {
  const data = await loadContent(locale);
  return clone(data);
}

export function setSiteContent(locale: Locale, data: SiteContent) {
  assertValidSiteContent(data);
  contentCache.set(locale, clone(data));
}

export async function writeSiteContent(locale: Locale, data: SiteContent) {
  assertValidSiteContent(data);
  const filePath = contentFilePath(locale);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  contentCache.set(locale, clone(data));
}

export function clearSiteContentCache(locale?: Locale) {
  if (locale) {
    contentCache.delete(locale);
    return;
  }
  contentCache.clear();
}
