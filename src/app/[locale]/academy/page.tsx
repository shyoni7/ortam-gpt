import { notFound } from "next/navigation";
import { AcademyView } from "@/components/views/academy-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function AcademyPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return <AcademyView content={content.pages.academy} />;
}
