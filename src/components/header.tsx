"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSiteContent } from "@/components/content-provider";
import type { AppLocale } from "@/i18n/request";

const switchLocale: Record<AppLocale, AppLocale> = {
  he: "en",
  en: "he",
};

function buildLocalizedPath(pathname: string | null, nextLocale: AppLocale) {
  if (!pathname) {
    return `/${nextLocale}`;
  }

  const segments = pathname.split("/").filter(Boolean);
  segments[0] = nextLocale;
  return `/${segments.join("/")}`;
}

export function Header() {
  const { locale, content } = useSiteContent();
  const pathname = usePathname();
  const nextLocale = switchLocale[locale];
  const languageHref = buildLocalizedPath(pathname, nextLocale);
  const links = content.navigation.links;

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold text-primary-300">
          {content.navigation.brand}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {links.map((item) => (
            <Link
              key={item.label}
              href={`/${locale}${item.path}`}
              className={clsx(
                "transition-colors hover:text-accent-300",
                pathname === `/${locale}${item.path}` && "text-accent-200"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={languageHref}
          prefetch={false}
          className="rounded-full border border-slate-700 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100 transition-colors hover:border-accent-400 hover:text-accent-200"
        >
          {content.navigation.languageSwitchLabel}
        </Link>
      </div>
    </header>
  );
}
