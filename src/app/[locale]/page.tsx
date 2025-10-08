import { notFound } from "next/navigation";
import { HomeView } from "@/components/views/home-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  const relatedPages = [content.pages.academy, content.pages.incubator, content.pages.placement];
  return <HomeView locale={locale} content={content.pages.home} relatedPages={relatedPages} />;
}
