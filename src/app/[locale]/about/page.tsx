import { notFound } from "next/navigation";
import { resolveLocale, type AppLocale } from "@/i18n/request";

const content: Record<AppLocale, { title: string; paragraphs: string[] }> = {
  he: {
    title: "על ORTAM AI",
    paragraphs: [
      "ORTAM AI הוקמה כדי לבנות גשרים בין ארגונים מסורתיים לעולם מבוסס AI.",
      "אנחנו משלבים חדשנות טכנולוגית עם פדגוגיה ומסלולי קריירה כדי ליצור אימפקט בר קיימא.",
      "הצוות שלנו מגיע מרקע של ערים חכמות, אקדמיה וסטארט-אפים ויודע להניע תהליכי אימוץ מלאים.",
    ],
  },
  en: {
    title: "About ORTAM AI",
    paragraphs: [
      "ORTAM AI was founded to bridge traditional organizations into the AI-first world.",
      "We combine technology incubation, education, and workforce placement to drive lasting change.",
      "Our team brings expertise from smart cities, academia, and startups to deliver end-to-end adoption programs.",
    ],
  },
};

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const page = content[locale];

  return (
    <div className="container-page space-y-8 py-16">
      <h1 className="text-3xl font-bold text-primary-200">{page.title}</h1>
      <div className="space-y-4 text-sm text-slate-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
