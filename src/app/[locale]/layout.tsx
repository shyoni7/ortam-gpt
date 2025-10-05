import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LocaleAttributes } from "@/components/locale-attributes";
import {
  dirForLocale,
  resolveLocale,
  locales,
  type AppLocale,
} from "@/i18n/request";

type LayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const dir = dirForLocale(locale);

  return (
    <body lang={locale} dir={dir} className="bg-slate-950 text-slate-100 antialiased">
      <LocaleAttributes locale={locale} />
      <div className="flex min-h-screen flex-col">
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </div>
    </body>
  );
}
