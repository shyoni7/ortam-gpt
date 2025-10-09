import { notFound } from "next/navigation";
import { PlacementView } from "@/components/views/placement-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function PlacementPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return <PlacementView content={content.pages.placement} />;
}
