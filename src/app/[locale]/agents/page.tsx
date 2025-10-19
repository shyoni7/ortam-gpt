import { notFound } from "next/navigation";
import { AgentsBuilderView } from "@/components/views/agents-builder-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function AgentsBuilderPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return <AgentsBuilderView locale={locale} content={content.pages.agents} />;
}
