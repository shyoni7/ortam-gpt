import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import { siteContentSchema } from "@/content/schema";
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
  const validated = siteContentSchema.parse(parsed);
  return validated;
}

const loadContent = cache(async (locale: Locale) => {
  if (contentCache.has(locale)) {
    return contentCache.get(locale)!;
  }
  const data = await loadFromDisk(locale);
  contentCache.set(locale, data);
  return data;
});

export async function getSiteContent(locale: Locale): Promise<SiteContent> {
  const data = await loadContent(locale);
  return clone(data);
}

export function setSiteContent(locale: Locale, data: SiteContent) {
  const validated = siteContentSchema.parse(data);
  contentCache.set(locale, validated);
}

export async function writeSiteContent(locale: Locale, data: SiteContent) {
  const validated = siteContentSchema.parse(data);
  const filePath = contentFilePath(locale);
  await fs.writeFile(filePath, JSON.stringify(validated, null, 2));
  contentCache.set(locale, validated);
}

export function clearSiteContentCache(locale?: Locale) {
  if (locale) {
    contentCache.delete(locale);
    return;
  }
  contentCache.clear();
}
