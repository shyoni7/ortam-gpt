import { notFound } from "next/navigation";
import { AboutView } from "@/components/views/about-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return <AboutView content={content.pages.about} />;
}
