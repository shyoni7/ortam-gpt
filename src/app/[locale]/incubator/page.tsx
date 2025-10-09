import { notFound } from "next/navigation";
import { IncubatorView } from "@/components/views/incubator-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function IncubatorPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return <IncubatorView content={content.pages.incubator} />;
}
