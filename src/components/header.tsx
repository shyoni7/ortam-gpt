"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { AppLocale } from "@/i18n/request";

const navItems: Record<AppLocale, { label: string; href: (locale: AppLocale) => string }[]> = {
  he: [
    { label: "בית", href: (locale) => `/${locale}` },
    { label: "עלינו", href: (locale) => `/${locale}/about` },
    { label: "אקדמיה", href: (locale) => `/${locale}/academy` },
    { label: "חממה", href: (locale) => `/${locale}/incubator` },
    { label: "השמה", href: (locale) => `/${locale}/placement` },
    { label: "צור קשר", href: (locale) => `/${locale}/contact` },
  ],
  en: [
    { label: "Home", href: (locale) => `/${locale}` },
    { label: "About", href: (locale) => `/${locale}/about` },
    { label: "Academy", href: (locale) => `/${locale}/academy` },
    { label: "Incubator", href: (locale) => `/${locale}/incubator` },
    { label: "Placement", href: (locale) => `/${locale}/placement` },
    { label: "Contact", href: (locale) => `/${locale}/contact` },
  ],
};

const switchLabel: Record<AppLocale, string> = {
  he: "English",
  en: "עברית",
};

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

export function Header({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const nextLocale = switchLocale[locale];
  const languageHref = buildLocalizedPath(pathname, nextLocale);

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold text-primary-300">
          ORTAM AI
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {navItems[locale].map((item) => (
            <Link
              key={item.label}
              href={item.href(locale)}
              className={clsx(
                "transition-colors hover:text-accent-300",
                pathname === item.href(locale) && "text-accent-200"
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
          {switchLabel[locale]}
        </Link>
      </div>
    </header>
  );
}
