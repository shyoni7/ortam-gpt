import { AdminApp } from "./_components/admin-app";
import { getSiteContent } from "@/lib/content";
import type { Locale, SiteContent } from "@/content/types";
import { locales } from "@/i18n/request";

export default async function AdminPage() {
  const entries = await Promise.all(locales.map(async (locale) => [locale, await getSiteContent(locale as Locale)] as const));
  const initialContent = entries.reduce<Record<Locale, SiteContent>>((acc, [locale, content]) => {
    acc[locale as Locale] = content;
    return acc;
  }, {} as Record<Locale, SiteContent>);
  return <AdminApp initialContent={initialContent} />;
}
