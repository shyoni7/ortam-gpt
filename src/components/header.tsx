"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { AppLocale } from "@/i18n/request";
import type { Navigation } from "@/content/types";
import { buildNavigationHref, isExternalNavigationHref } from "@/lib/navigation";

const switchLocale: Record<AppLocale, AppLocale> = {
  he: "en",
  en: "he",
};

const languageLabels: Record<AppLocale, string> = {
  he: "English",
  en: "עברית",
};

function buildLocalizedPath(pathname: string | null, nextLocale: AppLocale) {
  if (!pathname) {
    return `/${nextLocale}`;
  }
  const segments = pathname.split("/").filter(Boolean);
  segments[0] = nextLocale;
  return `/${segments.join("/")}`;
}

type HeaderProps = {
  locale: AppLocale;
  brandName: string;
  navigation: Navigation;
};

export function Header({ locale, brandName, navigation }: HeaderProps) {
  const pathname = usePathname();
  const nextLocale = switchLocale[locale];
  const languageHref = buildLocalizedPath(pathname, nextLocale);
  const items = [...navigation.header.items].sort((a, b) => a.order - b.order);

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold text-primary-300">
          {brandName}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {items.map((item) => {
            const href = buildNavigationHref(locale, item.path);
            const isExternal = isExternalNavigationHref(href) || href.startsWith("#");
            const isActive =
              !isExternal && (pathname === href || (href.endsWith("/") && pathname === href.slice(0, -1)));
            return (
              <Link
                key={`${item.title}-${item.order}`}
                href={href}
                prefetch={!isExternal}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className={clsx("transition-colors hover:text-accent-300", isActive && "text-accent-200")}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <Link
          href={languageHref}
          prefetch={false}
          className="rounded-full border border-slate-700 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100 transition-colors hover:border-accent-400 hover:text-accent-200"
        >
          {languageLabels[nextLocale]}
        </Link>
      </div>
    </header>
  );
}
