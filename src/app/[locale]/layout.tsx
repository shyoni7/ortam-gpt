import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LocaleAttributes } from "@/components/locale-attributes";
import { ContentProvider } from "@/components/content-provider";
import { resolveLocale, locales, dirForLocale } from "@/i18n/request";

type LayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export const metadata: Metadata = {
  title: "ORTAM AI – המרכז לפיתוח AI",
  description:
    "אתר תדמית דו-לשוני ל-ORTAM AI המציג את החממה, האקדמיה ומרכז ההשמה עם תמיכה ב-RTL/LTR.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  const locale = resolveLocale(params.locale) ?? notFound();
  return (
    <>
      <LocaleAttributes locale={locale} />
      <ContentProvider locale={locale}>
        <div className="flex min-h-screen flex-col" lang={locale} dir={dirForLocale(locale)}>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </ContentProvider>
    </>
  );
}
