import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LocaleAttributes } from "@/components/locale-attributes";
import { resolveLocale, locales, dirForLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

type LayoutParams = {
  params: { locale: string };
};

type LayoutProps = LayoutParams & {
  children: ReactNode;
};

function applyTitleTemplate(title: string, template?: string) {
  if (template && template.includes("%s")) {
    return template.replace("%s", title);
  }
  return title || "ORTAM AI";
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const locale = resolveLocale(params.locale);
  if (!locale) {
    return {};
  }
  const content = await getSiteContent(locale);
  const homeTitle = content.pages.home.title;
  const title = applyTitleTemplate(homeTitle, content.meta?.titleTemplate);
  return {
    title,
    description: content.meta?.description,
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return (
    <>
      <LocaleAttributes locale={locale} />
      <div className="flex min-h-screen flex-col" lang={locale} dir={dirForLocale(locale)}>
        <Header locale={locale} brandName={content.brandName} navigation={content.navigation} />
        <main>{children}</main>
        <Footer locale={locale} navigation={content.navigation} contact={content.pages.contact} />
      </div>
    </>
  );
}
