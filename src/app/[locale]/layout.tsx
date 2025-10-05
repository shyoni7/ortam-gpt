import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { dirForLocale, resolveLocale, type AppLocale } from "@/i18n/request";
import "../globals.css";

export const metadata: Metadata = {
  title: "ORTAM AI – המרכז לפיתוח AI",
  description:
    "ORTAM AI מחברת בין חממה טכנולוגית, מרכז הדרכה ומערך השמה כדי להוביל ארגונים לעידן ה-AI.",
};

type LayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

function ensureLocale(value: string): AppLocale {
  const locale = resolveLocale(value);
  if (!locale) {
    notFound();
  }
  return locale;
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  const locale = ensureLocale(params.locale);
  const dir = dirForLocale(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
