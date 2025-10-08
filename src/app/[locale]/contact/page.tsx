import { notFound } from "next/navigation";
import { ContactView } from "@/components/views/contact-view";
import { resolveLocale } from "@/i18n/request";
import { getSiteContent } from "@/lib/content";

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = await getSiteContent(locale);
  return <ContactView locale={locale} content={content.pages.contact} />;
}
